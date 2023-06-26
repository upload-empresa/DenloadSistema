import { FinanceiroAttributes } from "@/components/Financeiro"

import useSWR, { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";

import Layout from "@/components/app/Layout";
import Loader from "@/components/app/Loader";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { ChangeEvent } from "react";

import type { WithSiteDespesa } from "@/types";
import { useToast } from "@chakra-ui/react";

interface DespesaData {
    name: string;
    valor: string;
    vencimento: string;
    dataDaCompra: string;
    empresa: string;
}

export default function AddFinanceiroDespesa() {
    const router = useRouter();
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']

    const { id: despesaId } = router.query;

    const { data: despesa, isValidating } = useSWR<WithSiteDespesa>(
        router.isReady && `/api/despesa?despesaId=${despesaId}`,
        fetcher,
        {
            dedupingInterval: 1000,
            revalidateOnFocus: false,
        }
    );

    const [savedState, setSavedState] = useState(
        despesa
            ? `Last saved at ${Intl.DateTimeFormat("en", { month: "short" }).format(
                new Date(despesa.updatedAt)
            )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
                new Date(despesa.updatedAt)
            )} ${Intl.DateTimeFormat("en", {
                hour: "numeric",
                minute: "numeric",
            }).format(new Date(despesa.updatedAt))}`
            : "Saving changes..."
    );

    const [data, setData] = useState<DespesaData>({
        name: "",
        valor: "",
        empresa: "",
        vencimento: "",
        dataDaCompra: ""
    });

    useEffect(() => {
        if (despesa)
            setData({
                name: despesa.name ?? "",
                empresa: despesa.empresa ?? "",
                valor: despesa.valor ?? "",
                vencimento: despesa.vencimento ?? "",
                dataDaCompra: despesa.dataDaCompra ?? ""
            });
    }, [despesa]);

    const [debouncedData] = useDebounce(data, 1000);

    const saveChanges = useCallback(
        async (data: DespesaData) => {
            setSavedState("Saving changes...");

            try {
                const response = await fetch("/api/despesa", {
                    method: HttpMethod.PUT,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: despesaId,
                        name: data.name,
                        valor: data.valor,
                        vencimento: data.vencimento,
                        dataDaCompra: data.dataDaCompra,
                        empresa: data.empresa
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
        [despesaId]
    );

    useEffect(() => {
        if (debouncedData.name) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.valor) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.vencimento) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);


    useEffect(() => {
        if (debouncedData.dataDaCompra) saveChanges(debouncedData);
    }, [debouncedData, saveChanges]);

    useEffect(() => {
        if (debouncedData.empresa) saveChanges(debouncedData);
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
            const response = await fetch(`/api/despesa`, {
                method: HttpMethod.PUT,
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    id: despesaId,
                    name: data.name,
                    valor: data.valor,
                    vencimento: data.vencimento,
                    dataDaCompra: data.dataDaCompra,
                    empresa: data.empresa,
                    published: true,
                    subdomain: despesa?.site?.subdomain,
                    customDomain: despesa?.site?.customDomain,
                    slug: despesa?.slug,
                }),

            }
            );

            if (response.ok) {
                setPago(true),
                    mutate(`/api/despesa?despesaId=${despesaId}`);

            }
        } catch (error) {
            console.error(error);
        } finally {
            setPublishing(false);
            setPago(false)
            toast({
                title: `Despesa criada com sucesso!`,
                status: 'success',
                isClosable: true,
            })
            router.back();
        }
    }

    if (isValidating)
        return (
            <Layout>
                <Loader />
            </Layout>
        );
    return (
        <FinanceiroAttributes title={"Adicionar nova Despesa"} text={"Adicione uma nova despesa"} titlePage={"Detalhes da Despesa"}
            onChange1={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setData({
                    ...data,
                    name: (e.target as HTMLTextAreaElement).value,
                })
            } value1={data.name}
            onChange2={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setData({
                    ...data,
                    vencimento: (e.target as HTMLTextAreaElement).value,
                })
            } value2={data.vencimento}
            onChange3={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setData({
                    ...data,
                    valor: (e.target as HTMLTextAreaElement).value,
                })
            } value3={data.valor}
            onChange4={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setData({
                    ...data,
                    dataDaCompra: (e.target as HTMLTextAreaElement).value,
                })
            } value4={data.dataDaCompra}
            onChange5={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setData({
                    ...data,
                    empresa: (e.target as HTMLTextAreaElement).value,
                })
            } value5={data.empresa}
            onClick={async () => {
                await publish();
            }}
        >

        </FinanceiroAttributes>
    )
}