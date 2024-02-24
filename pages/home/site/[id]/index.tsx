import { ButtonAdd, ButtonPacientes } from "@/components/Buttons"
import { CardMain, CardPacientes } from "../../../../components/Cards"
import { Main } from "../../../../components/Main"
import { Pagination } from "@/components/Pagination"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithSitePaciente } from "@/types";
import type { Paciente, Site, Subscription } from "@prisma/client";

import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import { HStack, Input, InputGroup, InputLeftElement, Select, Text } from "@chakra-ui/react"
import { MdSearch } from "react-icons/md"
import { TitleCards } from "@/components/Title";

interface SitePacienteData {
    pacientes: Array<Paciente>;
    subscriptions: Array<Subscription>
    site: Site | null;
}


//@ts-ignore
export default function Pacientes({ pacientes, paciente, subscriptions }) {
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']
    const [creatingPaciente, setCreatingPaciente] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingPaciente, setDeletingPaciente] = useState(false);

    const router = useRouter();
    const { id: siteId } = router.query;

    const { id: pacienteId } = router.query;

    const [currentSiteId, setCurrentSiteId] = useState<string | null>(null);


    const { data } = useSWR<SitePacienteData>(
        siteId && `/api/paciente?siteId=${siteId}`,
        fetcher,
    )

    const { data: settings, } = useSWR<WithSitePaciente>(
        `/api/paciente?pacienteId=${pacienteId}`,
        fetcher,
    );



    async function createPaciente(siteId: string) {
        try {
            const res = await fetch(`/api/paciente?siteId=${siteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/paciente/${data.pacienteId}/dadospaciente`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const [selectedOption, setSelectedOption] = useState('')
    const [selectResults, setSelectResults] = useState<Array<Paciente>>([]);

    useEffect(() => {
        const selectApi = async () => {
            const response = await fetch(`/api/paciente?siteId=${siteId}&orderBy=${selectedOption}`);
            const data = await response.json();
            setSelectResults(data);
        }

        if (selectedOption) {
            selectApi();
        } else {
            setSelectResults(pacientes);
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
    const pageCount = Math.ceil(data?.pacientes?.length / PER_PAGE);

    const items = data?.pacientes?.slice(offset, offset + PER_PAGE);

    async function deletePaciente(siteId: string, pacienteId: string) {
        setDeletingPaciente(true);
        try {
            const response = await fetch(`/api/paciente?siteId=${siteId}&pacienteId=${pacienteId}`, {
                method: HttpMethod.DELETE,
            });

        } catch (error) {
            console.error(error);
        } finally {
            setDeletingPaciente(false);
            window.location.reload()
        }
    }

    const handleDeleteClick = (iba: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esse paciente?')) {
            return;
        }
        //@ts-ignore
        deletePaciente(siteId, iba);
        toast({
            title: 'Paciente deletado com sucesso!',
            status: 'success',
            isClosable: true,
        })

    };

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(items)

    useEffect(() => {
        const searchApi = async () => {
            const response = await fetch(`/api/paciente?siteId=${siteId}&search=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        }

        if (searchTerm) {
            searchApi();
        } else {
            setSearchResults(pacientes);
        }
    }, [searchTerm]);



    return (
        <>
            <Main title={"Pacientes"} button={<ButtonAdd mt={{ md: "0", xxs: "10%" }} text={"Novo Paciente"} onClick={() => {
                setCreatingPaciente(true);
                createPaciente(siteId as string);
            }}
                creatingPaciente={creatingPaciente} />} w={"25%"} path={"/perfil.png"} altText={"Ícone do Denload"} tamh={51} tamw={56}>
                <CardMain radius={"18px"} spacing={5}>
                    <>


                        <TableContainer>
                            <Stack spacing={6}>

                                <HStack
                                    justify={"space-between"}
                                    align={{ lg: "none", xxs: "start" }}
                                    flexDir={{ lg: "row", xxs: "column" }}
                                    spacing={0}
                                >
                                    <TitleCards title="Todos os Pacientes" />
                                    <HStack>
                                        <InputGroup>
                                            <InputLeftElement
                                                // eslint-disable-next-line react/no-children-prop
                                                children={<MdSearch size={"22px"} />} />
                                            <Input type='text' placeholder='Pesquisar' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                        </InputGroup>

                                        <Select value={selectedOption} onChange={handleOptionChange} variant='filled' placeholder='Ordenar por'>
                                            <option value="asc">Ordem alfabética (A-Z)</option>
                                            <option value="desc">Ordem alfabética (Z-A)</option>
                                        </Select>
                                    </HStack>


                                </HStack>

                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>Ações</Th>
                                            <Th textAlign={"start"} color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>Nome</Th>
                                            <Th textAlign={"start"} color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>Telefone</Th>
                                            <Th color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>Email</Th>
                                            <Th color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>Grupo</Th>
                                            {/* <Th color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>Status</Th> */}
                                        </Tr>
                                    </Thead>
                                    <Tbody>


                                        {selectedOption ? (
                                            <>
                                                {selectResults ? (
                                                    selectResults.map((item: any) => (
                                                        <Tr key={item.id}>
                                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>

                                                                <ButtonPacientes
                                                                    //@ts-ignore
                                                                    href={`/paciente/${data.pacienteId}/dadospaciente`} />
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                <Link href={`/paciente/${item.id}/dadospaciente`}>{item.name}</Link>
                                                            </Td>
                                                            <Td
                                                                textAlign={"start"}
                                                                isNumeric
                                                                color={"#474749"}
                                                                fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}
                                                            >
                                                                {item.telefone}
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                {item.email}
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                {item.grupo}
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
                                                                    <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                        <ButtonPacientes href={`/paciente/${item.id}/dadospaciente`} onClick={() => handleDeleteClick(item.id)} />
                                                                    </Td><Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                        <Link href={`/paciente/${item.id}/dadospaciente`}>{item.name}</Link>
                                                                    </Td><Td
                                                                        textAlign={"start"}
                                                                        isNumeric
                                                                        color={"#474749"}
                                                                        fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}
                                                                    >
                                                                        {item.telefone}
                                                                    </Td><Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                        {item.email}
                                                                    </Td><Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                        {item.grupo}
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
                                                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                                <ButtonPacientes href={`/paciente/${item.id}/dadospaciente`} onClick={() => handleDeleteClick(item.id)} />
                                                                            </Td>
                                                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                                <Link href={`/paciente/${item.id}/dadospaciente`}>{item.name}</Link>
                                                                            </Td>
                                                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                                {item.telefone}
                                                                            </Td>
                                                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                                {item.email}
                                                                            </Td>
                                                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                                                {item.grupo}
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
                                                                        Clique em Novo Paciente para criar um
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
            </Main></>

    )
}