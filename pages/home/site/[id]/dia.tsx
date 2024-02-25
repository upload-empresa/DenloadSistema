import { HStack, Stack } from "@chakra-ui/react"

import { Main } from "@/components/Main"
import { CardDia, CardMain } from "@/components/Cards"
import { TableMain } from "@/components/Table"
import { Pagination } from "@/components/Pagination"

import { ButtonAdd, ButtonPacientes } from "@/components/Buttons"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithPacienteAgenda } from "@/types";
import type { Paciente, Agenda, Site, Ganho, Despesa, Subscription } from "@prisma/client";
import Modal from "@/components/Modal";
import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import { TitleCards, TitleCardsPacientes } from "@/components/Title"
import { Heading, Input, Button, InputGroup, InputLeftElement, Select } from "@chakra-ui/react"
import { ReactNode } from "react"
import { MdSearch } from "react-icons/md"
import { MdArrowForward } from "react-icons/md"
import { format, subMonths, subDays } from "date-fns";
import { Line, Pie } from "react-chartjs-2"
import useCurrentUser from "hooks/useCurrentUser"
import { useToast } from '@chakra-ui/react'
import { UnlockIcon } from "@chakra-ui/icons"

interface SiteAgendaData {
    ganhos: Array<Ganho>;
    despesas: Array<Despesa>;
    agendas: Array<Agenda>;
    pacientes: Array<Paciente>;
    site: Site | null;
    paciente: Paciente | null;
    children: ReactNode
    subscriptions: Array<Subscription>
}

interface DiaProps {
    data: any
}
//@ts-ignore
export default function Dia({ data }: DiaProps, { agendas, agenda, pacientes, children, }: SiteAgendaData) {


    const [currentPage, setCurrentPage] = useState<number>(0);
    const { data: currentUser } = useCurrentUser();
    const toast = useToast()


    const handlePageClick = (data: any) => {
        setCurrentPage(data.selected);
    }

    const PER_PAGE = 10;
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(data?.pacientes?.length / PER_PAGE);

    const items = data?.pacientes?.slice(offset, offset + PER_PAGE);


    const router = useRouter();
    const { id: pacienteId } = router.query;
    const { id: siteId } = router.query;
    const { id: agendaId } = router.query;

    console.log(currentUser?.isAdmin);
    if (currentUser?.isAdmin === false) {
        // {
        //     toast({
        //             title: `Acesso bloqueado`,
        //             status: 'error',
        //             icon: <UnlockIcon/>,
        //             isClosable: true,
    
        //         })

        // }
        router.push('/')

    }


    const { data: agendasData } = useSWR<SiteAgendaData>(
        pacienteId && `/api/agenda?siteId=${siteId}`,
        fetcher,

    );

    const { data: pacientesData } = useSWR<SiteAgendaData>(
        siteId && `/api/paciente?siteId=${siteId}`,
        fetcher,

    );

    const { data: ganhosData } = useSWR<SiteAgendaData>(
        siteId && `/api/ganho?siteId=${siteId}`,
        fetcher,

    );

    const { data: despesasData } = useSWR<SiteAgendaData>(
        siteId && `/api/despesa?siteId=${siteId}`,
        fetcher,

    );

    const { data: settings, } = useSWR<WithPacienteAgenda>(
        `/api/agenda?agendaId=${agendaId}`,
        fetcher,

    );

    const { data: stripe } = useSWR<SiteAgendaData>(
        `/api/subscription?siteId=${siteId}`,
        fetcher,

    );

    const stripes = stripe?.subscriptions

    async function createAgenda(pacienteId: string) {
        try {
            const res = await fetch(`/api/agenda?pacienteId=${pacienteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/agenda/${data.agendaId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }


    async function deleteAgenda(agendaId: string) {
        try {
            const response = await fetch(`/api/agenda?agendaId=${agenda.id}`, {
                method: HttpMethod.DELETE,
            });

            if (response.ok) {
                router.push(`/paciente/${settings?.paciente?.id}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const [selectedOption, setSelectedOption] = useState('')
    const [selectResults, setSelectResults] = useState<Array<Agenda>>([]);

    useEffect(() => {
        // função que irá realizar a chamada da API
        const selectApi = async () => {
            const response = await fetch(`/api/agenda?orderBy=${selectedOption}`);
            const data = await response.json();
            setSelectResults(data);
        }

        // chamando a função da API apenas se houver algum termo de pesquisa
        if (selectedOption) {
            selectApi();
        } else {
            setSelectResults(agendas);
        }
    }, [selectedOption]);

    function handleOptionChange(event: any) {
        setSelectedOption(event.target.value)
    }


    //teste pesquisa

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(items)

    useEffect(() => {
        // função que irá realizar a chamada da API
        const searchApi = async () => {
            const response = await fetch(`/api/paciente?search=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        }

        // chamando a função da API apenas se houver algum termo de pesquisa
        if (searchTerm) {
            searchApi();
        } else {
            setSearchResults(pacientes);
        }
    }, [searchTerm]);



    return (
        <Main title={"Dia"} w={"45%"} path={"/dia.png"} altText={"Ícone do Denload"} tamh={51} tamw={56}>

            <Stack
                spacing={4}
            >
                <HStack
                    justify={"start"}
                    align={{ md: "none", xxs: "start" }}
                    spacing={{ lg: 6, xxs: 0 }}
                    display={{ lg: "flex", xxs: "none" }}
                    flexDir={{ lg: "row", xxs: "column" }}
                >
                    {ganhosData &&
                        (() => {
                            let totalGanhos = 0;

                            const currentDate = new Date();
                            let startDate = currentDate;
                            startDate = subDays(currentDate, 1);
                            const filteredGanhos = ganhosData.ganhos.filter((ganho) => {
                                const ganhoDate = new Date(ganho.createdAt);
                                return ganhoDate >= startDate && ganhoDate <= currentDate;
                            });
                            filteredGanhos.forEach((ganho) => {
                                //@ts-ignore
                                totalGanhos += +ganho.valor;
                            });



                            return (
                                <CardDia w={"20%"} widthCard={{ md: "none", xxs: "80%" }} path={"/ganho.png"} altText={"Ícone do Denload"} tamh={48} tamw={52} title={"Ganho do dia"} text={totalGanhos} />
                            )
                        })()
                    }

                    {despesasData &&
                        (() => {
                            let totalDespesas = 0;

                            const currentDate = new Date();
                            let startDate = currentDate;
                            startDate = subDays(currentDate, 1);
                            const filteredDespesas = despesasData.despesas.filter((despesa) => {
                                const despesaDate = new Date(despesa.createdAt);
                                return despesaDate >= startDate && despesaDate <= currentDate;
                            });
                            filteredDespesas.forEach((despesa) => {
                                //@ts-ignore
                                totalDespesas += +despesa.valor;
                            });



                            return (
                                <CardDia w={"20%"} widthCard={{ md: "none", xxs: "80%" }} path={"/despesa.png"} altText={"Ícone do Denload"} tamh={48} tamw={52} title={"Despesa do dia"} text={totalDespesas} mt={{ md: 0, xxs: 20 }} />
                            )
                        })()
                    }

                    {despesasData && ganhosData &&
                        (() => {
                            let totalDespesas = 0;
                            let totalGanhos = 0;
                            let lucro = 0;

                            const currentDate = new Date();
                            let startDate = currentDate;
                            startDate = subDays(currentDate, 1);

                            const filteredDespesas = despesasData.despesas.filter((despesa) => {
                                const despesaDate = new Date(despesa.createdAt);
                                return despesaDate >= startDate && despesaDate <= currentDate;
                            });

                            const filteredGanhos = ganhosData.ganhos.filter((ganho) => {
                                const ganhoDate = new Date(ganho.createdAt);
                                return ganhoDate >= startDate && ganhoDate <= currentDate;
                            });

                            filteredDespesas.forEach((despesa) => {
                                //@ts-ignore
                                totalDespesas += +despesa.valor;
                            });

                            filteredGanhos.forEach((ganho) => {
                                //@ts-ignore
                                totalGanhos += +ganho.valor;
                            });

                            lucro = totalDespesas - totalGanhos;

                            const lucroFunction = () => {
                                if (lucro < 0) {
                                    return - lucro; // Retorna zero se o lucro for negativo
                                }
                                return lucro;
                            };



                            return (
                                <CardDia w={"20%"} widthCard={{ md: "none", xxs: "80%" }} path={"/lucro.png"} altText={"Ícone do Denload"} tamh={48} tamw={52} title={"Lucro do dia"} text={lucroFunction()} mt={{ md: 0, xxs: 20 }} />


                            )
                        })()
                    }




                </HStack>
                <CardMain radius={"18px"}>
                    <TableContainer>
                        <Stack spacing={6}>
                            <HStack
                                justify={"space-between"}
                            >
                                {children}
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
                                        <Th textAlign={"start"} isNumeric color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Horário</Th>
                                        <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Procedimento</Th>
                                        <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Dia</Th>
                                        {/* <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Status</Th> */}
                                    </Tr>
                                </Thead>
                                <Tbody>

                                    <>
                                        {searchTerm ? (
                                            <>
                                                {searchResults?.map((item: any) => (
                                                    <>
                                                        < Tr key={item.id} >
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                <ButtonPacientes href={`/paciente/${item.id}/dadospaciente`} />
                                                            </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                <Link href={`/paciente/${item.id}`}>{item.name}</Link>
                                                            </Td><Td
                                                                textAlign={"start"}
                                                                isNumeric
                                                                color={"#474749"}
                                                                fontSize={"14px"}
                                                            >
                                                                {item.telefone}
                                                            </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                {item.email}
                                                            </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                {item.grupo}
                                                            </Td>
                                                        </Tr>
                                                    </>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                {items?.map((item: any) => (
                                                    <>
                                                        <Tr key={item.id}>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                <ButtonPacientes href={`/paciente/${item.id}//dadospaciente`} />
                                                            </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                <Link href={`/paciente/${item.id}`}>{item.name}</Link>
                                                            </Td><Td
                                                                textAlign={"start"}
                                                                isNumeric
                                                                color={"#474749"}
                                                                fontSize={"14px"}
                                                            >
                                                                {item.telefone}
                                                            </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                {item.email}
                                                            </Td><Td color={"#474749"} fontSize={"14px"}>
                                                                {item.grupo}
                                                            </Td>



                                                        </Tr>
                                                    </>
                                                ))}

                                                {agendasData && pacientesData ? (
                                                    agendasData.agendas.length > 0 ? (
                                                        agendasData.agendas.map((agenda) => {
                                                            const paciente = pacientesData.pacientes.find(
                                                                (paciente) => paciente.id === paciente.id
                                                            )

                                                            return (
                                                                <Tr key={agenda.id}>
                                                                    <Td color={"#474749"} fontSize={"14px"}>
                                                                        <ButtonPacientes onClick={undefined} href={`/paciente/${paciente?.id}/dadospaciente`} />
                                                                    </Td>

                                                                    <>

                                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                                            <Link href={`/paciente/${paciente?.id}/dadospaciente`}>{paciente?.name}</Link>
                                                                        </Td>
                                                                        <Td color={"#474749"} fontSize={"14px"}>{agenda.dia}</Td>
                                                                        <Td color={"#474749"} fontSize={"14px"}>{agenda.dia}</Td>
                                                                        <Td color={"#474749"} fontSize={"14px"}>{agenda.dia}</Td>
                                                                    </>
                                                                </Tr>
                                                            )
                                                        })
                                                    ) : (
                                                        <>
                                                            <p className="text-2xl font-cal text-gray-600">
                                                                Sem dados ainda.
                                                            </p>
                                                        </>
                                                    )
                                                ) : (
                                                    <p>Sem dados ainda</p>
                                                )}
                                            </>
                                        )}
                                    </>
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        </Stack>
                    </TableContainer>
                </CardMain>
            </Stack>

        </Main>
    )
}