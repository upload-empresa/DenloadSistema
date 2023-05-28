import { HStack } from "@chakra-ui/react"
import { IoPersonOutline } from "react-icons/io5"
import { MdOutlineInsertDriveFile, MdOutlineImageSearch } from "react-icons/md"
import { Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"

import { CardMainPlus, CardIconPacientes, CardMain, CardPacientes } from "../../../../components/Cards"
import { Main } from "../../../../components/Main"
// import { TableMain2 } from "../../../../components/Table/TableMain2"
import { Pagination } from "@/components/Pagination"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithSiteDespesa } from "@/types";
import type { Despesa, Site } from "@prisma/client";
import Modal from "@/components/Modal";
import { Select } from "@chakra-ui/react"
import { ButtonAdd, ButtonPacientes } from "@/components/Buttons"
import { TitleCards, TitleCardsPacientes } from "@/components/Title"

interface SiteDespesaData {
    despesas: Array<Despesa>;
    site: Site | null;
}

//@ts-ignore
export default function Despesas({ despesa, despesa }) {
    const [creatingDespesa, setCreatingDespesa] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingDespesa, setDeletingDespesa] = useState(false);

    const router = useRouter();
    const { id: siteId } = router.query;
    const { id: despesaId } = router.query;


    const { data } = useSWR<SiteDespesaData>(
        siteId && `/api/despesa?siteId=${siteId}`,
        fetcher,
        {
            onSuccess: (data) => !data?.site && router.push("/"),
        }
    );

    const { data: settings, } = useSWR<WithSiteDespesa>(
        `/api/despesa?despesaId=${despesaId}`,
        fetcher,
        {
            onError: () => router.push("/"),
            revalidateOnFocus: false,
        }
    );

    async function createDespesa(siteId: string) {
        try {
            const res = await fetch(`/api/despesa?siteId=${siteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/despesa/${data.despesaId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }


    const [selectedOption, setSelectedOption] = useState('')
    const [selectResults, setSelectResults] = useState<Array<Despesa>>([]);

    const [currentPage, setCurrentPage] = useState<number>(0);

    const handlePageClick = (data: any) => {
        setCurrentPage(data.selected);
    }


    const PER_PAGE = 1;
    const offset = currentPage * PER_PAGE;
    //@ts-ignore
    const pageCount = Math.ceil(data?.despesas?.length / PER_PAGE);

    const items = data?.despesas?.slice(offset, offset + PER_PAGE);


    async function redirectEdit() {
        router.push(
            `/despesa/cli31zkt50002ufikti2nd4uj/dadosdespesa`
        );
    }

    async function deleteDespesa(siteId: string, despesaId: string) {
        setDeletingDespesa(true);
        try {
            const response = await fetch(`/api/despesa?siteId=${siteId}&despesaId=${despesaId}`, {
                method: HttpMethod.DELETE,
            });

            // if (response.ok) {
            //     router.push(`/site/${settings?.site?.id}`);
            // }
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingDespesa(false);
        }
    }

    const handleDeleteClick = (iba: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esse despesa?')) {
            return;
        }
        //@ts-ignore
        deleteDespesa(siteId, iba); // Replace `pacienteId` with the actual ID of the paciente
    };

    return (
        //@ts-ignore
        <Main title={"Financeiro"} button={<ButtonAdd text={"Nova Despesa"} onClick={() => {
            setCreatingDespesa(true);
            createDespesa(siteId as string);
        }} href={""} />}>
            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardMainPlus>
                    <CardIconPacientes icon={IoPersonOutline} text={"Geral"} href={"#"} />
                    <CardIconPacientes icon={MdOutlineInsertDriveFile} text={"Ganhos"} href={"#"} />
                    <CardIconPacientes icon={MdOutlineImageSearch} text={"Despesas"} href={"#"} />
                </CardMainPlus>
                <CardMain radius={"0 18px 18px 0"} spacing={5}>
                    <>

                        <TableContainer>
                            <Stack spacing={6}>

                                <TitleCardsPacientes
                                    //@ts-ignore
                                    children={undefined} pacientes={[]}>
                                    <TitleCards title="Despesas" />
                                </TitleCardsPacientes>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Ações</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Nome</Th>
                                            <Th textAlign={"start"} isNumeric color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Vencimento</Th>
                                            <Th color={"#B5B7C0"} fontSize={"14px"} fontWeight={500}>Empresa</Th>
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
                                                                <ButtonPacientes onClick2={redirectEdit()} />
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                <Link href={`/despesa/${item.id}/dadosdespesa`}>{item.name}</Link>
                                                            </Td>
                                                            <Td
                                                                textAlign={"start"}
                                                                isNumeric
                                                                color={"#474749"}
                                                                fontSize={"14px"}
                                                            >
                                                                {item.vencimento}
                                                            </Td>
                                                            <Td color={"#474749"} fontSize={"14px"}>
                                                                {item.empresa}
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
                                                {items?.map((item) => (
                                                    <Tr key={item.id}>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            <ButtonPacientes onClick={() => handleDeleteClick(item.id)} href={""} />
                                                        </Td>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            <Link href={`/despesa/${item.id}/dadosdespesa`}>{item.name}</Link>
                                                        </Td>
                                                        <Td
                                                            textAlign={"start"}
                                                            isNumeric
                                                            color={"#474749"}
                                                            fontSize={"14px"}
                                                        >
                                                            {item.vencimento}
                                                        </Td>
                                                        <Td color={"#474749"} fontSize={"14px"}>
                                                            {item.empresa}
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
                </CardMain>
            </HStack>

        </Main>
    )
}