import { HStack } from "@chakra-ui/react"
import { IoPersonOutline } from "react-icons/io5"
import { MdOutlineInsertDriveFile, MdOutlineImageSearch } from "react-icons/md"

import { CardMainPlus, CardIconPacientes, CardMain } from "../../../../components/Cards"
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
import type { Ganho, Despesa, Site } from "@prisma/client";
import Modal from "@/components/Modal";
import { Select } from "@chakra-ui/react"
import { ButtonAdd } from "@/components/Buttons"

import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"

import { Line, Pie } from "react-chartjs-2"

import { CardFinanceiroPlus } from "@/components/Cards/plus"
import { TitleCards, TitleDashboard, TitleDashboardGrafic } from "@/components/Title"

import { useTranslation } from "next-i18next";
import React from "react";
import { Bar } from "react-chartjs-2";
import { format, subMonths } from "date-fns";


interface SiteGanhoData {
    ganhos: Array<Ganho>;
    despesas: Array<Despesa>;
    site: Site | null;
}


const Financeiro = () => {
    const [creatingGanho, setCreatingGanho] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("3 meses");

    const router = useRouter();
    const { id: siteId } = router.query;

    const { data: ganhosData } = useSWR<SiteGanhoData>(
        siteId && `/api/ganho?siteId=${siteId}`,
        fetcher,
        {
            onSuccess: (data) => !data?.site && router.push("/"),
        }
    );

    const { data: despesasData } = useSWR<SiteGanhoData>(
        siteId && `/api/despesa?siteId=${siteId}`,
        fetcher,
        {
            onSuccess: (data) => !data?.site && router.push("/"),
        }
    );



    return (
        <>
            <Main title={"Financeiro"} w={""} path={""} altText={""} tamh={0} tamw={0}>
                <HStack
                    spacing={0}
                    align={"stretch"}
                >

                    <CardFinanceiroPlus />
                    <CardMain radius={"0 18px 18px 0"} spacing={0} w="90%" >
                        <Stack
                            spacing={5}
                        >
                            <TitleCards title={"Financeiro"} text={"Relatórios e Dashboards Financeiros"} />
                            <HStack
                                spacing={8}
                                w="100%"
                            >
                                <Stack
                                    w="50%"
                                >
                                    {/* <TitleDashboardGrafic title={"Despesas e Ganhos"} /> */}
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


                                    {ganhosData && despesasData &&
                                        (() => {
                                            let totalGanhos = 0;
                                            let totalDespesas = 0;

                                            const currentDate = new Date();
                                            let startDate = currentDate;

                                            // ganhosData.ganhos.forEach((ganho) => {
                                            //     totalGanhos += +ganho.valor;
                                            // });

                                            // despesasData.despesas.forEach((despesa) => {
                                            //     totalDespesas += +despesa.valor;
                                            // });

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
                                                totalGanhos += +ganho.valor;
                                            });

                                            filteredDespesas.forEach((despesa) => {
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
                                <TitleDashboardGrafic title={"Total de Novos Pacientes"} />

                            </Stack>
                        </Stack>

                    </CardMain >
                </HStack >
            </Main >
        </>

    );
};

export default Financeiro
