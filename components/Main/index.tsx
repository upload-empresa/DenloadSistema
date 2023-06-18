import { Stack } from "@chakra-ui/react"
import { ReactNode } from "react"

import { Navbar } from "../Navbar"
import { Sidebar } from "../Sidebar"

interface MainProps {
    children?: ReactNode
    title?: any
    button?: any
    w?: any
    path?: any
    altText?: any
    tamh?: any
    tamw?: any

}

export function Main({ children, title, button, w, path, altText, tamh, tamw }: MainProps) {
    return (
        <Stack
            as="main"
            spacing={0}
        >
            <Navbar />
            <Sidebar title={title} button={button} w={w} path={path} altText={altText} tamh={tamh} tamw={tamw}>
                {children}
            </Sidebar>
        </Stack>
    )
}