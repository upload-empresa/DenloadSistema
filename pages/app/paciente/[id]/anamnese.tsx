import useAnamneses from "hooks/useAnamneses";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "react-daisyui";
import type { NextPageWithLayout } from "types";
import Anamneses from "./iba";
import ModalAddAnamneses from "@/components/Modais";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext, GetStaticPaths } from "next";
import { HStack, Stack, useDisclosure } from "@chakra-ui/react"
import { Main } from "@/components/Main";
import { CardMainPlus, CardIconPacientes, CardMain } from "@/components/Cards"
import { MdOutlineInsertDriveFile, MdOutlineImageSearch } from "react-icons/md"
import { IoPersonOutline } from "react-icons/io5"
import { TitleCards } from "@/components/Title";
import { ButtonDelete, ButtonDeletePlus, ButtonSave } from "@/components/Buttons";
import { Forms, Selects } from "@/components/Forms";
import { useEffect, useRef } from "react";
import Layout from "@/components/app/Layout";
import BlurImage from "@/components/BlurImage";
import Modal from "@/components/Modal";
import LoadingDots from "@/components/app/loading-dots";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { FormEvent } from "react";
import type { Anamnese, Paciente } from "@prisma/client";
import React from "react";

interface SiteAnamneseData {
    anamneses: Array<Anamnese>;
    paciente: Paciente | null;
    pergunta: string;
    resposta: string;
}



const AllAnamneses: NextPageWithLayout = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    // useEffect(() => {
    //     const checkVisibility = () => {
    //         setIsVisible(true)
    //     }
    //     checkVisibility()
    // })
    const setarBotao = () => {
        if (isVisible) {
            setIsVisible(false)
        } else {
            setIsVisible(true)
        }

    };
    const router = useRouter();
    const { id: pacienteId } = router.query;

    const { data } = useSWR<SiteAnamneseData>(
        pacienteId && `/api/anamnese?pacienteId=${pacienteId}&published=true`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.paciente && router.push("/"),
        // }
    );


    const { slug } = router.query;
    const { t } = useTranslation("common");

    async function deleteAnamnese(pacienteId: string, anamneseId: string) {
        try {
            const response = await fetch(`/api/anamnese?anamneseId=${anamneseId}&pacienteId=${pacienteId}`, {
                method: HttpMethod.DELETE,
            });

            // if (response.ok) {
            //     router.push(`/paciente/${settings?.paciente?.id}`);
            // }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteClick = (iba: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esse anamnese?')) {
            return;
        }
        //@ts-ignore
        deleteAnamnese(pacienteId, iba); // Replace `anamneseId` with the actual ID of the anamnese
    };


    return (

        <Main title={"Detalhes do Paciente"} w={""} path={""} altText={""} tamh={0} tamw={0}>

            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardMainPlus>
                    <CardIconPacientes icon={IoPersonOutline} text={"Dados"} href={"/pacientes/dados-do-paciente"} />
                    <CardIconPacientes icon={MdOutlineInsertDriveFile} text={"Documentos"} href={"/pacientes/documentos-do-paciente"} />
                    <CardIconPacientes icon={MdOutlineImageSearch} text={"Imagens"} href={"/pacientes/imagens-do-paciente"} />
                    <CardIconPacientes icon={MdOutlineImageSearch} text={"Anamneses"} href={"/pacientes/anamneses"} />
                    <CardIconPacientes icon={MdOutlineImageSearch} text={"Anotações"} href={"#"} />
                </CardMainPlus>
                <CardMain radius={"0 18px 18px 0"} spacing={5} w={"90%"}>
                    <HStack
                        justify={"space-between"}
                    >
                        <TitleCards title={"Anameses do Consultório"} />
                        <HStack>
                            <ButtonDelete onClick={() => setarBotao()} />
                            <ModalAddAnamneses visible={visible} setVisible={setVisible} />
                        </HStack>
                    </HStack>

                    <Stack
                        spacing={10}
                    >
                        <Stack
                            align="stretch"
                        >

                            {data ? (
                                data.anamneses.length > 0 ? (
                                    data.anamneses.map((anamnese) => (
                                        <><React.Fragment key={anamnese.id}><HStack
                                            align={"start"}
                                        >

                                            <><Forms label={anamnese.pergunta} w={"99%"} type={"text"} placeholder={anamnese.pergunta} />
                                                {isVisible && <ButtonDeletePlus onClick={() => handleDeleteClick(anamnese.id)} />}
                                            </>
                                        </HStack>
                                        </React.Fragment>
                                        </>

                                    ))
                                ) : (
                                    <>


                                        <p className="text-2xl font-cal text-gray-600">
                                            Nenhuma anamneses ainda. Clique em &quot;Nova anamnese&quot; para criar uma.
                                        </p>

                                    </>
                                )
                            ) : (
                                <p>Carregando...</p>
                            )
                            }
                        </Stack>


                    </Stack>
                    <Stack
                        align={"end"}
                        w="100%"
                    >
                        <ButtonSave align="end" type='submit' />
                    </Stack>
                </CardMain>
            </HStack>


        </Main>
    )
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
    return {
        props: {
            ...(locale ? await serverSideTranslations(locale, ["common"]) : {}),
        },
    };
}

export default AllAnamneses;
