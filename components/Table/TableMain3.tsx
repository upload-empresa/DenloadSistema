import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import { ButtonPacientes } from "../Buttons"
import { CardPacientes } from "../Cards"


import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Ganho, Site } from "@prisma/client";

interface SiteGanhoData {
    ganhos: Array<Ganho>;
    site: Site | null;
}

interface TableMainProps {
    title: string
    name: string
    phone: string
    email: string
    group: string
    thead1: string
    thead2: string
    thead3: string
}

export function TableMain3({ title, name, phone, email, group, thead1, thead2, thead3 }: TableMainProps) {
    const [creatingGanho, setCreatingGanho] = useState(false);

    const router = useRouter();
    const { id: siteId } = router.query;

    const { data } = useSWR<SiteGanhoData>(
        siteId && `/api/ganho?siteId=${siteId}`,
        fetcher,

    );

    async function createGanho(siteId: string) {
        try {
            const res = await fetch(`/api/ganho?siteId=${siteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/ganho/${data.ganhoId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <TableContainer>
            <Stack spacing={6}>
                {/* <TitleCardsPacientes children={undefined} ganhos={[]}>
                    <TitleCards title={title} />
                </TitleCardsPacientes> */}
                <Table>
                    <Thead>
                        <Tr>

                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Ações</Th>
                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Nome</Th>
                            <Th textAlign={"start"} isNumeric color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>{thead1}</Th>
                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>{thead2}</Th>
                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>{thead3}</Th>
                            {/* <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Status</Th> */}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data ? (
                            data.ganhos.length > 0 ? (
                                data.ganhos.map((ganho) => (
                                    <Tr key={ganho.id}>
                                        <Td color={"#474749"} fontSize={"14px"}>
                                            <ButtonPacientes />
                                        </Td>
                                        <Td color={"#474749"} fontSize={"14px"}>
                                            <Link href={`/ganho/${ganho.id}`}>{ganho.name}</Link>
                                        </Td>
                                        <Td
                                            textAlign={"start"}
                                            isNumeric
                                            color={"#474749"}
                                            fontSize={"14px"}
                                        >
                                            {ganho.valor}
                                        </Td>
                                        <Td color={"#474749"} fontSize={"14px"}>
                                            {ganho.name}
                                        </Td>
                                        <Td color={"#474749"} fontSize={"14px"}>
                                            {ganho.name}
                                        </Td>
                                        {/* <Td color={"#474749"} fontSize={"14px"}>
                                            <CardPacientes
                                                text={ganho?.pago ? "Pago" : "Não Pago"}
                                                bgOne={ganho?.pago ? "#0BB7AF26" : "#F64E6026"}
                                                color={ganho?.pago ? "#0BB7AF" : "#F64E60"}
                                            />
                                        </Td> */}
                                    </Tr>
                                ))
                            ) : (
                                <>
                                    <p className="text-2xl font-cal text-gray-600">
                                        Sem ganhos ainda. Clique em &quot;Novo Ganho&quot; para criar um.
                                    </p>
                                </>
                            )
                        ) : (
                            <p>Carregando...</p>
                        )}
                    </Tbody>

                    <Tfoot>
                        <Tr>
                        </Tr>
                    </Tfoot>
                </Table>
            </Stack>
        </TableContainer>
    )
}