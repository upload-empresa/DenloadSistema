import { Button, ButtonProps, HStack, IconButton, Stack } from "@chakra-ui/react"
import { MdAdd, MdEdit, MdRemove } from "react-icons/md"
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
                size='sm'
                icon={<MdRemove />}
                onClick={onClick}
            />
            <Link href={href}>
                <IconButton
                    colorScheme='blue'
                    aria-label='Call Segun'
                    size='sm'
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
                w={"15%"}
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
    href: string
}

export function ButtonAdd({ text, onClick, href }: ButtonAddProps) {
    return (
        <Links href={href} >
            <Button
                leftIcon={<MdAdd />}
                bg={"#0BB7AF"}
                color={"white"}
                size={"sm"}
                fontWeight={500}
                onClick={onClick}
            >
                {text}
            </Button>
        </Links>
    )
}

interface ButtonDeleteProps {
    onClick: any
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
    fontSize: string

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