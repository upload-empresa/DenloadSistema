import { HStack, Textarea, useToast } from "@chakra-ui/react"

import { ButtonSave } from "@/components/Buttons"
import { CardMain } from "@/components/Cards"
import { TitleCards } from "@/components/Title"
import { Main } from "../../../../components/Main"
import { CardPacientesPlus } from "@/components/Cards/plus"

import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";

import Layout from "@/components/app/Layout";
import Loader from "@/components/app/Loader";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { ChangeEvent } from "react";

import type { WithSitePaciente } from "@/types";

interface AnotacoesData {
    anotacoes: string;
}

export default function Anotacoes() {
    const router = useRouter();
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']

    // TODO: Undefined check redirects to error
    const { id: pacienteId } = router.query;

    const { data: paciente, isValidating } = useSWR<WithSitePaciente>(
        router.isReady && `/api/paciente?pacienteId=${pacienteId}`,
        fetcher,
        {
            dedupingInterval: 1000,
            onError: () => router.push("/"),
            revalidateOnFocus: false,
        }
    );

    const [savedState, setSavedState] = useState(
        paciente
            ? `Last saved at ${Intl.DateTimeFormat("en", { month: "short" }).format(
                new Date(paciente.updatedAt)
            )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
                new Date(paciente.updatedAt)
            )} ${Intl.DateTimeFormat("en", {
                hour: "numeric",
                minute: "numeric",
            }).format(new Date(paciente.updatedAt))}`
            : "Saving changes..."
    );

    const [data, setData] = useState<AnotacoesData>({
        anotacoes: "",
    });

    useEffect(() => {
        if (paciente)
            setData({
                anotacoes: paciente.anotacoes ?? "",
            });
    }, [paciente]);

    const [debouncedData] = useDebounce(data, 1000);

    const saveChanges = useCallback(
        async (data: AnotacoesData) => {
            setSavedState("Saving changes...");

            try {
                const response = await fetch("/api/paciente", {
                    method: HttpMethod.PUT,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: pacienteId,
                        anotacoes: data.anotacoes,
                    }),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setSavedState(
                        `Last save ${Intl.DateTimeFormat("en", { month: "short" }).format(
                            new Date(responseData.updatedAt)
                        )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
                            new Date(responseData.updatedAt)
                        )} at ${Intl.DateTimeFormat("en", {
                            hour: "numeric",
                            minute: "numeric",
                        }).format(new Date(responseData.updatedAt))}`
                    );
                } else {
                    setSavedState("Failed to save.");
                    //@ts-ignore
                    toast.error("Failed to save");
                }
            } catch (error) {
                console.error(error);
            }
        },
        [pacienteId]
    );

    useEffect(() => {
        if (debouncedData.anotacoes) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    const [publishing, setPublishing] = useState(false);
    const [pago, setPago] = useState(false)
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        function clickedSave(e: KeyboardEvent) {
            let charCode = String.fromCharCode(e.which).toLowerCase();

            if ((e.ctrlKey || e.metaKey) && charCode === "s") {
                e.preventDefault();
                saveChanges(data);
            }
        }

        window.addEventListener("keydown", clickedSave);

        return () => window.removeEventListener("keydown", clickedSave);
    }, [data, saveChanges]);

    async function publish() {
        setPublishing(true);
        setPago(true)
        if (pago) {
            setPago(false)
        }


        try {
            const response = await fetch(`/api/paciente`, {
                method: HttpMethod.PUT,
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    id: pacienteId,
                    anotacoes: data.anotacoes,
                }),

            }
            );

            if (response.ok) {
                setPago(true),
                    mutate(`/api/paciente?pacienteId=${pacienteId}`);
                toast({
                    title: `Anotação salva com sucesso!`,
                    status: 'success',
                    isClosable: true,
                })

            }
        } catch (error) {
            console.error(error);
        } finally {
            setPublishing(false);
            setPago(false)
        }
    }

    if (isValidating)
        return (
            <Layout>
                <Loader />
            </Layout>
        );


    return (
        <Main title={"Detalhes do Paciente"} w={"25%"} path={"/perfil.png"} altText={"Ícone do Denload"} tamh={51} tamw={56}>
            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardPacientesPlus />
                <CardMain radius={"0 18px 18px 0"} spacing={5} w={"90%"}>
                    <TitleCards title={"Anotações do Paciente"} />
                    <Textarea onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setData({
                            ...data,
                            anotacoes: (e.target as HTMLTextAreaElement).value,
                        })
                    } placeholder='Digite aqui suas anotações sobre este paciente' height={"400px"} value={data.anotacoes} />
                    <ButtonSave onClick={async () => {
                        await publish();
                    }} align="end" />
                </CardMain>
            </HStack>

        </Main>

    )
}

