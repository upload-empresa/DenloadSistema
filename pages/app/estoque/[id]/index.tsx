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

import type { WithSiteEstoque } from "@/types";

interface EstoqueData {
    name: string;
    validade: string;
    minimo: string;
    valorTotal: string;
    valor: string;
    unidade: string;
    dataDaCompra: string;
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

export default function Estoque() {
    const router = useRouter();

    // TODO: Undefined check redirects to error
    const { id: estoqueId } = router.query;

    const { data: estoque, isValidating } = useSWR<WithSiteEstoque>(
        router.isReady && `/api/estoque?estoqueId=${estoqueId}`,
        fetcher,
        {
            dedupingInterval: 1000,
            onError: () => router.push("/"),
            revalidateOnFocus: false,
        }
    );

    const [savedState, setSavedState] = useState(
        estoque
            ? `Last saved at ${Intl.DateTimeFormat("en", { month: "short" }).format(
                new Date(estoque.updatedAt)
            )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
                new Date(estoque.updatedAt)
            )} ${Intl.DateTimeFormat("en", {
                hour: "numeric",
                minute: "numeric",
            }).format(new Date(estoque.updatedAt))}`
            : "Saving changes..."
    );

    const [data, setData] = useState<EstoqueData>({
        name: "",
        validade: "",
        dataDaCompra: "",
        minimo: "",
        valorTotal: "",
        valor: "",
        unidade: "",
    });

    useEffect(() => {
        if (estoque)
            setData({
                name: estoque.name ?? "",
                dataDaCompra: estoque.dataDaCompra ?? "",
                validade: estoque.validade ?? "",
                minimo: estoque.minimo ?? "",
                valorTotal: estoque.valorTotal ?? "",
                valor: estoque.valor ?? "",
                unidade: estoque.unidade ?? "",
            });
    }, [estoque]);

    const [debouncedData] = useDebounce(data, 1000);

    const saveChanges = useCallback(
        async (data: EstoqueData) => {
            setSavedState("Saving changes...");

            try {
                const response = await fetch("/api/estoque", {
                    method: HttpMethod.PUT,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: estoqueId,
                        name: data.name,
                        validade: data.validade,
                        minimo: data.minimo,
                        valorTotal: data.valorTotal,
                        valor: data.valor,
                        unidade: data.unidade,
                        dataDaCompra: data.dataDaCompra
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
        [estoqueId]
    );

    useEffect(() => {
        if (debouncedData.name) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.validade) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.minimo) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.valorTotal) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.valor) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.unidade) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.dataDaCompra) saveChanges(debouncedData);
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
            const response = await fetch(`/api/estoque`, {
                method: HttpMethod.PUT,
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    id: estoqueId,
                    name: data.name,
                    validade: data.validade,
                    minimo: data.minimo,
                    valorTotal: data.valorTotal,
                    valor: data.valor,
                    unidade: data.unidade,
                    dataDaCompra: data.dataDaCompra,
                    published: true,
                    subdomain: estoque?.site?.subdomain,
                    customDomain: estoque?.site?.customDomain,
                    slug: estoque?.slug,
                }),

            }
            );

            if (response.ok) {
                setPago(true),
                    mutate(`/api/estoque?estoqueId=${estoqueId}`);
                router.push(
                    `https://${estoque?.site?.subdomain}.vercel.pub/${estoque?.slug}`
                );
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
            <Layout siteId={estoque?.site?.id}>
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
                        placeholder="Untitled estoque"
                        value={data.name}
                    />

                    <TextareaAutosize
                        name="validade"
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                validade: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled estoque"
                        value={data.validade}
                    />


                    <TextareaAutosize
                        name="minimo"
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                minimo: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled estoque"
                        value={data.minimo}
                    />

                    {/* <TextareaAutosize
                        name="valorTotal"
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                valorTotal: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled estoque"
                        value={data.valorTotal}
                    /> */}

                    <TextareaAutosize
                        name="valor"
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                valor: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled estoque"
                        value={data.valor}
                    />

                    <TextareaAutosize
                        name="unidade"
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                unidade: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled estoque"
                        value={data.unidade}
                    />

                    <TextareaAutosize
                        id="dataDaCompra"
                        name="dataDaCompra"
                        onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setData({
                                ...data,
                                dataDaCompra: (e.target as HTMLTextAreaElement).value,
                            })
                        }
                        className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
                        placeholder="Untitled estoque"
                        value={data.dataDaCompra}
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
                                <p>{"Iba"}</p>
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

                    </div>
                </footer>
            </Layout>
        </>
    );
}
