import { Button, ButtonProps, HStack, IconButton, Stack } from "@chakra-ui/react"
import { MdAdd, MdEdit, MdDelete } from "react-icons/md"
import { Links } from "../Links"
import Link from "next/link"


interface ButtonsProps {
    onClick?: any
    onClick2?: any
    href?: any
}
export function ButtonPacientes({ onClick, onClick2, href }: ButtonsProps) {
    return (
        <HStack>
            <IconButton
                colorScheme='red'
                aria-label='Call Segun'
                size={{ '2xl': "md", lg: 'sm', xxs: "sm" }}
                fontSize={{ '2xl': "24px", xl: "18px", xxs: "16px" }}
                icon={<MdDelete />}
                onClick={onClick}
            />
            <Link href={href}>
                <IconButton
                    colorScheme='blue'
                    aria-label='Call Segun'
                    size={{ '2xl': "md", lg: 'sm', xxs: "sm" }}
                    fontSize={{ '2xl': "24px", xl: "18px", xxs: "16px" }}
                    icon={<MdEdit />}
                    onClick={onClick2}
                />
            </Link>
        </HStack>
    )
}

interface ButtonSaveProps {
    align?: string
    onClick?: any
    type?: any
}

export function ButtonSave({ align, onClick, type }: ButtonSaveProps) {
    return (
        <Stack
            align={align}
            w="100%"
        >

            <Button
                colorScheme={'teal'}
                w={{ '2xl': "8%", xl: "15%", lg: "15%", md: "25%", sm: "40%", xxs: "65%" }}
                size={"sm"}
                onClick={onClick}
                type={type}
            >
                Salvar
            </Button>
        </Stack>

    )
}



interface ButtonLoginProps {
    text: string
    type: any
}

export function ButtonLogin({ text, type }: ButtonLoginProps) {
    return (
        <Stack
            align={"end"}
            w="100%"
        >
            <Button
                w={"55%"}
                bg={"#2FACFA"}
                color={"white"}
                borderRadius={"full"}
                type={type}
            >
                {text}
            </Button>
        </Stack>
    )
}

interface ButtonAddProps {
    text: string
    onClick: any
    href?: string
    mt?: any
    creatingPaciente?: any
}

export function ButtonAdd({ text, href, onClick, mt, creatingPaciente }: ButtonAddProps) {
    return (
        <Button
            leftIcon={<MdAdd />}
            bg={"#0BB7AF"}
            color={"white"}
            mt={mt}
            size={{ '2xl': 'lg', lg: "sm", xxs: "sm" }}
            fontSize={{ '2xl': "20px" }}
            fontWeight={500}
            onClick={onClick}
            _hover={{
                bg: '#2C7A7B'
            }}
            isLoading={creatingPaciente}
        >
            {text}
        </Button>
    )
}



interface ButtonDeleteProps {
    onClick?: any
}
export function ButtonDelete({ onClick }: ButtonDeleteProps) {
    return (
        <Button
            colorScheme="red"
            borderRadius={"full"}
            size={"sm"}
            onClick={onClick}
        >
            Excluir
        </Button>
    )
}

interface ButtonPaginationProps {
    button: any
    fontSize: any

}

interface ButtonDeletePlus {
    onClick: any
}

export function ButtonDeletePlus({ onClick }: ButtonDeletePlus) {
    return (
        <Button
            colorScheme="red"
            size={"sm"}
            borderRadius={"full"}
            onClick={onClick}
        >
            X
        </Button>
    )
}

export function ButtonPagination({ button, fontSize }: ButtonPaginationProps) {
    return (
        <Button
            color="black"
            bg="#EEEEEE"
            fontSize={fontSize}
            fontWeight={500}
            _hover={{
                bgColor: "#2FACFA",
                color: "white"
            }}
        >
            {button}
        </Button>
    )
}