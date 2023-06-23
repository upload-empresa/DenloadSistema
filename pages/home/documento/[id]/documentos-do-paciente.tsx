import React, { useState } from 'react'
import { HStack, Stack } from "@chakra-ui/react"

import { Main } from '@/components/Main'
import { CardMainPlus, CardIconPacientes, CardMain } from '@/components/Cards'
import { IoPersonOutline } from 'react-icons/io5'
import { MdOutlineInsertDriveFile, MdOutlineImageSearch } from 'react-icons/md'
import { TitleCards } from '@/components/Title'

import { useRouter } from "next/router";

import BlurImage from "@/components/BlurImage";
import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Documento, Paciente } from "@prisma/client";
import type { WithPacienteDocumento } from "@/types";
import { useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import Loader from "@/components/app/Loader";
import CloudinaryUploadWidget from "@/components/Cloudinary";

interface SiteDocumentoData {
    documentos: Array<Documento>;
    paciente: Paciente | null;
}

interface DocumentoData {
    url: string;
}

export default function DocPacientes() {
    const [info, updateInfo] = useState<any>();
    const [error, updateError] = useState<any>();

    function handleOn(error: any, result: { info: any }, widget: { close: (arg0: { quiet: boolean }) => void }) {
        if (error) {
            updateError(error);
            return
        }

        updateInfo(result?.info);

        widget.close({
            quiet: true
        })
    }

    const [creatingDocumento, setCreatingDocumento] = useState(false);

    const router = useRouter();
    const { id: pacienteId } = router.query;
    const { id: documentoId } = router.query;

    const { data: documentoMostrar } = useSWR<SiteDocumentoData>(
        pacienteId && `/api/documento?pacienteId=${pacienteId}&published=true`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.site && router.push("/"),
        // }
    );

    const { data: documento, isValidating } = useSWR<WithPacienteDocumento>(
        router.isReady && `/api/documento?documentoId=${documentoId}`,
        fetcher,
        {
            dedupingInterval: 1000,
            onError: () => router.push("/"),
            revalidateOnFocus: false,
        }
    );


    const [savedState, setSavedState] = useState(
        documento
            ? `Last saved at ${Intl.DateTimeFormat("en", { month: "short" }).format(
                new Date()
            )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
                new Date()
            )} ${Intl.DateTimeFormat("en", {
                hour: "numeric",
                minute: "numeric",
            }).format(new Date())}`
            : "Saving changes..."
    );

    const [data, setData] = useState<DocumentoData>({
        url: "",

    });

    useEffect(() => {
        if (documento)
            setData({
                url: documento.url ?? "",
            });
    }, [documento]);

    const [debouncedData] = useDebounce(data, 1000);

    const saveChanges = useCallback(
        async (data: DocumentoData) => {
            setSavedState("Saving changes...");

            try {
                const response = await fetch("/api/documento", {
                    method: HttpMethod.PUT,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: documentoId,
                        url: data.url,
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
                    toast.error("Failed to save");
                }
            } catch (error) {
                console.error(error);
            }
        },
        [documentoId]
    );

    useEffect(() => {
        if (debouncedData.url) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    const [publishing, setPublishing] = useState(false);
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

        try {
            const response = await fetch(`/api/documento`, {
                method: HttpMethod.PUT,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: documentoId,
                    url: data.url,
                }),
            });

            if (response.ok) {
                mutate(`/api/documento?documentoId=${documentoId}`);

            }
        } catch (error) {
            console.error(error);
        } finally {
            setPublishing(false);
        }
    }

    if (isValidating)
        return (
            <Layout>
                <Loader />
            </Layout>
        );


    async function createDocumento(pacienteId: string) {
        try {
            const res = await fetch(`/api/documento?pacienteId=${pacienteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/documento/${data.documentoId}/imagens-do-paciente`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Main title={'Detalhes do Paciente'} w={''} path={''} altText={''} tamh={0} tamw={0}>
            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardMainPlus>
                    <CardIconPacientes icon={IoPersonOutline} text={"Dados"} href={"/pacientes/dados-do-paciente"} />
                    <button onClick={() => {
                        setCreatingDocumento(true);
                        createDocumento(pacienteId as string);
                    }}>
                        <CardIconPacientes icon={MdOutlineInsertDriveFile} text={"Documentos"} href={""} />
                    </button>
                    <button onClick={() => {
                        setCreatingDocumento(true);
                        createDocumento(pacienteId as string);
                    }}>
                        <CardIconPacientes icon={MdOutlineImageSearch} text={"Imagens"} href={"/pacientes/imagens-do-paciente"} />
                    </button>
                    <CardIconPacientes icon={MdOutlineImageSearch} text={"Anamneses"} href={"/pacientes/anamneses"} />
                    <CardIconPacientes icon={MdOutlineImageSearch} text={"Anotações"} href={"#"} />
                </CardMainPlus>

                <CardMain radius={'0 18px 18px 0'} spacing={5} w={"90%"}>
                    <TitleCards title={"Adicionar Documentos"} />

                    <Stack
                        bg="#e3e3e3"
                        border="2px solid #2facfa"
                        p={8}
                        bgImage={"url('/Auto Layout Vertical.png')"}
                        bgRepeat={'no-repeat'}
                        borderRadius={"18px"}
                    >

                        <CloudinaryUploadWidget
                            callback={(e) =>
                                setData({
                                    ...data,
                                    url: e.secure_url,
                                })
                            }
                        >
                            {({ open }) => (
                                <button
                                    onClick={open}
                                    className="absolute w-full h-full rounded-md bg-gray-200 z-10 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition-all ease-linear duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100"
                                        height="100"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M16 16h-3v5h-2v-5h-3l4-4 4 4zm3.479-5.908c-.212-3.951-3.473-7.092-7.479-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h3.5v-2h-3.5c-1.93 0-3.5-1.57-3.5-3.5 0-2.797 2.479-3.833 4.433-3.72-.167-4.218 2.208-6.78 5.567-6.78 3.453 0 5.891 2.797 5.567 6.78 1.745-.046 4.433.751 4.433 3.72 0 1.93-1.57 3.5-3.5 3.5h-3.5v2h3.5c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408z" />
                                    </svg>
                                    <p>Upload another url</p>
                                </button>
                            )}
                        </CloudinaryUploadWidget>

                        {data?.url && (
                            <BlurImage
                                src={data.url}
                                alt="Cover Photo"
                                width={800}
                                height={500}
                                placeholder="blur"
                                className="rounded-md w-full h-full object-cover"
                                blurDataURL={data.url}
                            />
                        )}

                    </Stack>




                    <p>{savedState}</p>

                    <button
                        onClick={async () => {
                            await publish();
                        }}
                        //@ts-ignore
                        url={
                            disabled
                                ? "documento must have a url, , and content to be published."
                                : "Publish"
                        }
                        disabled={disabled}
                        className={`${disabled
                            ? "cursor-not-allowed bg-gray-300 border-gray-300"
                            : "bg-black hover:bg-white hover:text-black border-black"
                            } mx-2 w-32 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
                    >
                        {publishing ? <LoadingDots /> : "Publish  →"}
                    </button>
                </CardMain>
            </HStack>
        </Main>
    )
}
