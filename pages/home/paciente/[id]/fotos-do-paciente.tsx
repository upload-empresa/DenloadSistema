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


import type { WithPacienteFoto } from "@/types";

import { HStack, Stack, Text, useToast } from "@chakra-ui/react"

import { ButtonSave } from "@/components/Buttons"
import { CardMain, CardsDocumentos } from "@/components/Cards"
import { Main } from "@/components/Main"
import type { Foto, Paciente } from "@prisma/client";
import { CardPacientesPlus } from "@/components/Cards/plus";
import { TitleCardsPacientes, TitleCards } from "@/components/Title";

interface FotoData {
    url: string;
}


interface SiteFotoData {
    fotos: Array<Foto>;
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

export default function Foto() {
    const router = useRouter();
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']

    const { id: pacienteId } = router.query;

    const { id: fotoId } = router.query;


    const { data: fotodata } = useSWR<SiteFotoData>(
        pacienteId && `/api/foto?pacienteId=${pacienteId}&published=true`,
        fetcher,
    );

    const { data: foto, isValidating } = useSWR<WithPacienteFoto>(
        router.isReady && `/api/foto?fotoId=${fotoId}`,
        fetcher,
        {
            dedupingInterval: 1000,
            revalidateOnFocus: false,
        }
    );

    const [savedState, setSavedState] = useState(
        foto
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

    const [data, setData] = useState<FotoData>({
        url: "",

    });

    useEffect(() => {
        if (foto)
            setData({
                url: foto.url ?? "",
            });
    }, [foto]);

    const [debouncedData] = useDebounce(data, 1000);

    const saveChanges = useCallback(
        async (data: FotoData) => {
            setSavedState("Saving changes...");

            try {
                const response = await fetch(`/api/foto?pacienteId=${pacienteId}`, {
                    method: HttpMethod.POST,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: fotoId,
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
        [fotoId]
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
            const response = await fetch(`/api/foto?pacienteId=${pacienteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: fotoId,
                    url: data.url,
                }),
            });

            if (response.ok) {
                mutate(`/api/foto?fotoId=${fotoId}`);
                window.location.reload()

            }
        } catch (error) {
            console.error(error);
        } finally {
            setPublishing(false);
            window.location.reload()
        }
    }

    async function deleteFoto(pacienteId: string, fotoId: string) {
        try {
            const response = await fetch(`/api/foto?pacienteId=${pacienteId}&fotoId=${fotoId}`, {
                method: HttpMethod.DELETE,
            });

        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteClick = (iba: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esse foto?')) {
            return;
        }
        //@ts-ignore
        deleteFoto(pacienteId, iba);
        toast({
            title: `Foto deletado com sucesso!`,
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
                        <TitleCards title={"Adicionar Fotos"} />
                        <Layout
                            //@ts-ignore 
                            pacienteId={foto?.paciente?.id}>
                            <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16">


                                <div className="space-y-6">
                                    <div
                                        className={`${data.url ? "" : "animate-pulse bg-gray-300 h-150"
                                            } relative mt-5 w-full border-2 border-gray-800 border-dashed rounded-md`}
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
                                    </div>

                                </div>
                            </div >
                        </Layout >
                        <HStack
                            spacing={{ md: 6, xxs: 0 }}
                            flexDir={{ md: "row", xxs: "column" }}
                        >
                            {fotodata ? (
                                fotodata.fotos.length > 0 ? (
                                    fotodata.fotos.map((foto) => (
                                        <>


                                            {foto.url ? (

                                                <CardsDocumentos onClick={() => handleDeleteClick(foto.id)} alt={foto.url ?? "Unknown Thumbnail"} src={foto.url} width={30} height={22} />

                                            ) : (
                                                ''
                                            )}
                                        </>
                                    ))
                                ) : (
                                    <>
                                        <Text
                                            as="p"
                                            mt={"10%"}
                                        >
                                            Clique acima para adicionar uma nova imagem
                                        </Text>
                                    </>
                                )
                            ) : (
                                <p>Carregando...</p>
                            )}
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
