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
// import type { WithSiteAgenda } from "@/types";
import type { Agenda, Despesa, Site } from "@prisma/client";
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

interface SiteAgendaData {
    agendas: Array<Agenda>;
    despesas: Array<Despesa>;
    site: Site | null;
}


const Financeiro = () => {
    const [creatingAgenda, setCreatingAgenda] = useState(false);

    const router = useRouter();
    const { id: pacienteId } = router.query;

    const { data: agendasData } = useSWR<SiteAgendaData>(
        pacienteId && `/api/agenda?pacienteId=3`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.paciente && router.push("/"),
        // }
    );

    const { data: despesasData } = useSWR<SiteAgendaData>(
        pacienteId && `/api/despesa?pacienteId=3`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.paciente && router.push("/"),
        // }
    );



    return (
        <>
            <Main title={"Financeiro"} w={""} path={""} altText={""} tamh={0} tamw={0}>
                <HStack
                    spacing={0}
                    align={"stretch"}
                >
                    <CardFinanceiroPlus />

                    <CardFinanceiroPlus />
                    <CardMain radius={"0 18px 18px 0"} spacing={0} w="90%" >
                        <Stack
                            spacing={5}
                        >
                            <TitleCards title={"Financeiro"} />
                            <HStack
                                spacing={8}
                                w="100%"
                            >
                                <Stack
                                    w="50%"
                                >
                                    <TitleDashboardGrafic title={"Despesas e Ganhos"} />

                                    {agendasData && despesasData &&
                                        agendasData.agendas.map((agenda) => {
                                            const despesa = despesasData.despesas.find(
                                                (despesa) => despesa.id === despesa.id
                                            );
                                            const iba = {
                                                labels: [
                                                    'Red',
                                                    'Green',
                                                ],
                                                datasets: [{
                                                    data: [agenda.procedimento, 20],
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

                                                    {/* <h2>{agenda.valor}</h2> */}
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
                                        })}

                                </Stack>
                            </HStack>
                            <Stack>
                                <TitleDashboardGrafic title={"Total de Novos Pacientes"} />

                            </Stack>
                        </Stack>

                    </CardMain>
                </HStack>
            </Main>
        </>

    );
};

export default Financeiro
