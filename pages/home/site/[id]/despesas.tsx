import { HStack, useToast } from "@chakra-ui/react"
import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"

import { CardMain, CardPacientes } from "../../../../components/Cards"
import { Main } from "../../../../components/Main"
import { Pagination } from "@/components/Pagination"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithSiteDespesa } from "@/types";
import type { Despesa, Site, Subscription } from "@prisma/client";
import { ButtonAdd, ButtonPacientes } from "@/components/Buttons"
import { Input, InputGroup, InputLeftElement, Select } from "@chakra-ui/react"
import { MdSearch } from "react-icons/md"
import { CardFinanceiroPlus } from "@/components/Cards/plus"
import { TitleCards } from "@/components/Title"

interface SiteDespesaData {
    despesas: Array<Despesa>;
    subscriptions: Array<Subscription>
    site: Site | null;
}

//@ts-ignore
export default function Despesas({ despesa, despesas }) {
    const [creatingDespesa, setCreatingDespesa] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingDespesa, setDeletingDespesa] = useState(false);
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']

    const router = useRouter();
    const { id: siteId } = router.query;
    const { id: despesaId } = router.query;


    const { data } = useSWR<SiteDespesaData>(
        siteId && `/api/despesa?siteId=${siteId}`,
        fetcher,

    );

    const { data: settings, } = useSWR<WithSiteDespesa>(
        `/api/despesa?despesaId=${despesaId}`,
        fetcher,

    );


    const { data: stripe } = useSWR<SiteDespesaData>(
        `/api/subscription?siteId=${siteId}`,
        fetcher,
    );


    async function createDespesa(siteId: string) {
        try {
            const res = await fetch(`/api/despesa?siteId=${siteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/despesa/${data.despesaId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const [selectedOption, setSelectedOption] = useState('')
    const [selectResults, setSelectResults] = useState<Array<Despesa>>([]);


    useEffect(() => {
        const selectApi = async () => {
            const response = await fetch(`https://app.denload.com/api/despesa?orderBy=${selectedOption}`);
            const data = await response.json();
            setSelectResults(data);
        }

        if (selectedOption) {
            selectApi();
        } else {
            setSelectResults(despesas);
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
    const pageCount = Math.ceil(data?.despesas?.length / PER_PAGE);

    const items = data?.despesas?.slice(offset, offset + PER_PAGE);


    async function redirectEdit() {
        router.push(
            `/despesa/${siteId}/dadosdespesa`
        );
    }

    async function deleteDespesa(siteId: string, despesaId: string) {
        setDeletingDespesa(true);
        try {
            const response = await fetch(`/api/despesa?siteId=${siteId}&despesaId=${despesaId}`, {
                method: HttpMethod.DELETE,
            });

        } catch (error) {
            console.error(error);
        } finally {
            setDeletingDespesa(false);
        }
    }

    const handleDeleteClick = (iba: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esse despesa?')) {
            return;
        }
        //@ts-ignore
        deleteDespesa(siteId, iba);
        toast({
            title: `Despesa deletado com sucesso!`,
            status: 'success',
            isClosable: true,
        })
        window.location.reload()
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(items)

    useEffect(() => {
        const searchApi = async () => {
            const response = await fetch(`/api/despesa??siteId=${siteId}&search=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        }

        if (searchTerm) {
            searchApi();
        } else {
            setSearchResults(despesas);
        }
    }, [searchTerm]);

    return (

        //@ts-ignore
        <Main title={"Financeiro"} button={<ButtonAdd mt={{ md: "0", xxs: "10%" }} text={"Nova Despesa"} onClick={() => {
            setCreatingDespesa(true);
            createDespesa(siteId as string);
        }} href={""} creatingPaciente={creatingDespesa} />} tamh={0} tamw={0}>


            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardFinanceiroPlus />

                <CardMain radius={"0 18px 18px 0"} spacing={5} w={{ md: "90%", xxs: "70%" }}>
                    <>
                        <TableContainer>
                            <Stack spacing={6}>
                                <HStack
                                    justify={"space-between"}
                                >
                                    <TitleCards title="Despesas Totais" />
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
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Nome da Despesa</Th>
                                            <Th textAlign={"start"} isNumeric color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Vencimento</Th>
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
                                                                <Link href={`/despesa/${item.id}/dadosdespesa`}>{item.name}</Link>
                                                            </Td>
                                                            <Td
                                                                textAlign={"start"}
                                                                isNumeric
                                                                color={"#474749"}
                                                                fontSize={"14px"}
                                                            >
                                                                {item.vencimento}
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
                                                                        <ButtonPacientes onClick={() => handleDeleteClick(item.id)} href={""} />
                                                                    </Td>
                                                                    <Td color={"#474749"} fontSize={"14px"}>
                                                                        <Link href={`/despesa/${item.id}/dadosdespesa`}>{item.name}</Link>
                                                                    </Td>
                                                                    <Td
                                                                        textAlign={"start"}
                                                                        isNumeric
                                                                        color={"#474749"}
                                                                        fontSize={"14px"}
                                                                    >
                                                                        {item.vencimento}
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
                                                                        <ButtonPacientes onClick={() => handleDeleteClick(item.id)} href={`/despesa/${item.id}`} />
                                                                    </Td>
                                                                    <Td color={"#474749"} fontSize={"14px"}>
                                                                        <Link href={`/despesa/${item.id}`}>{item.name}</Link>
                                                                    </Td>
                                                                    <Td
                                                                        textAlign={"start"}
                                                                        isNumeric
                                                                        color={"#474749"}
                                                                        fontSize={"14px"}
                                                                    >
                                                                        {item.vencimento}
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
            </HStack>

        </Main>
    )
}