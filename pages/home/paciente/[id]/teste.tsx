import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import BlurImage from "@/components/BlurImage";
import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Foto, Site, Paciente } from "@prisma/client";

import { HStack, Stack } from "@chakra-ui/react"
import { IoPersonOutline } from "react-icons/io5"
import { MdOutlineInsertDriveFile, MdOutlineImageSearch } from "react-icons/md"

import { ButtonSave } from "@/components/Buttons"
import { CardMainPlus, CardIconPacientes, CardMain, CardsDocumentos } from "@/components/Cards"
import { Main } from "@/components/Main"
import { TitleCardsPacientes, TitleCards } from "@/components/Title"

interface SiteFotoData {
    fotos: Array<Foto>;
    paciente: Paciente | null;
}

export default function ImgPacientes() {
    const [creatingFoto, setCreatingFoto] = useState(false);

    const router = useRouter();
    const { id: pacienteId } = router.query;

    const { data } = useSWR<SiteFotoData>(
        pacienteId && `/api/foto?pacienteId=${pacienteId}&published=true`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.site && router.push("/"),
        // }
    );

    async function createFoto(pacienteId: string) {
        try {
            const res = await fetch(`/api/foto?pacienteId=${pacienteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/foto/${data.fotoId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Main title={"Detalhes do Paciente"} w={""} path={""} altText={""} tamh={0} tamw={0}>
            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardMainPlus>
                    <CardIconPacientes icon={IoPersonOutline} text={"Geral"} href={"#"} />
                    <CardIconPacientes icon={MdOutlineInsertDriveFile} text={"Ganhos"} href={"#"} />
                    <CardIconPacientes icon={MdOutlineImageSearch} text={"Despesas"} href={"#"} />
                </CardMainPlus>

                <CardMain radius={"0 18px 18px 0"} spacing={5} w={"90%"}>
                    {/* <TitleCardsPacientes>
                        <TitleCards title={"Adicionar as Imagens"} />

                    </TitleCardsPacientes> */}


                    {/* <CardsDocumentos alt={""} src={""} />
                        <CardsDocumentos alt={""} src={""} />
                        <CardsDocumentos alt={""} src={""} /> */}



                    <button
                        onClick={() => {
                            setCreatingFoto(true);
                            createFoto(pacienteId as string);
                        }}
                        className={`${creatingFoto
                            ? "cursor-not-allowed bg-gray-300 border-gray-300"
                            : "text-white bg-black hover:bg-white hover:text-black border-black"
                            } font-cal text-lg w-3/4 sm:w-40 tracking-wide border-2 px-5 py-3 transition-all ease-in-out duration-150`}
                    >
                        {creatingFoto ? (
                            <LoadingDots />
                        ) : (
                            <>
                                New Foto <span className="ml-2">＋</span>
                            </>
                        )}
                    </button>

                    <HStack
                        spacing={6}
                    >

                        {data ? (
                            data.fotos.length > 0 ? (
                                data.fotos.map((foto) => (
                                    <Link href={`/foto/${foto.id}`} key={foto.id}>


                                        {foto.url ? (
                                            <CardsDocumentos alt={foto.url ?? "Unknown Thumbnail"} src={foto.url} width={30} height={22} />
                                        ) : (
                                            ''
                                        )}


                                        {/* <h2 className="font-cal text-3xl">{foto.pergunta}</h2>
                                            <p className="text-base my-5 line-clamp-3">
                                                {foto.resposta}
                                            </p> */}



                                    </Link>
                                ))
                            ) : (
                                <>
                                    <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
                                        <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300" />
                                        <div className="relative p-10 grid gap-5">
                                            <div className="w-28 h-10 rounded-md bg-gray-300" />
                                            <div className="w-48 h-6 rounded-md bg-gray-300" />
                                            <div className="w-48 h-6 rounded-md bg-gray-300" />
                                            <div className="w-48 h-6 rounded-md bg-gray-300" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-cal text-gray-600">
                                            No fotos yet. Click &quot;New foto&quot; to create one.
                                        </p>
                                    </div>
                                </>
                            )
                        ) : (
                            [0, 1].map((i) => (
                                <div
                                    key={i}
                                    className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200"
                                >
                                    <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300 animate-pulse" />
                                    <div className="relative p-10 grid gap-5">
                                        <div className="w-28 h-10 rounded-md bg-gray-300 animate-pulse" />
                                        <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                                        <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                                        <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                                    </div>
                                </div>
                            ))
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

    );
}
