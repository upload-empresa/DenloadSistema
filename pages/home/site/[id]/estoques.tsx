import { CardMain, CardPacientes } from "../../../../components/Cards"
import { Main } from "../../../../components/Main"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithSiteEstoque } from "@/types";
import type { Estoque, Site, Subscription } from "@prisma/client";
import { ButtonAdd, ButtonPacientes } from "@/components/Buttons"

import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import { TitleCards } from "@/components/Title"
import { Pagination } from "@/components/Pagination"
import { HStack, Input, InputGroup, InputLeftElement, Select, Text } from "@chakra-ui/react"
import { MdSearch } from "react-icons/md"

interface SiteEstoqueData {
    estoques: Array<Estoque>;
    site: Site | null;
    subscriptions: Array<Subscription>
}
//@ts-ignore
export default function Estoques({ estoques, estoque }) {
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const router = useRouter();
    const { id: siteId } = router.query;
    const { id: estoqueId } = router.query;


    const { data } = useSWR<SiteEstoqueData>(
        siteId && `/api/estoque?siteId=${siteId}`,
        fetcher,
    );

    const { data: settings, } = useSWR<WithSiteEstoque>(
        `/api/estoque?estoqueId=${estoqueId}`,
        fetcher,

    );

    const { data: stripe } = useSWR<SiteEstoqueData>(
        `/api/subscription?siteId=${siteId}`,
        fetcher,
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
        const selectApi = async () => {
            const response = await fetch(`/api/estoque?siteId=${siteId}&orderBy=${selectedOption}`);
            const data = await response.json();
            setSelectResults(data);
        }

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
        deleteEstoque(siteId, iba);
        toast({
            title: `Produto deletado com sucesso!`,
            status: 'success',
            isClosable: true,
        })
        window.location.reload()
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(items)

    useEffect(() => {
        const searchApi = async () => {
            const response = await fetch(`/api/estoque??siteId=${siteId}&search=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        }

        if (searchTerm) {
            searchApi();
        } else {
            setSearchResults(estoques);
        }
    }, [searchTerm]);



    return (
        <>
            < Main title={"Estoque"} button={< ButtonAdd mt={{ md: "0", xxs: "10%" }} text={"Novo Produto"} onClick={() => {
                setCreatingEstoque(true);
                createEstoque(siteId as string);
            }
            } creatingPaciente={creatingEstoque} />} w={{ lg: "30%", md: "26%", xxs: "25%" }} altText={"Ícone do Denload"} tamh={51} tamw={56} path={"/perfil.png"}>

                <CardMain radius={"18px"} spacing={5} >
                    <>

                        <TableContainer>
                            <Stack spacing={6}>
                                <HStack
                                    justify={"space-between"}
                                >
                                    <TitleCards title="Todos os produtos" />
                                    <HStack>
                                        <InputGroup>
                                            <InputLeftElement
                                                // eslint-disable-next-line react/no-children-prop
                                                children={<MdSearch size={"22px"} />}
                                            />
                                            <Input type='text' placeholder='Pesquisar' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                        </InputGroup>

                                        <Select value={selectedOption} onChange={handleOptionChange} variant='filled' placeholder='Ordenar por' >
                                            <option value="asc">Ordem alfabética (A-Z)</option>
                                            <option value="desc">Ordem alfabética (Z-A)</option>
                                        </Select>
                                    </HStack>


                                </HStack>

                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Ações</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Nome</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Unidade</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Validade</Th>
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
                                                                    href={`/estoque/${item.id}/adicionar-produto`}
                                                                    onClick={() => handleDeleteClick(item.id)} />
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
                                                                {item.validade}
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                {item.minimo}
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
                                                        {items ? (
                                                            items.length > 0 ? (
                                                                items.map((item) => (
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
                                                                                {item.validade}
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
                                                                ))
                                                            ) : (
                                                                <>
                                                                    <Text
                                                                        as="p"
                                                                        mt={"10%"}
                                                                    >
                                                                        Clique em Novo Estoque para criar um
                                                                    </Text>
                                                                </>
                                                            )
                                                        ) : (
                                                            <p>Carregando...</p>
                                                        )}
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