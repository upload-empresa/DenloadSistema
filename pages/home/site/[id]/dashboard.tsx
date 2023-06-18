import { HStack, Stack } from "@chakra-ui/react"

import { CardDashboardFinanceiro, CardDashboardHorarios, CardMain } from "@/components/Cards"
import { Main } from "@/components/Main"
import { TitleDashboard, TitleDashboardGrafic } from "@/components/Title"

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
import { subDays, subHours, subMonths } from "date-fns";
import { Line, Pie } from "react-chartjs-2"

interface SiteDashboardData {
    ganhos: Array<Ganho>;
    subscriptions: Array<Subscription>
    despesas: Array<Despesa>;
    agendas: Array<Agenda>;
    pacientes: Array<Paciente>;
    site: Site | null;
    paciente: Paciente | null;
    children: ReactNode
    data: any
}






export default function Home({ agendas, data, pacientes, children, }: SiteDashboardData) {
    const [selectedPeriod, setSelectedPeriod] = useState("3 meses");

    const router = useRouter();
    const { id: pacienteId } = router.query;
    const { id: siteId } = router.query;
    const { id: agendaId } = router.query;

    const { data: agendasData } = useSWR<SiteDashboardData>(
        pacienteId && `/api/agenda?siteId=${siteId}`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.paciente && router.push("/"),
        // }
    );

    const { data: pacientesData } = useSWR<SiteDashboardData>(
        siteId && `/api/paciente?siteId=${siteId}`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.paciente && router.push("/"),
        // }
    );

    const { data: ganhosData } = useSWR<SiteDashboardData>(
        siteId && `/api/ganho?siteId=${siteId}`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.site && router.push("/"),
        // }
    );

    const { data: despesasData } = useSWR<SiteDashboardData>(
        siteId && `/api/despesa?siteId=${siteId}`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.site && router.push("/"),
        // }
    );


    const [chartData, setChartData] = useState(null);



    return (
        <Main title={"Dashboard"} w={""} path={""} altText={""} tamh={0} tamw={0}>
            <HStack
                align={"stretch"}
                spacing={12}
            >
                <CardMain radius={"18px"} w={"65%"}>
                    <TitleDashboardGrafic title={"Total de Novos Pacientes"} />

                    <Select
                        w="40%"
                        fontSize="14px"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        <option value="3 meses">3 meses</option>
                        <option value="6 meses">6 meses</option>
                        <option value="12 meses">12 meses</option>
                    </Select>


                    {pacientesData && agendasData &&
                        (() => {

                            const currentDate = new Date();
                            let startDate = currentDate;

                            if (selectedPeriod === "3 meses") {
                                startDate = subMonths(currentDate, 3);
                            } else if (selectedPeriod === "6 meses") {
                                startDate = subMonths(currentDate, 6);
                            } else if (selectedPeriod === "12 meses") {
                                startDate = subMonths(currentDate, 12);
                            }

                            const filteredPacientes = pacientesData.pacientes.filter((paciente) => {
                                const pacienteDate = new Date(paciente.createdAt);
                                return pacienteDate >= startDate && pacienteDate <= currentDate;
                            });

                            const totalPacientes = filteredPacientes.length;

                            const data = {
                                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abrill', 'Maio', 'Junho', 'Julho', 'Agost', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                                datasets: [
                                    {
                                        fill: false,
                                        lineTension: 0.1,
                                        backgroundColor: 'rgba(75,192,192,0.4)',
                                        borderColor: 'rgba(75,192,192,1)',
                                        borderCapStyle: 'butt',
                                        borderDash: [],
                                        borderDashOffset: 0.0,
                                        borderJoinStyle: 'miter',
                                        pointBorderColor: 'rgba(75,192,192,1)',
                                        pointBackgroundColor: '#fff',
                                        pointBorderWidth: 1,
                                        pointHoverRadius: 5,
                                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                                        pointHoverBorderWidth: 2,
                                        pointRadius: 1,
                                        pointHitRadius: 10,
                                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                                        shadowBlur: 5,
                                        data: Array(12).fill(0),
                                    }
                                ]
                            };
                            filteredPacientes.forEach((paciente) => {
                                const pacienteDate = new Date(paciente.createdAt);
                                const monthIndex = pacienteDate.getMonth();
                                data.datasets[0].data[monthIndex] += 1;
                            });

                            // setChartData(data);
                            // const chartData = {
                            //     datasets: [...data.datasets],
                            // };
                            return (
                                <div>
                                    {/* {chartData && ( */}
                                    <Line
                                        data={data}
                                        width={400}
                                        height={200}
                                        options={{
                                            responsive: true,
                                            legend: {
                                                display: false
                                            },
                                            scales: {
                                                yAxes: [{
                                                    scaleLabel: {
                                                        display: true,
                                                        labelString: 'Novos Pacientes',
                                                        position: 'top'
                                                    }
                                                }]
                                            }
                                        }} />
                                    {/* )} */}
                                </div>
                            );
                        })()}
                </CardMain>
                <Stack
                    w="35%"
                >
                    <TitleDashboard title={"Próximos Pacientes"} />


                    {agendasData && pacientesData && (
                        (() => {
                            const currentDate = new Date();
                            let startDate = subDays(currentDate, 1);
                            const filteredAgendas = agendasData.agendas.filter((agenda) => {
                                //@ts-ignore
                                const agendaDate = new Date(agenda.horario);
                                return agendaDate >= startDate && agendaDate <= currentDate;
                            });
                            const filteredPacientes = pacientesData.pacientes.filter((paciente) => {
                                const pacienteId = paciente.id;
                                return pacienteId;
                            });

                            const cards = filteredAgendas.map((agenda) => {
                                const { horario, procedimento, pacienteId } = agenda;
                                const paciente = filteredPacientes.find((paciente) => paciente.id === pacienteId);
                                const nome = paciente ? paciente.name : '';

                                return (
                                    <CardDashboardHorarios nome={nome} procedimento={procedimento} horario={horario} />
                                );
                            });

                            return cards;
                        })()
                    )}





                </Stack>
            </HStack><HStack
                align="start"
                spacing={4}
            >
                <CardMain radius="18px" w="40%">
                    <Select
                        w="40%"
                        fontSize="14px"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        <option value="3 meses">3 meses</option>
                        <option value="6 meses">6 meses</option>
                        <option value="12 meses">12 meses</option>
                    </Select>


                    {pacientesData && agendasData && (() => {

                        // Contagem dos procedimentos
                        const procedimentosCount = {};

                        const currentDate = new Date();
                        let startDate = currentDate;

                        if (selectedPeriod === "3 meses") {
                            startDate = subMonths(currentDate, 3);
                        } else if (selectedPeriod === "6 meses") {
                            startDate = subMonths(currentDate, 6);
                        } else if (selectedPeriod === "12 meses") {
                            startDate = subMonths(currentDate, 12);
                        }

                        const filteredAgendas = agendasData.agendas.filter((agenda) => {
                            //@ts-ignore
                            const agendaDate = new Date(agenda.horario);
                            return agendaDate >= startDate && agendaDate <= currentDate;
                        });




                        filteredAgendas.forEach((agenda) => {
                            const procedimento = agenda.procedimento;
                            //@ts-ignore
                            procedimentosCount[procedimento] = (procedimentosCount[procedimento] || 0) + 1;
                        });

                        // Ordenar os procedimentos por quantidade em ordem decrescente
                        const procedimentosOrdenados = Object.keys(procedimentosCount).sort((a, b) => {
                            //@ts-ignore
                            return procedimentosCount[b] - procedimentosCount[a];
                        });

                        // Limitar o número de procedimentos mostrados no gráfico
                        const procedimentosLimitados = procedimentosOrdenados.slice(0, 3); // Mostrar os 3 procedimentos mais realizados


                        // Criar os dados para o gráfico de pizza
                        const data = {
                            labels: procedimentosLimitados,
                            datasets: [{
                                //@ts-ignore
                                data: procedimentosLimitados.map((procedimento) => procedimentosCount[procedimento]),
                                backgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56'
                                ],
                                hoverBackgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56'
                                ]
                            }]
                        };

                        return (
                            <div>
                                <Pie
                                    data={data}
                                    width={400}
                                    height={400}
                                    options={{
                                        legend: {
                                            position: 'right',
                                            labels: {
                                                usePointStyle: true,
                                                boxWidth: 10,
                                                pointStyle: 'circle'
                                            }
                                        }
                                    }} />
                            </div>
                        );
                    })()}


                </CardMain>
                {/* <Table>
        <Thead>
            <Tr>

                <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Ações</Th>
                <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Nome do Paciente</Th>
                <Th textAlign={"start"} isNumeric color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Horário</Th>
                <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Procedimento</Th>
                <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Dia</Th>
                <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Status</Th>
            </Tr>
        </Thead>
        <Tbody>

            {agendasData && pacientesData ? (
                agendasData.agendas.length > 0 ? (
                    agendasData.agendas.map((agenda) => {
                        const paciente = pacientesData.pacientes.find(
                            (paciente) => paciente.id === agenda.pacienteId
                        )


                        return (

                            <Tr key={agenda.id}>


                                <>

                                    <Td color={"#474749"} fontSize={"14px"}>
                                        <Link href={`/paciente/${paciente?.id}/dadospaciente`}>{paciente?.name}</Link>
                                    </Td>
                                    <Td textAlign={"start"} isNumeric color={"#474749"} fontSize={"14px"}>{agenda.horario}</Td>
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
                <p>Carregando..</p>
            )}

        </Tbody>
        <Tfoot>
            <Tr>
            </Tr>
        </Tfoot>
    </Table> */}
                <CardMain radius="18px" w="60%">
                    <TitleDashboardGrafic title={"Financeiro"} value={selectedPeriod} onChange={(e: any) => setSelectedPeriod(e.target.value)} />
                    <HStack
                        justify={"space-between"}
                        spacing={6}
                    >


                        {ganhosData && despesasData && pacientesData &&
                            (() => {
                                let totalGanhos = '';
                                let totalDespesas = '';
                                let totalRecebimentos = '';
                                let totalNames = '';
                                let totalNamesDes = '';
                                let totalDatadaCompra = '';

                                const currentDate = new Date();
                                let startDate = currentDate;

                                if (selectedPeriod === "3 meses") {
                                    startDate = subMonths(currentDate, 3);
                                } else if (selectedPeriod === "6 meses") {
                                    startDate = subMonths(currentDate, 6);
                                } else if (selectedPeriod === "12 meses") {
                                    startDate = subMonths(currentDate, 12);
                                }

                                const filteredGanhos = ganhosData.ganhos.filter((ganho) => {
                                    const ganhoDate = new Date(ganho.createdAt);
                                    return ganhoDate >= startDate && ganhoDate <= currentDate;
                                });

                                const filteredDespesas = despesasData.despesas.filter((despesa) => {
                                    const despesaDate = new Date(despesa.createdAt);
                                    return despesaDate >= startDate && despesaDate <= currentDate;
                                });

                                filteredGanhos.forEach((ganho) => {
                                    totalGanhos += ganho.valor;
                                    totalRecebimentos += ganho.recebimento + ', ';
                                    totalNames += ganho.name + ', ';
                                });

                                filteredDespesas.forEach((despesa) => {
                                    totalDespesas += despesa.valor;
                                    totalNamesDes += despesa.name + ', ';
                                    totalDatadaCompra += despesa.dataDaCompra + ', ';
                                });

                                // totalRecebimentos = totalRecebimentos.slice(0, -2); // Remover a vírgula extra no final
                                // totalNames = totalNames.slice(0, -2);
                                // totalNamesDes = totalNamesDes.slice(0, -2);
                                // totalDatadaCompra = totalDatadaCompra.slice(0, -2);
                                return (

                                    <><CardDashboardFinanceiro w={"50%"} nome={totalNames} procedimento={totalRecebimentos} horario={totalGanhos} title={"Receitas"} color={"#2FACFA"} />
                                        <CardDashboardFinanceiro w={"50%"} nome={totalNamesDes} procedimento={totalDatadaCompra} horario={totalDespesas} title={"Despesas"} color={"#F64E60"} />
                                    </>
                                );
                            })()}





                    </HStack>
                </CardMain>
            </HStack>

        </Main >
    )
}
