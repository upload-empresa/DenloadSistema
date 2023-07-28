import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import { ButtonPacientes } from "../Buttons"
import { CardPacientes } from "../Cards"

import { TitleCards, TitleCardsPacientes } from "../Title"

import { useRouter } from "next/router";
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import BlurImage from "@/components/BlurImage";
import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Paciente, Site } from "@prisma/client";
import { Pagination } from "../Pagination";

interface SitePacienteData {
    pacientes: Array<Paciente>;
    site: Site | null;
}

interface TableMainProps {
    title: string
    thead1: string
    thead2: string
    thead3: string
    data: any
    pacientes: any
    paciente: any
    onClick: any
    selectedOption: any
    selectResults: any
    variavel: any
    onOpen?: any
}

export function TableMain({ title, thead1, thead2, thead3, data, onClick, selectedOption, selectResults, variavel, onOpen }: TableMainProps) {
    const [currentPage, setCurrentPage] = useState<number>(0);

    const handlePageClick = (data: any) => {
        setCurrentPage(data.selected);
    }


    const PER_PAGE = 1;
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(data?.pacientes?.length / PER_PAGE);

    const items = data?.pacientes?.slice(offset, offset + PER_PAGE);

    const router = useRouter();




    return (

        <>

            <TableContainer>
                <Stack spacing={6}>

                    <TitleCardsPacientes
                        flexDir={{ lg: "row", xxs: "column" }}
                        //@ts-ignore
                        pacientes={[]}>
                        <TitleCards title={title} mb={{ xxs: "5%" }} />
                    </TitleCardsPacientes>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>Ações</Th>
                                <Th color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>Nome</Th>
                                <Th textAlign={"start"} color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>{thead1}</Th>
                                <Th color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>{thead2}</Th>
                                <Th color={"#B5B7C0"} fontSize={{ '2xl': "18px", xl: "16px", lg: "14px", xxs: "14px" }} fontWeight={500}>{thead3}</Th>
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
                                                    <ButtonPacientes href={`/paciente/${data.pacienteId}/dadospaciente`} />
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
                                                    {item.dia}
                                                </Td>
                                                <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                    {item.email}
                                                </Td>
                                                <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                    {item.grupo}
                                                </Td>

                                                {/* <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                    <CardPacientes
                                                        text={item?.pago ? "Pago" : "Não Pago"}
                                                        bgOne={item?.pago ? "#0BB7AF26" : "#F64E6026"}
                                                        color={item?.pago ? "#0BB7AF" : "#F64E60"}
                                                    />
                                                </Td> */}
                                            </Tr>
                                        ))


                                    ) : (
                                        <p>Carregando...</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    {items?.map((item: any) => (
                                        <Tr key={item.id}>
                                            <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }} >
                                                <ButtonPacientes onClick={onOpen} href={`/paciente/${data.pacienteId}/dadospaciente`} />
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

                                            {/* <Td color={"#474749"} fontSize={{ '2xl': "20px", xl: "16px", lg: "14px", xxs: "14px" }}>
                                                <CardPacientes
                                                    text={item?.pago ? "Pago" : "Não Pago"}
                                                    bgOne={item?.pago ? "#0BB7AF26" : "#F64E6026"}
                                                    color={item?.pago ? "#0BB7AF" : "#F64E60"}
                                                />
                                            </Td> */}
                                        </Tr>


                                    ))}
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
    )
}