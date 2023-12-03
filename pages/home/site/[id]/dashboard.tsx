import { HStack, Stack } from "@chakra-ui/react"

import { CardDashboardFinanceiro, CardMain } from "@/components/Cards"
import { Main } from "@/components/Main"
import { TitleDashboardGrafic } from "@/components/Title"

import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { Paciente, Agenda, Site, Ganho, Despesa, Subscription } from "@prisma/client";
import { Select } from "@chakra-ui/react"
import { ReactNode } from "react"
import { subMonths } from "date-fns";
import { Line, Pie } from "react-chartjs-2"
import { ExampleChart } from "@/components/Calendar";

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
    );

    const { data: pacientesData } = useSWR<SiteDashboardData>(
        siteId && `/api/paciente?siteId=${siteId}`,
        fetcher,
    );

    const { data: ganhosData } = useSWR<SiteDashboardData>(
        siteId && `/api/ganho?siteId=${siteId}`,
        fetcher,
    );

    const { data: despesasData } = useSWR<SiteDashboardData>(
        siteId && `/api/despesa?siteId=${siteId}`,
        fetcher,
    );

    const [chartData, setChartData] = useState(null);

    return (
        <Main title={"Dashboard"} w={""} path={""} altText={""} tamh={0} tamw={0}>
            <Stack
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
                    {pacientesData &&
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
                                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agost', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
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

                            return (
                                <div>
                                    {/* @ts-ignore */}
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
                                </div>
                            );
                        })()}
                </CardMain>
            </Stack>
            <Stack
                align="start"
                spacing={4}
            >
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

                                return (

                                    <>
                                        {/* <CardDashboardFinanceiro w={"50%"} nome={totalNames} procedimento={totalRecebimentos} horario={totalGanhos} title={"Receitas"} color={"#2FACFA"} /> */}
                                        <CardDashboardFinanceiro w={"50%"} nome={totalNames} title={"Receitas"} color={"#2FACFA"} />
                                        {/* <CardDashboardFinanceiro w={"50%"} nome={totalNamesDes} procedimento={totalDatadaCompra} horario={totalDespesas} title={"Despesas"} color={"#F64E60"} /> */}
                                        <CardDashboardFinanceiro w={"50%"} nome={totalNamesDes} title={"Despesas"} color={"#F64E60"} />
                                    </>
                                );
                            })()}

                    </HStack>
                </CardMain>
            </Stack>
            {/* <ExampleChart /> */}
        </Main >
    )
}
