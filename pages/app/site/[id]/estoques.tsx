
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
import type { WithSiteEstoque } from "@/types";
import type { Estoque, Site } from "@prisma/client";
import Modal from "@/components/Modal";
import { ButtonAdd, ButtonPacientes } from "@/components/Buttons"

import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import { TitleCards, TitleCardsPacientes } from "@/components/Title"
import { Pagination } from "@/components/Pagination"
import { Heading, HStack, Input, Button, InputGroup, InputLeftElement, Select } from "@chakra-ui/react"
import { MdSearch } from "react-icons/md"

interface SiteEstoqueData {
    estoques: Array<Estoque>;
    site: Site | null;
}
//@ts-ignore
export default function Estoques({ estoques, estoque }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        {
            onError: () => router.push("/"),
            revalidateOnFocus: false,
        }
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
                router.push(`/estoque/${data.estoqueId}/adicionar-produto`);
            }
        } catch (error) {
            console.error(error);
        }
    }


    const [selectedOption, setSelectedOption] = useState('')
    const [selectResults, setSelectResults] = useState<Array<Estoque>>([]);

    const [creatingEstoque, setCreatingEstoque] = useState(false);
    const [deletingEstoque, setDeletingEstoque] = useState(false);

    useEffect(() => {
        // função que irá realizar a chamada da API
        const selectApi = async () => {
            const response = await fetch(`http://app.localhost:3000/api/estoque?orderBy=${selectedOption}`);
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


    const PER_PAGE = 10;
    const offset = currentPage * PER_PAGE;
    //@ts-ignore
    const pageCount = Math.ceil(data?.estoques?.length / PER_PAGE);

    const items = data?.estoques?.slice(offset, offset + PER_PAGE);

    async function deleteEstoque(siteId: string, estoqueId: string) {
        setDeletingEstoque(true);
        try {
            const response = await fetch(`/api/estoque?siteId=${siteId}&estoqueId=${estoqueId}`, {
                method: HttpMethod.DELETE,
            });

            // if (response.ok) {
            //     router.push(`/site/${settings?.site?.id}`);
            // }
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingEstoque(false);
        }
    }

    const handleDeleteClick = (iba: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esse estoque?')) {
            return;
        }
        //@ts-ignore
        deleteEstoque(siteId, iba); // Replace `pacienteId` with the actual ID of the paciente
    };

    //teste pesquisa

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(items)

    useEffect(() => {
        // função que irá realizar a chamada da API
        const searchApi = async () => {
            const response = await fetch(`http://app.localhost:3000/api/estoque?search=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        }

        // chamando a função da API apenas se houver algum termo de pesquisa
        if (searchTerm) {
            searchApi();
        } else {
            setSearchResults(estoques);
        }
    }, [searchTerm]);



    return (
        <>
            <select value={selectedOption} onChange={handleOptionChange}>
                <option value="">Selecione uma opção</option>
                <option value="asc">Opção 1</option>
                <option value="desc">Opção 2</option>
            </select>



            {/* <Select variant='filled' placeholder='Filled' /> */}
            < Main title={"Financeiro"} button={< ButtonAdd text={"Novo Estoque"} onClick={() => {
                setCreatingEstoque(true);
                createEstoque(siteId as string);
            }
            } href={""} />}>
                <CardMain radius={"18px"} spacing={5}>
                    <>

                        <TableContainer>
                            <Stack spacing={6}>
                                {/* <TitleCardsPacientes pacientes={[]}>
                                    <TitleCards title="Estoques Totais" />
                                </TitleCardsPacientes> */}

                                <HStack
                                    justify={"space-between"}
                                >
                                    <HStack>
                                        <InputGroup>
                                            <InputLeftElement
                                                // eslint-disable-next-line react/no-children-prop
                                                children={<MdSearch size={"22px"} />}
                                            />
                                            <Input type='text' placeholder='Pesquisar' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                        </InputGroup>
                                        <Select variant='filled' placeholder='Ordenar por' >
                                            <option value="name">Nome</option>
                                            <option value="age">Idade</option>
                                            <option value="gender">Gênero</option>
                                        </Select>
                                    </HStack>


                                </HStack>

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
                                                                <ButtonPacientes
                                                                    //@ts-ignore
                                                                    href={`/estoque/${item.id}/adicionar-produto`} />
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                <Link href={`/estoque/${item.id}/adicionar-produto`}>{item.name}</Link>
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
                                                {searchTerm ? (
                                                    <>
                                                        {searchResults?.map((item) => (
                                                            <>
                                                                < Tr key={item.id} >
                                                                    <Td color={"#474749"} fontSize={"14px"}>
                                                                        <ButtonPacientes href={`/estoque/${item.id}/adicionar-produto`} onClick={() => handleDeleteClick(item.id)} />
                                                                    </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                        <Link href={`/estoque/${item.id}/adicionar-produto`}>{item.name}</Link>
                                                                    </Td><Td
                                                                        textAlign={"start"}
                                                                        isNumeric
                                                                        color={"#474749"}
                                                                        fontSize={"14px"}
                                                                    >
                                                                        {item.name}
                                                                    </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                        {item.name}
                                                                    </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                        {item.name}
                                                                    </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                        <CardPacientes
                                                                            text={item?.pago ? "Pago" : "Não Pago"}
                                                                            bgOne={item?.pago ? "#0BB7AF26" : "#F64E6026"}
                                                                            color={item?.pago ? "#0BB7AF" : "#F64E60"} />
                                                                    </Td>



                                                                </Tr>
                                                            </>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        {items?.map((item) => (
                                                            <>
                                                                <Tr key={item.id}>
                                                                    <Td color={"#474749"} fontSize={"14px"}>
                                                                        <ButtonPacientes href={`/estoque/${item.id}/adicionar-produto`} onClick={() => handleDeleteClick(item.id)} />
                                                                    </Td>
                                                                    <Td color={"#474749"} fontSize={"14px"}>
                                                                        <Link href={`/estoque/${item.id}/adicionar-produto`}>{item.name}</Link>
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
                                                                        <CardPacientes
                                                                            //@ts-ignore
                                                                            text={item?.pago ? "Pago" : "Não Pago"}
                                                                            //@ts-ignore
                                                                            bgOne={item?.pago ? "#0BB7AF26" : "#F64E6026"}
                                                                            //@ts-ignore
                                                                            color={item?.pago ? "#0BB7AF" : "#F64E60"}
                                                                        />
                                                                    </Td>



                                                                </Tr>

                                                            </>
                                                        ))}
                                                    </>
                                                )}
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