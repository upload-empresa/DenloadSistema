import { HStack } from "@chakra-ui/react"
import { IoPersonOutline } from "react-icons/io5"
import { MdOutlineInsertDriveFile, MdOutlineImageSearch } from "react-icons/md"

import { CardMainPlus, CardIconPacientes, CardMain, CardPacientes } from "../../../../components/Cards"
import { Main } from "../../../../components/Main"
import { TableMain3 } from "../../../../components/Table/TableMain3"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithSiteGanho } from "@/types";
import type { Ganho, Site } from "@prisma/client";
import Modal from "@/components/Modal";
import { Select } from "@chakra-ui/react"
import { ButtonAdd, ButtonPacientes } from "@/components/Buttons"

import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import { TitleCards, TitleCardsPacientes } from "@/components/Title"
import { Pagination } from "@/components/Pagination"

interface SiteGanhoData {
    ganhos: Array<Ganho>;
    site: Site | null;
}

export default function Ganhos({ ganhos, ganho }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const router = useRouter();
    const { id: siteId } = router.query;
    const { id: ganhoId } = router.query;


    const { data } = useSWR<SiteGanhoData>(
        siteId && `/api/ganho?siteId=${siteId}`,
        fetcher,
        {
            onSuccess: (data) => !data?.site && router.push("/"),
        }
    );

    const { data: settings, } = useSWR<WithSiteGanho>(
        `/api/ganho?ganhoId=${ganhoId}`,
        fetcher,
        {
            onError: () => router.push("/"),
            revalidateOnFocus: false,
        }
    );

    async function createGanho(siteId: string) {
        try {
            const res = await fetch(`/api/ganho?siteId=${siteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/ganho/${data.ganhoId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }


    const [selectedOption, setSelectedOption] = useState('')
    const [selectResults, setSelectResults] = useState<Array<Ganho>>([]);

    const [creatingGanho, setCreatingGanho] = useState(false);
    const [deletingGanho, setDeletingGanho] = useState(false);

    useEffect(() => {
        // função que irá realizar a chamada da API
        const selectApi = async () => {
            const response = await fetch(`http://app.localhost:0/api/ganho?orderBy=${selectedOption}`);
            const data = await response.json();
            setSelectResults(data);
        }

        // chamando a função da API apenas se houver algum termo de pesquisa
        if (selectedOption) {
            selectApi();
        } else {
            setSelectResults(ganhos);
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
    const pageCount = Math.ceil(data?.ganhos?.length / PER_PAGE);

    const items = data?.ganhos?.slice(offset, offset + PER_PAGE);

    async function deleteGanho(siteId: string, ganhoId: string) {
        setDeletingGanho(true);
        try {
            const response = await fetch(`/api/ganho?siteId=${siteId}&ganhoId=${ganhoId}`, {
                method: HttpMethod.DELETE,
            });

            // if (response.ok) {
            //     router.push(`/site/${settings?.site?.id}`);
            // }
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingGanho(false);
        }
    }

    const handleDeleteClick = (iba: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esse ganho?')) {
            return;
        }
        deleteGanho(siteId, iba); // Replace `pacienteId` with the actual ID of the paciente
    };

    return (
        <>
            <select value={selectedOption} onChange={handleOptionChange}>
                <option value="">Selecione uma opção</option>
                <option value="asc">Opção 1</option>
                <option value="desc">Opção 2</option>
            </select>



            {/* <Select variant='filled' placeholder='Filled' /> */}
            < Main title={"Financeiro"} button={< ButtonAdd text={"Novo Ganho"} onClick={() => {
                setCreatingGanho(true);
                createGanho(siteId as string);
            }
            } href={""} />}>
                <CardMain radius={"18px"} spacing={5}>
                    <>

                        <TableContainer>
                            <Stack spacing={6}>
                                <TitleCardsPacientes children={undefined} pacientes={[]}>
                                    <TitleCards title="Ganhos Totais" />
                                </TitleCardsPacientes>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Ações</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Nome</Th>
                                            <Th textAlign={"start"} isNumeric color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Vencimento</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Empresa</Th>
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
                                                                <ButtonPacientes href={`/ganho/${data.ganhoId}/dadosganho`} />
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                <Link href={`/ganho/${item.id}/dadosganho`}>{item.name}</Link>
                                                            </Td>
                                                            <Td
                                                                textAlign={"start"}
                                                                isNumeric
                                                                color={"#474749"}
                                                                fontSize={"14px"}
                                                            >
                                                                {item.recebimento}
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                {item.empresa}
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                {item.valor}
                                                            </Td>

                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                <CardPacientes
                                                                    text={item?.pago ? "Pago" : "Não Pago"}
                                                                    bgOne={item?.pago ? "#0BB7AF26" : "#F64E6026"}
                                                                    color={item?.pago ? "#0BB7AF" : "#F64E60"}
                                                                />
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
                                                            <ButtonPacientes href={""} onClick={() => handleDeleteClick(item.id)} />
                                                        </Td>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            <Link href={`/ganho/${item.id}/dadosganho`}>{item.name}</Link>
                                                        </Td>
                                                        <Td
                                                            textAlign={"start"}
                                                            isNumeric
                                                            color={"#474749"}
                                                            fontSize={"14px"}
                                                        >
                                                            {item.recebimento}
                                                        </Td>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            {item.recebimento}
                                                        </Td>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            {item.valor}
                                                        </Td>

                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            <CardPacientes
                                                                text={item?.pago ? "Pago" : "Não Pago"}
                                                                bgOne={item?.pago ? "#0BB7AF26" : "#F64E6026"}
                                                                color={item?.pago ? "#0BB7AF" : "#F64E60"}
                                                            />
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
            </Main >
        </>

    )
}