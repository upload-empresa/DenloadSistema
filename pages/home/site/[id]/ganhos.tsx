import { CardMain, CardPacientes } from "../../../../components/Cards"
import { Main } from "../../../../components/Main"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithSiteGanho } from "@/types";
import type { Ganho, Site, Subscription } from "@prisma/client";
import { ButtonAdd, ButtonPacientes } from "@/components/Buttons"

import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import { TitleCards } from "@/components/Title"
import { Pagination } from "@/components/Pagination"
import { HStack, Input, InputGroup, InputLeftElement, Select } from "@chakra-ui/react"
import { MdSearch } from "react-icons/md"
import { CardFinanceiroPlus } from "@/components/Cards/plus"

interface SiteGanhoData {
    ganhos: Array<Ganho>;
    subscriptions: Array<Subscription>
    site: Site | null;
}
//@ts-ignore
export default function Ganhos({ ganhos, ganho, subscriptions }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']

    const router = useRouter();
    const { id: siteId } = router.query;
    const { id: ganhoId } = router.query;


    const { data } = useSWR<SiteGanhoData>(
        siteId && `/api/ganho?siteId=${siteId}`,
        fetcher,

    );

    const { data: settings, } = useSWR<WithSiteGanho>(
        `/api/ganho?ganhoId=${ganhoId}`,
        fetcher,

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
        const selectApi = async () => {
            const response = await fetch(`/api/ganho?orderBy=${selectedOption}`);
            const data = await response.json();
            setSelectResults(data);
        }

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


    const PER_PAGE = 10;
    const offset = currentPage * PER_PAGE;
    //@ts-ignore
    const pageCount = Math.ceil(data?.ganhos?.length / PER_PAGE);

    const items = data?.ganhos?.slice(offset, offset + PER_PAGE);

    async function deleteGanho(siteId: string, ganhoId: string) {
        setDeletingGanho(true);
        try {
            const response = await fetch(`/api/ganho?siteId=${siteId}&ganhoId=${ganhoId}`, {
                method: HttpMethod.DELETE,
            });

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
        //@ts-ignore
        deleteGanho(siteId, iba);
        toast({
            title: `Ganho deletado com sucesso!`,
            status: 'success',
            isClosable: true,
        })
        window.location.reload()
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(items)

    useEffect(() => {
        const searchApi = async () => {
            const response = await fetch(`/api/ganho??siteId=${siteId}&search=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        }

        if (searchTerm) {
            searchApi();
        } else {
            setSearchResults(ganhos);
        }
    }, [searchTerm]);


    return (

        <Main title={"Financeiro"} button={< ButtonAdd mt={{ md: "0", xxs: "10%" }} text={"Novo Ganho"} onClick={() => {
            setCreatingGanho(true);
            createGanho(siteId as string);
        }
        } creatingPaciente={creatingGanho} />} tamh={0} tamw={0}>
            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardFinanceiroPlus />
                <CardMain radius={"0 18px 18px 0"} w={{ lg: "85%", md: "90%", xxs: "70%" }}>
                    <>
                        <TableContainer>
                            <Stack spacing={6}>
                                <HStack
                                    justify={"space-between"}
                                >
                                    <TitleCards title="Ganhos Totais" />
                                    <HStack>
                                        <InputGroup>
                                            <InputLeftElement
                                                // eslint-disable-next-line react/no-children-prop
                                                children={<MdSearch size={"22px"} />}
                                            />
                                            <Input type='text' placeholder='Pesquisar' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                        </InputGroup>
                                        <Select variant='filled' placeholder='Ordenar por' onChange={handleOptionChange}>
                                            <option value="asc">Ordem alfabética (A-Z)</option>
                                            <option value="desc">Ordem alfabética (Z-A)</option>

                                        </Select>
                                    </HStack>
                                </HStack>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Ações</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Nome do Paciente</Th>
                                            <Th textAlign={"start"} isNumeric color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Data da Consulta</Th>
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
                                                                    href={`/ganho/${data.ganhoId}/dadosganho`} />
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
                                                            </>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        {items?.map((item) => (
                                                            <>
                                                                <Tr key={item.id}>
                                                                    <Td color={"#474749"} fontSize={"14px"}>
                                                                        <ButtonPacientes href={`/ganho/${item.id}`} onClick={() => handleDeleteClick(item.id)} />
                                                                    </Td>
                                                                    <Td color={"#474749"} fontSize={"14px"}>
                                                                        <Link href={`/ganho/${item.id}`}>{item.name}</Link>
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
                                                            </>
                                                        ))}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Tbody >
                                    <Tfoot>
                                        <Tr>
                                        </Tr>
                                    </Tfoot>
                                </Table>
                            </Stack>
                        </TableContainer>

                        <Pagination pageCount={pageCount} handlePageClick={handlePageClick} /></>
                </CardMain>
            </HStack>
        </Main >
    )
}