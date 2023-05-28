import { Button, FormControl, FormLabel, HStack, Input, Stack, useDisclosure } from "@chakra-ui/react"
import { IoPersonOutline } from "react-icons/io5"
import { MdOutlineInsertDriveFile, MdOutlineImageSearch } from "react-icons/md"

import { ButtonAdd, ButtonDelete, ButtonDeletePlus, ButtonSave } from "../../../../components/Buttons"
import { CardMainPlus, CardIconPacientes, CardMain } from "../../../../components/Cards"
import { Forms, Selects } from "../../../../components/Forms"
import { Main } from "../../../../components/Main"
import { TitleCards } from "../../../../components/Title"
import { ModalAddAnamneses } from "@/components/Modais"

import { useRouter } from "next/router";
import { useState, useRef } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";

import BlurImage from "@/components/BlurImage";
import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Anamnese, Site, Paciente } from "@prisma/client";

import type { WithPacienteAnamnese } from "@/types";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import React from "react"
import anamnese from "pages/api/anamnese"
interface SiteAnamneseData {
    anamneses: Array<Anamnese>;
    paciente: Paciente | null;
    pergunta: string;
    resposta: string;
}


export default function Anamneses() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [creatingAnamnese, setCreatingAnamnese] = useState(false);

    const router = useRouter();
    const { id: pacienteId } = router.query;

    const { data } = useSWR<SiteAnamneseData>(
        pacienteId && `/api/anamnese?pacienteId=${pacienteId}&published=true`,
        fetcher,
        // {
        //     onSuccess: (data) => !data?.paciente && router.push("/"),
        // }
    );

    async function createAnamnese(pacienteId: string) {
        try {
            const res = await fetch(`/api/anamnese?pacienteId=${pacienteId}`, {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                },

            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/anamnese/${data.anamneseId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <>

            <Main title={"Detalhes do Paciente"} w={""} path={""} altText={""} tamh={0} tamw={0}>
                <Button onClick={onOpen}>Open Modal</Button>

                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create your account</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>First name</FormLabel>
                                <Input placeholder='First name' />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Last name</FormLabel>
                                <Input placeholder='Last name' />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <HStack
                    spacing={0}
                    align={"stretch"}
                >
                    <CardMainPlus>
                        <CardIconPacientes icon={IoPersonOutline} text={"Dados"} href={"/pacientes/dados-do-paciente"} />
                        <CardIconPacientes icon={MdOutlineInsertDriveFile} text={"Documentos"} href={"/pacientes/documentos-do-paciente"} />
                        <CardIconPacientes icon={MdOutlineImageSearch} text={"Imagens"} href={"/pacientes/imagens-do-paciente"} />
                        <CardIconPacientes icon={MdOutlineImageSearch} text={"Anamneses"} href={"/pacientes/anamneses"} />
                        <CardIconPacientes icon={MdOutlineImageSearch} text={"Anotações"} href={"#"} />
                    </CardMainPlus>
                    <CardMain radius={"0 18px 18px 0"} spacing={5} w={"90%"}>
                        <HStack
                            justify={"space-between"}
                        >
                            <TitleCards title={"Anameses do Consultório"} />
                            <HStack>
                                <ButtonDelete />

                                <button
                                    onClick={() => {
                                        setCreatingAnamnese(true)
                                        createAnamnese(pacienteId as string)
                                    }}
                                    className={`${creatingAnamnese
                                        ? "cursor-not-allowed bg-gray-300 border-gray-300"
                                        : "text-white bg-black hover:bg-white hover:text-black border-black"} font-cal text-lg w-3/4 sm:w-40 tracking-wide border-2 px-5 py-3 transition-all ease-in-out duration-150`}
                                >
                                    {creatingAnamnese ? (
                                        <LoadingDots />
                                    ) : (
                                        <>
                                            New Anamnese <span className="ml-2">＋</span>
                                        </>
                                    )}
                                </button>

                            </HStack>
                        </HStack>
                        <Stack
                            spacing={10}
                        >
                            <Stack
                                align="stretch"
                            >


                            </Stack>
                            {data ? (
                                data.anamneses.length > 0 ? (
                                    data.anamneses.map((anamnese) => (
                                        <><Forms label={anamnese.pergunta} w={"99%"} type={"text"} placeholder={"Digite o nome do medicamento"} value={anamnese.pergunta} />


                                        </>
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
                                                No anamneses yet. Click &quot;New anamnese&quot; to create one.
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
                        </Stack>
                        <Stack
                            align={"end"}
                            w="100%"
                        >
                            <ButtonSave align="end" />
                        </Stack>
                    </CardMain>
                </HStack>

            </Main></>
    )
}