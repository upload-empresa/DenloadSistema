import { HStack, useToast } from "@chakra-ui/react"

import { CardMain } from "../../../../components/Cards"
import { Main } from "../../../../components/Main"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { Ganho, Despesa, Site, Subscription, Paciente } from "@prisma/client";
import { Select } from "@chakra-ui/react"

import { Stack } from "@chakra-ui/react"

import { CardFinanceiroPlus } from "@/components/Cards/plus"
import { TitleCards, TitleDashboardGrafic } from "@/components/Title"

import React from "react";
import { subMonths } from "date-fns";
import { Line, Pie } from "react-chartjs-2"
import useCurrentUser from "hooks/useCurrentUser";


interface SiteGanhoData {
    ganhos: Array<Ganho>;
    pacientes: Array<Paciente>;
    despesas: Array<Despesa>;
    subscriptions: Array<Subscription>
    site: Site | null;
}


const Financeiro = () => {
    const [creatingGanho, setCreatingGanho] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("3 meses");

    const router = useRouter();
    const { id: siteId } = router.query;
    const { data: currentSite } = useCurrentUser(siteId);
    const toast = useToast()

    console.log(siteId);
    const { data: ganhosData } = useSWR<SiteGanhoData>(
        siteId && `/api/ganho?siteId=${siteId}`,
        fetcher,

    );

    const { data: despesasData } = useSWR<SiteGanhoData>(
        siteId && `/api/despesa?siteId=${siteId}`,
        fetcher,

    );

    const { data: pacientesData } = useSWR<SiteGanhoData>(
        siteId && `/api/paciente?siteId=${siteId}`,
        fetcher,

    );


    return (
        <>
            <Main title={"Financeiro"} w={""} path={""} altText={""} tamh={0} tamw={0}>
                <HStack
                    spacing={0}
                    align={"stretch"}
                >

                    <CardFinanceiroPlus />
                    <CardMain radius={"0 18px 18px 0"} spacing={0} w={{ md: "90%", xxs: "70%" }} >
                        <Stack
                            spacing={5}
                        >
                            <TitleCards title={"Financeiro"} />
                            <HStack
                                spacing={{ lg: 8, xxs: 0 }}
                                w={"100%"}
                                flexDir={{ lg: "row", xxs: "column" }}
                            >
                                <Stack
                                    w={{ lg: "50%", xxs: "100%" }}
                                >
                                    <TitleDashboardGrafic title={"Despesas e Ganhos"} flexDir={{ lg: "row", xxs: "column" }} value={selectedPeriod} onChange={(e: any) => setSelectedPeriod(e.target.value)} />


                                    {ganhosData && despesasData &&
                                        (() => {
                                            let totalGanhos = 0;
                                            let totalDespesas = 0;

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
                                                //@ts-ignore
                                                totalGanhos += +ganho.valor;
                                            });

                                            filteredDespesas.forEach((despesa) => {
                                                //@ts-ignore
                                                totalDespesas += +despesa.valor;
                                            });

                                            const iba = {
                                                labels: [
                                                    'Ganhos',
                                                    'Despesas',
                                                ],
                                                datasets: [{
                                                    data: [totalGanhos, totalDespesas],
                                                    backgroundColor: [
                                                        '#FF6384',
                                                        '#36A2EB',
                                                    ],
                                                    hoverBackgroundColor: [
                                                        '#FF6384',
                                                        '#36A2EB',
                                                    ]
                                                }]
                                            };

                                            return (
                                                <div>

                                                    <Pie
                                                        data={iba}
                                                        width={100}
                                                        height={100}
                                                        options={{
                                                            legend: {
                                                                position: 'left',
                                                                labels: {
                                                                    usePointStyle: true,
                                                                    boxWidth: 10,
                                                                    //@ts-ignore
                                                                    pointStyle: 'circle'
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })()
                                    }

                                </Stack>
                            </HStack>

                            <Stack>
                                <TitleDashboardGrafic title={"Total de Novos Pacientes"} flexDir={{ lg: "row", xxs: "column" }} value={selectedPeriod} onChange={(e: any) => setSelectedPeriod(e.target.value)} />
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



                            </Stack>
                        </Stack>
                    </CardMain >
                </HStack >
            </Main >
        </>
    );
};


export default Financeiro
