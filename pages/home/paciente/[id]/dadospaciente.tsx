import { Button, HStack, Stack, useToast } from "@chakra-ui/react"
import { IoPersonOutline } from "react-icons/io5"
import { MdEditNote, MdOutlineImageSearch, MdOutlineInsertDriveFile } from 'react-icons/md'
import { SlNote } from 'react-icons/sl'

import { CardIconPacientes, CardMain, CardMainPlus } from "../../../../components/Cards"
import { Forms, Selects, TextAreas } from "../../../../components/Forms"
import { Main } from "../../../../components/Main"

import useSWR, { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";

import Layout from "@/components/app/Layout";
import Loader from "@/components/app/Loader";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { ChangeEvent } from "react";

import type { WithSitePaciente } from "@/types";

interface PacienteData {
    name: string;
    telefone: string;
    rg: string;
    sexo: string;
    complemento: string;
    cep: string;
    endereco: string;
    cpf: string;
    observacoes: string;
    grupo: string;
    email: string;
}

const CONTENT_PLACEHOLDER = `Write some content. Markdown supported:

# A H1 header

## A H2 header

Fun fact: You embed tweets by pasting the tweet URL in a new line:

https://twitter.com/nextjs/status/1468044361082580995

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, and **bold**. Itemized lists look like:

  * this one
  * that one
  * the other one

Ordered lists look like:

  1. first item
  2. second item
  3. third item

> Block quotes are written like so.
>
> They can span multiple paragraphs,
> if you like.

            `;

export default function DadosDoPaciente() {
    const router = useRouter();
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']

    const { id: pacienteId } = router.query;

    const { data: paciente, isValidating } = useSWR<WithSitePaciente>(
        router.isReady && `/api/paciente?pacienteId=${pacienteId}`,
        fetcher,
        {
            dedupingInterval: 1000,
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

    const [data, setData] = useState<PacienteData>({
        name: "",
        telefone: "",
        rg: "",
        observacoes: "",
        sexo: "",
        complemento: "",
        cep: "",
        endereco: "",
        cpf: "",
        email: "",
        grupo: ""
    });

    useEffect(() => {
        if (paciente)
            setData({
                name: paciente.name ?? "",
                email: paciente.email ?? "",
                telefone: paciente.telefone ?? "",
                rg: paciente.rg ?? "",
                observacoes: paciente.observacoes ?? "",
                sexo: paciente.sexo ?? "",
                complemento: paciente.complemento ?? "",
                cep: paciente.cep ?? "",
                endereco: paciente.endereco ?? "",
                cpf: paciente.cpf ?? "",
                grupo: paciente.grupo ?? ""
            });
    }, [paciente]);

    const [debouncedData] = useDebounce(data, 1000);

    const saveChanges = useCallback(
        async (data: PacienteData) => {
            setSavedState("Saving changes...");

            try {
                const response = await fetch("/api/paciente", {
                    method: HttpMethod.PUT,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: pacienteId,
                        name: data.name,
                        telefone: data.telefone,
                        rg: data.rg,
                        observacoes: data.observacoes,
                        sexo: data.sexo,
                        complemento: data.complemento,
                        cep: data.cep,
                        endereco: data.endereco,
                        cpf: data.cpf,
                        grupo: data.grupo,
                        email: data.email
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
        if (debouncedData.name) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.telefone) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.observacoes) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.sexo) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.complemento) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.cep) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.endereco) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.cpf) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.rg) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);


    useEffect(() => {
        if (debouncedData.grupo) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.email) saveChanges(debouncedData);
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
                    name: data.name,
                    telefone: data.telefone,
                    rg: data.rg,
                    observacoes: data.observacoes,
                    sexo: data.sexo,
                    complemento: data.complemento,
                    cep: data.cep,
                    endereco: data.endereco,
                    cpf: data.cpf,
                    grupo: data.grupo,
                    email: data.email,
                    published: true,
                    subdomain: paciente?.site?.subdomain,
                    customDomain: paciente?.site?.customDomain,
                    slug: paciente?.slug,
                }),

            }
            );

            if (response.ok) {
                setPago(true),
                    mutate(`/api/paciente?pacienteId=${pacienteId}`);

            }
        } catch (error) {
            console.error(error);

        } finally {
            setPublishing(false);
            setPago(false)
            toast({
                title: `Paciente criado com sucesso!`,
                status: 'success',
                isClosable: true,
            })
            router.back();
        }
    }

    if (isValidating)
        return (

            <Loader />

        );

    return (
        //@ts-ignore
        <Main title={"Detalhes do Paciente"}>

            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardMainPlus>
                    <CardIconPacientes icon={IoPersonOutline} text={"Dados"} href={`/paciente/${pacienteId}/dadospaciente`} />
                    <CardIconPacientes icon={MdOutlineInsertDriveFile} text={"Documentos"} href={`/paciente/${pacienteId}/documentos-do-paciente`} />
                    <CardIconPacientes icon={MdOutlineImageSearch} text={"Imagens"} href={`/paciente/${pacienteId}/fotos-do-paciente`} />
                    <CardIconPacientes icon={MdEditNote} text={"Anamneses"} href={`/paciente/${pacienteId}/anamnese`} />
                    <CardIconPacientes icon={SlNote} text={"Anotações"} href={`/paciente/${pacienteId}/anotacoes`} />
                </CardMainPlus>
                <CardMain radius={"0 18px 18px 0"} w={"90%"} spacing={5}>
                    <HStack spacing={{ md: 6, xxs: 0 }} flexDir={{ md: "row", xxs: "column" }}>
                        <Forms label={"Nome"} name={"name"} value={data.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData({
                                    ...data,
                                    name: e.target.value,
                                })
                            }
                            type={"text"} placeholder={"Nome do paciente"} mb={{ md: "0", xxs: "10%" }} />

                        <Forms label={"RG"} name={"rg"} value={data.rg}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData({
                                    ...data,
                                    rg: e.target.value,
                                })
                            }
                            type={"text"} placeholder={"RG do paciente"} />
                    </HStack>
                    <HStack spacing={{ md: 6, xxs: 0 }} flexDir={{ md: "row", xxs: "column" }}>
                        <Forms label={"Telefone"} name={"telefone"} value={data.telefone}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData({
                                    ...data,
                                    telefone: e.target.value,
                                })
                            }
                            type={"text"} placeholder={"Telefone do paciente"} />

                        <Forms label={"CPF"} name={"cpf"} value={data.cpf}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData({
                                    ...data,
                                    cpf: e.target.value,
                                })
                            }
                            type={"text"} placeholder={"CPF do paciente"} />

                    </HStack>
                    <HStack spacing={{ md: 6, xxs: 0 }} flexDir={{ md: "row", xxs: "column" }}>
                        <Forms label={"Sexo"} name={"sexo"} value={data.sexo}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData({
                                    ...data,
                                    sexo: e.target.value,
                                })
                            } type={"text"} placeholder={"Sexo do paciente"} mb={{ md: "0", xxs: "10%" }} />

                        <Forms label={"Endereço"} name={"endereco"} value={data.endereco}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData({
                                    ...data,
                                    endereco: e.target.value,
                                })
                            } type={"text"} placeholder={"Endereço do paciente"} />

                    </HStack>
                    <HStack spacing={{ md: 6, xxs: 0 }} flexDir={{ md: "row", xxs: "column" }}>

                        <Selects
                            label={"Grupo"}
                            onInput={(e: ChangeEvent<HTMLTextAreaElement>) => setData({
                                ...data,
                                grupo: (e.target as HTMLTextAreaElement).value,
                            })}
                            defaultValue={data.grupo} onInput1={undefined} defaultValue1={undefined} mb={{ md: "0", xxs: "10%" }} />

                        <Forms label={"CEP"} name={"cep"} value={data.cep}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData({
                                    ...data,
                                    cep: e.target.value,
                                })
                            } type={"number"} placeholder={"Digite o RG do paciente"} mb={{ md: "0", xxs: "10%" }} />

                    </HStack>
                    <HStack spacing={{ md: 6, xxs: 0 }} flexDir={{ md: "row", xxs: "column" }}>
                        <Forms label={"Email"} name={"email"} value={data.email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData({
                                    ...data,
                                    email: e.target.value,
                                })
                            } type={"text"} placeholder={"Email do paciente"} mb={{ md: "0", xxs: "10%" }} />

                        <Forms label={"Complemento"} name={"complemento"} value={data.complemento}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setData({
                                    ...data,
                                    complemento: e.target.value,
                                })
                            } type={"text"} placeholder={"Complemento do paciente"} />
                    </HStack>

                    <TextAreas name={"observacoes"}
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                observacoes: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        label={"Observações"}
                        value={data.observacoes} />

                    <Stack
                        align={"end"}

                    >

                        <Button
                            onClick={async () => {
                                await publish();
                            }}
                            colorScheme={'teal'}
                            w={"15%"}
                            size={"sm"}
                        >
                            Salvar
                        </Button>
                    </Stack>
                </CardMain>
            </HStack>

        </Main>
    )
}