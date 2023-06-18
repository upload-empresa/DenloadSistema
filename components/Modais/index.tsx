import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";
// import { Modal, Button, Input } from "react-daisyui";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Input,
    Stack,
    useToast,
    HStack,
    FormControl,
    FormLabel
} from '@chakra-ui/react'

import { UseTranslation, useTranslation } from "next-i18next";
import type { ApiResponse } from "@/types/base";
import { Anamnese, Despesa } from "@prisma/client";
import useAnamneses from "hooks/useAnamneses";
import { useRouter } from "next/router";
import { TitleCards } from "../Title"
import { Forms } from "../Forms";
import { ButtonAdd, ButtonSave } from "../Buttons"

interface ModalAddAnamnesesProps {
    isOpenModal: any
    onCloseModal: any
    onOpenModal: any

}

const ModalAddAnamneses = ({
    visible,
    setVisible,
}: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}, { isOpenModal, onCloseModal, onOpenModal }: ModalAddAnamnesesProps) => {
    const { mutateAnamneses } = useAnamneses();
    const { t } = useTranslation("common");
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']

    const router = useRouter();
    const { id: pacienteId } = router.query;

    const { isOpen, onOpen, onClose } = useDisclosure()

    const formik = useFormik({
        initialValues: {
            pergunta: "",
            resposta: "",

        },
        validationSchema: Yup.object().shape({
            pergunta: Yup.string().required(),
            resposta: Yup.string().required(),

        }),
        onSubmit: async (values) => {
            const { pergunta } = values;
            const { resposta } = values;


            const response = await axios.post<ApiResponse<Despesa>>(`/api/anamnese?pacienteId=${pacienteId}`, {
                pergunta,
                resposta,

            });

            if (response) {
                {

                    toast({
                        title: `Anamnese criada com sucesso!`,
                        status: 'success',
                        isClosable: true,
                    })

                }
                return;
            }

            mutateAnamneses();
            formik.resetForm();
            setVisible(false);

        }

    })

    return (
        <>

            <Stack>
                <Button onClick={onOpen} bg={"#0BB7AF"} color={"white"} size={"sm"} _hover={{ bg: "#06857f" }} >
                    Adicionar nova pergunta
                </Button>
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    size={"xl"}
                >
                    <ModalOverlay />

                    <form onSubmit={formik.handleSubmit} method="POST">

                        <ModalContent>
                            <Stack
                                spacing={3}
                            >
                                <ModalHeader>
                                    <TitleCards title={"Adicionar nova pergunta"} />
                                </ModalHeader>

                                <ModalCloseButton />
                                <ModalBody>
                                    <Forms
                                        name="pergunta"
                                        onChange={formik.handleChange}
                                        value={formik.values.pergunta}
                                        w="80%" label={"Nova pergunta"} type={"text"} placeholder={"Digite aqui a sua nova pergunta"} />

                                    <Forms
                                        name="resposta"
                                        onChange={formik.handleChange}
                                        value={formik.values.resposta}
                                        w="80%" label={"Nova resposta"} type={"text"} placeholder={"Digite aqui a sua nova resposta"} />


                                </ModalBody>
                                <ModalFooter>
                                    <ButtonSave type="submit" align="end" />


                                </ModalFooter>
                            </Stack>
                        </ModalContent>
                    </form>

                </Modal>
            </Stack>

        </>
    )
}

export default ModalAddAnamneses

interface ModalAdminProps {
    isOpenModal: any
    onCloseModal: any
    onOpenModal: any
    name1: any
    ref1: any
    type1: any
    name2: any
    ref2: any
    type2: any
    onSubmit?: any

}

export function ModalAdmin({ isOpenModal, onCloseModal, onOpenModal, name1, ref1, type1, name2, ref2, type2, onSubmit }: ModalAdminProps) {
    return (
        <Stack>
            <Modal isOpen={isOpenModal} size={"xl"} onClose={onCloseModal}>
                <form
                    onSubmit={onSubmit}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <Stack
                            spacing={3}
                        >
                            <ModalHeader>
                                <TitleCards title={"Adicione um novo administrador"} text={""} />
                            </ModalHeader>
                            <ModalBody>
                                <Stack
                                    spacing={4}
                                >

                                    <FormControl w="80%">
                                        <FormLabel color={"#828282"} fontSize={"14px"}>{"Nome"}</FormLabel>
                                        <Input type="text" ref={ref1} name="name" placeholder={"Digite aqui o seu nome"} _placeholder={{ color: "#A1A1A1", fontSize: "14px" }} required />
                                    </FormControl>

                                    <FormControl w="80%">
                                        <FormLabel color={"#828282"} fontSize={"14px"}>{"Cargo"}</FormLabel>
                                        <Input type="text" ref={ref2} name="description" placeholder={"Digite aqui o seu cargo"} _placeholder={{ color: "#A1A1A1", fontSize: "14px" }} required />
                                    </FormControl>


                                </Stack>
                            </ModalBody>
                            <ModalFooter>
                                <HStack
                                    spacing={4}
                                >
                                    <Button colorScheme='red' onClick={onCloseModal}>
                                        Cancelar
                                    </Button>
                                    <Button colorScheme='teal' type="submit" >
                                        Salvar
                                    </Button>
                                </HStack>
                            </ModalFooter>
                        </Stack>
                    </ModalContent>
                </form>
            </Modal>
        </Stack >
    )
}