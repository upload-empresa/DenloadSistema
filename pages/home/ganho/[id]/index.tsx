import { Forms } from "@/components/Forms"
import { FinanceiroEdit } from "@/components/Financeiro"

import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";

import Layout from "@/components/app/Layout";
import Loader from "@/components/app/Loader";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import Cookies from 'js-cookie'

import type { ChangeEvent } from "react";

import type { WithSiteGanho } from "@/types";
import useRequireAuth from "@/lib/useRequireAuth";

interface GanhoData {
    name: string;
    valor: string;
    recebimento: string;
    pago: any;
}



export default function AddFinanceiroGanho() {
    const router = useRouter()
    const session = useRequireAuth()
    const sessionEmail = session?.user.email;

    const [siteId, setSiteId] = useState(null);

    const fetchSiteId = async () => {
        try {
            const response = await fetch(`/api/getSiteFromUserId?sessionEmail=${sessionEmail}`);
            const data = await response.json();

            // Assuming that data contains a property like 'siteId'
            const extractedSiteId = data.siteId;

            if (typeof extractedSiteId === 'string' || typeof extractedSiteId === 'number') {
                //@ts-ignore
                setSiteId(extractedSiteId);
            } else {
                console.error('Invalid siteId:', extractedSiteId);
            }
        } catch (error) {
            console.error('Error fetching site ID:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchSiteId();
        };

        fetchData();
    }, [session]);

    const { id: ganhoId } = router.query;

    const { data: ganho, isValidating } = useSWR<WithSiteGanho>(
        router.isReady && `/api/ganho?ganhoId=${ganhoId}`,
        fetcher,
        {
            dedupingInterval: 1000,
            revalidateOnFocus: false,
        }
    );

    const [savedState, setSavedState] = useState(
        ganho
            ? `Last saved at ${Intl.DateTimeFormat("en", { month: "short" }).format(
                new Date(ganho.updatedAt)
            )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
                new Date(ganho.updatedAt)
            )} ${Intl.DateTimeFormat("en", {
                hour: "numeric",
                minute: "numeric",
            }).format(new Date(ganho.updatedAt))}`
            : "Saving changes..."
    );

    const [data, setData] = useState<GanhoData>({
        name: "",
        valor: "",
        pago: false,
        recebimento: ""
    });

    useEffect(() => {
        if (ganho)
            setData({
                name: ganho.name ?? "",
                valor: ganho.valor ?? "",
                pago: ganho.pago ?? false,
                recebimento: ganho.recebimento ?? ""
            });
    }, [ganho]);

    const [debouncedData] = useDebounce(data, 1000);

    const saveChanges = useCallback(
        async (data: GanhoData) => {
            setSavedState("Saving changes...");

            try {
                const response = await fetch("/api/ganho", {
                    method: HttpMethod.PUT,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: ganhoId,
                        name: data.name,
                        valor: data.valor,
                        pago: data.pago,
                        recebimento: data.recebimento,
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
        [ganhoId]
    );

    useEffect(() => {
        if (debouncedData.name) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.valor) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.pago) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.recebimento) saveChanges(debouncedData);
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
            const response = await fetch(`/api/ganho`, {
                method: HttpMethod.PUT,
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    id: ganhoId,
                    name: data.name,
                    valor: data.valor,
                    pago: data.pago,
                    recebimento: data.recebimento,
                    published: true,
                    subdomain: ganho?.site?.subdomain,
                    customDomain: ganho?.site?.customDomain,
                    slug: ganho?.slug,
                }),

            }
            );

            if (response.ok) {
                setPago(true),
                    mutate(`/api/ganho?ganhoId=${ganhoId}`);
                router.push(`/site/${siteId}/ganhos`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPublishing(false);
            setPago(false)
            router.push(`/site/${siteId}/ganhos`);
        }
    }

    if (isValidating)
        return (
            <Layout>
                <Loader />
            </Layout>
        );
    return (
        <FinanceiroEdit title={"Adicionar novo Ganho"} text={"Adicione um novo Ganho"} titlePage={"Detalhes do Ganho"}
            onChange1={(e: ChangeEvent<HTMLTextAreaElement>) => setData({
                ...data,
                name: (e.target as HTMLTextAreaElement).value,
            })} value1={data.name}
            onChange2={(e: ChangeEvent<HTMLTextAreaElement>) => setData({
                ...data,
                recebimento: (e.target as HTMLTextAreaElement).value,
            })} value2={data.recebimento}
            onChange3={(e: ChangeEvent<HTMLTextAreaElement>) => setData({
                ...data,
                valor: (e.target as HTMLTextAreaElement).value,
            })} value3={data.valor}
            onClick={async () => {
                await publish();
            }} onInput1={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setData({
                    ...data,
                    pago: (e.target as HTMLTextAreaElement).value,
                })
            } defaultValue1={data.pago}        >


        </FinanceiroEdit>
    )
}

