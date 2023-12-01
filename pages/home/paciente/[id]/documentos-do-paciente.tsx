import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";


import BlurImage from "@/components/BlurImage";
import CloudinaryUploadWidget from "@/components/Cloudinary";
import Layout from "@/components/app/Layout";
import Loader from "@/components/app/Loader";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import Link from "next/link";


import type { WithPacienteDocumento } from "@/types";

import { Button, HStack, Stack, Text, useToast } from "@chakra-ui/react"

import { ButtonSave } from "@/components/Buttons"
import { CardMain, CardsDocumentos } from "@/components/Cards"
import { Main } from "@/components/Main"
import type { Documento, Paciente } from "@prisma/client";
import { CardPacientesPlus } from "@/components/Cards/plus";
import { TitleCardsPacientes, TitleCards } from "@/components/Title";
import DocGallery from "@/components/DocGallery";
import ImageUpload from "@/components/image-upload";
import { ImagePlus } from "lucide-react";


interface DocumentoData {
    url: string;
}


interface SiteDocumentoData {
    documentos: Array<Documento>;
    paciente: Paciente | null;
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

export default function Documento() {
    const router = useRouter();
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']

    const { id: pacienteId } = router.query;

    const { id: documentoId } = router.query;

    const [isUploadWidgetVisible, setIsUploadWidgetVisible] = useState(false);


    const { data: documentodata } = useSWR<SiteDocumentoData>(
        pacienteId && `/api/documento?pacienteId=${pacienteId}&published=true`,
        fetcher,
    );

    const { data: documento, isValidating } = useSWR<WithPacienteDocumento>(
        router.isReady && `/api/documento?documentoId=${documentoId}`,
        fetcher,
        {
            dedupingInterval: 1000,
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
                const response = await fetch(`/api/documento?pacienteId=${pacienteId}`, {
                    method: HttpMethod.POST,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: documentoId,
                        url: data.url,
                    }),
                });
                window.location.reload()

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
                    window.location.reload()

                } else {
                    setSavedState("Failed to save.");

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
            const response = await fetch(`/api/documento?pacienteId=${pacienteId}`, {
                method: HttpMethod.POST,
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
                window.location.reload()

            }
        } catch (error) {
            console.error(error);
        } finally {
            setPublishing(false);
            window.location.reload()
        }
    }

    async function deleteDocumento(pacienteId: string, documentoId: string) {
        try {
            const response = await fetch(`/api/documento?pacienteId=${pacienteId}&documentoId=${documentoId}`, {
                method: HttpMethod.DELETE,
            });

        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteClick = (iba: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esse documento?')) {
            return;
        }
        //@ts-ignore
        deleteDocumento(pacienteId, iba);
        toast({
            title: `Documento deletado com sucesso!`,
            status: 'success',
            isClosable: true,
        })
        window.location.reload()
    };

    if (isValidating)
        return (
            <Loader />
        );



    return (
        <>


            <Main title={"Detalhes do Paciente"} w={""} path={""} altText={""} tamh={0} tamw={0}>

                <HStack
                    spacing={0}
                    align={"stretch"}
                >
                    <CardPacientesPlus />

                    <CardMain radius={'0 18px 18px 0'} spacing={5} w={"90%"}>
                        <TitleCards title={"Adicionar Documentos"} />
                        <Layout
                            //@ts-ignore 
                            pacienteId={documento?.paciente?.id}>




                            <CloudinaryUploadWidget
                                callback={(e) =>
                                    setData({
                                        ...data,
                                        url: e.secure_url,
                                    })
                                }
                            >
                                {({ open }) => (
                                    <Button
                                        colorScheme={'teal'}
                                        w={{ '2xl': "18%", xl: "25%", lg: "35%", md: "35%", sm: "50%", xxs: "75%" }}
                                        size={"sm"}
                                        onClick={open}

                                    >
                                        Adicionar Documento
                                    </Button>
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





                        </Layout >
                        <HStack
                            spacing={{ md: 6, xxs: 0 }}
                            flexDir={{ md: "row", xxs: "column" }}
                        >
                            <DocGallery onClick={handleDeleteClick} photos={documentodata?.documentos ?? []} />
                        </HStack>
                        <Stack
                            align={"end"}
                        >
                            <ButtonSave />
                        </Stack>

                    </CardMain>
                </HStack >
            </Main >
        </>
    );
}
