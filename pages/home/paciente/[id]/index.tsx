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

interface PacienteData {
    name: string;
    telefone: string;
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

export default function Paciente() {
    const router = useRouter();

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
        email: "",
        grupo: ""
    });

    useEffect(() => {
        if (paciente)
            setData({
                name: paciente.name ?? "",
                email: paciente.email ?? "",
                telefone: paciente.telefone ?? "",
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

        }
    }

    if (isValidating)
        return (
            <Layout>
                <Loader />
            </Layout>
        );

    return (
        <>
            <Layout siteId={paciente?.site?.id}>
                <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16">
                    <TextareaAutosize
                        name="name"
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                name: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled Paciente"
                        value={data.name}
                    />

                    <TextareaAutosize
                        name="telefone"
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                telefone: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled Paciente"
                        value={data.telefone}
                    />


                    <select
                        name="grupo"
                        //@ts-ignore
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                grupo: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled Paciente"
                        defaultValue={data.grupo}
                    >
                        <option value="Infantil" color="#A1A1A1">Infantil</option>
                        <option value="Adolescente" color="#A1A1A1">Adolescente</option>
                        <option value="Adulto" color="#A1A1A1">Adulto</option>
                        <option value="Idoso" color="#A1A1A1">Idoso</option>
                    </select>

                    <TextareaAutosize
                        id="email"
                        name="email"
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                email: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled Paciente"
                        value={data.email}
                    />


                    <div className="relative mb-6">
                        <div
                            className="absolute inset-0 flex items-center"
                            aria-hidden="true"
                        >
                            <div className="w-full border-t border-gray-300" />
                        </div>
                    </div>

                </div>
                <footer className="h-20 z-5 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
                    <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-between items-center">
                        <div className="text-sm">
                            <strong>
                                <p>{paciente?.pago ? "Pago" : "Draft"}</p>
                            </strong>
                            <p>{savedState}</p>
                        </div>
                        <button
                            onClick={async () => {
                                await publish();
                            }}


                        >

                            <p>{publishing ? <LoadingDots /> : "Salvar alterações"}</p>
                        </button>
                        <text>
                            {paciente?.pago ? "Pago" : "Não Pago"}
                        </text>
                    </div>
                </footer>
            </Layout>
        </>
    );
}
