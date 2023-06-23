import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import type { NextPageWithLayout } from "types";
import ModalAddAnamneses from "@/components/Modais";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext, GetStaticPaths } from "next";
import { HStack, Stack } from "@chakra-ui/react"
import { Main } from "@/components/Main";
import { CardMain } from "@/components/Cards"
import { TitleCards } from "@/components/Title";
import { ButtonDelete, ButtonDeletePlus, ButtonSave } from "@/components/Buttons";
import { Forms } from "@/components/Forms";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Anamnese, Paciente } from "@prisma/client";
import React from "react";
import { CardPacientesPlus } from "@/components/Cards/plus";

interface SiteAnamneseData {
    anamneses: Array<Anamnese>;
    paciente: Paciente | null;
    pergunta: string;
    resposta: string;
}



const AllAnamneses: NextPageWithLayout = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [visible, setVisible] = useState(false);
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
    );


    const { slug } = router.query;
    const { t } = useTranslation("common");

    async function deleteAnamnese(pacienteId: string, anamneseId: string) {
        try {
            const response = await fetch(`/api/anamnese?anamneseId=${anamneseId}&pacienteId=${pacienteId}`, {
                method: HttpMethod.DELETE,
            });

        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteClick = (iba: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esse anamnese?')) {
            return;
        }
        //@ts-ignore
        deleteAnamnese(pacienteId, iba);
    };


    return (

        <Main title={"Detalhes do Paciente"} w={""} path={""} altText={""} tamh={0} tamw={0}>

            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardPacientesPlus />
                <CardMain radius={"0 18px 18px 0"} spacing={5} w={"90%"}>
                    <HStack
                        justify={"space-between"}
                        flexDir={{ md: "row", xxs: "column" }}
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
        paths: [],
        fallback: 'blocking'
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
