import { ButtonAdd, ButtonPacientes } from "@/components/Buttons"
import { CardMain, CardPacientes } from "../../../../components/Cards"
import { Main } from "../../../../components/Main"
import { TableMain } from "../../../../components/Table"
import { Pagination } from "@/components/Pagination"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithSiteEstoque } from "@/types";
import type { Estoque, Site } from "@prisma/client";
import Modal from "@/components/Modal";
import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import { Select } from "@chakra-ui/react"
import { TitleCards, TitleCardsPacientes } from "@/components/Title"

interface SiteEstoqueData {
    estoques: Array<Estoque>;
    site: Site | null;
}


//@ts-ignore
export default function Estoques({ estoques, estoque }) {
    const [creatingEstoque, setCreatingEstoque] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingEstoque, setDeletingEstoque] = useState(false);

    const router = useRouter();
    const { id: siteId } = router.query;
    const { id: estoqueId } = router.query;


    const { data } = useSWR<SiteEstoqueData>(
        siteId && `/api/estoque?siteId=${siteId}`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.site && router.push("/"),
        // }
    );

    const { data: settings, } = useSWR<WithSiteEstoque>(
        `/api/estoque?estoqueId=${estoqueId}`,
        fetcher,
        // {
        //     onError: () => router.push("/"),
        //     revalidateOnFocus: false,
        // }
    );

    async function createEstoque(siteId: string) {
        try {
            const res = await fetch(`/api/estoque?siteId=${siteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/estoque/${data.estoqueId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }


    async function deleteEstoque(estoqueId: string) {
        setDeletingEstoque(true);
        try {
            const response = await fetch(`/api/estoque?estoqueId=${estoque.id}`, {
                method: HttpMethod.DELETE,
            });

            if (response.ok) {
                router.push(`/site/${settings?.site?.id}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingEstoque(false);
        }
    }

    const [selectedOption, setSelectedOption] = useState('')
    const [selectResults, setSelectResults] = useState<Array<Estoque>>([]);

    useEffect(() => {
        // função que irá realizar a chamada da API
        const selectApi = async () => {
            const response = await fetch(`http://app.localhost:0/api/estoque?orderBy=${selectedOption}`);
            const data = await response.json();
            setSelectResults(data);
        }

        // chamando a função da API apenas se houver algum termo de pesquisa
        if (selectedOption) {
            selectApi();
        } else {
            setSelectResults(estoques);
        }
    }, [selectedOption]);

    function handleOptionChange(event: any) {
        setSelectedOption(event.target.value)
    }

    const [currentPage, setCurrentPage] = useState<number>(0);

    const handlePageClick = (data: any) => {
        setCurrentPage(data.selected);
    }


    const PER_PAGE = 1;
    const offset = currentPage * PER_PAGE;
    //@ts-ignore
    const pageCount = Math.ceil(data?.estoques?.length / PER_PAGE);

    const items = data?.estoques?.slice(offset, offset + PER_PAGE);


    async function redirectEdit() {
        router.push(
            `/estoque/${estoqueId}`
        );
    }


    return (
        <>
            <select value={selectedOption} onChange={handleOptionChange}>
                <option value="">Selecione uma opção</option>
                <option value="asc">Opção 1</option>
                <option value="desc">Opção 2</option>
            </select>

            {/* <Select variant='filled' placeholder='Filled' /> */}

            <Main title={"Estoques"} button={<ButtonAdd text={"Novo Estoque"} onClick={() => {
                setCreatingEstoque(true)
                createEstoque(siteId as string)
            }} href={""} />}>
                <CardMain radius={"18px"} spacing={5}>
                    <>

                        <TableContainer>
                            <Stack spacing={6}>
                                <TitleCardsPacientes
                                    //@ts-ignore
                                    children={undefined} pacientes={[]}>
                                    <TitleCards title="Estoque" />
                                </TitleCardsPacientes>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Ações</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Nome</Th>
                                            <Th textAlign={"start"} isNumeric color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Total</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Unidade</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Valor</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                        {selectedOption ? (
                                            <>
                                                {selectResults ? (
                                                    selectResults.map((item: any) => (
                                                        <Tr key={item.id}>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                <ButtonPacientes onClick2={redirectEdit()} />
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                <Link href={`/paciente/${item.id}/dadospaciente`}>{item.name}</Link>
                                                            </Td>
                                                            <Td
                                                                textAlign={"start"}
                                                                isNumeric
                                                                color={"#474749"}
                                                                fontSize={"14px"}
                                                            >
                                                                {item.valorTotal}
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                {item.unidade}
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                {item.valor}
                                                            </Td>

                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                {/* <CardPacientes
                                                                    text={item?.pago ? "Pago" : "Não Pago"}
                                                                    bgOne={item?.pago ? "#0BB7AF26" : "#F64E6026"}
                                                                    color={item?.pago ? "#0BB7AF" : "#F64E60"}
                                                                /> */}
                                                            </Td>
                                                        </Tr>
                                                    ))


                                                ) : (
                                                    <p>Carregando...</p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {items?.map((item) => (
                                                    <Tr key={item.id}>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            <ButtonPacientes onClick={undefined} href={""} />
                                                        </Td>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            <Link href={`/paciente/${item.id}/dadospaciente`}>{item.name}</Link>
                                                        </Td>
                                                        <Td
                                                            textAlign={"start"}
                                                            isNumeric
                                                            color={"#474749"}
                                                            fontSize={"14px"}
                                                        >
                                                            {item.valorTotal}
                                                        </Td>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            {item.unidade}
                                                        </Td>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            {item.valor}
                                                        </Td>

                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            {/* <CardPacientes
                                                                text={item?.pago ? "Pago" : "Não Pago"}
                                                                bgOne={item?.pago ? "#0BB7AF26" : "#F64E6026"}
                                                                color={item?.pago ? "#0BB7AF" : "#F64E60"}
                                                            /> */}
                                                        </Td>
                                                    </Tr>


                                                ))}
                                            </>
                                        )}





                                    </Tbody>
                                    <Tfoot>
                                        <Tr>
                                        </Tr>
                                    </Tfoot>
                                </Table>
                            </Stack>
                        </TableContainer>
                        <Pagination pageCount={pageCount} handlePageClick={handlePageClick} /></>
                </CardMain>
            </Main>
            <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
                <form
                    onSubmit={async (event) => {
                        event.preventDefault();
                        await deleteEstoque(estoqueId as string);
                    }}
                    className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
                >
                    <h2 className="font-cal text-2xl mb-6">Delete Estoque</h2>
                    <div className="grid gap-y-5 w-5/6 mx-auto">
                        <p className="text-gray-600 mb-3">
                            Are you sure you want to delete your estoque? This action is not
                            reversible.
                        </p>
                    </div>
                    <div className="flex justify-between items-center mt-10 w-full">
                        <button
                            type="button"
                            className="w-full px-5 py-5 text-sm text-gray-400 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            CANCEL
                        </button>

                        <button
                            type="submit"
                            disabled={deletingEstoque}
                            className={`${deletingEstoque
                                ? "cursor-not-allowed text-gray-400 bg-gray-50"
                                : "bg-white text-gray-600 hover:text-black"} w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
                        >
                            {deletingEstoque ? <LoadingDots /> : "DELETE POST"}
                        </button>
                    </div>
                </form>
            </Modal></>

    )
}