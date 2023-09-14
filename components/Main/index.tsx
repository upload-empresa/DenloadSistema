import { Stack } from "@chakra-ui/react"
import { ReactNode } from "react"
// import Navbar from "../teste"
import SidebarWithHeader from "../Sidebar"

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
            {/* <Navbar /> */}
            <SidebarWithHeader title={title} button={button} w={w} path={path} altText={altText} tamh={tamh} tamw={tamw} onClose={function (): void {
                throw new Error("Function not implemented.")
            }}>
                {children}
            </SidebarWithHeader>
        </Stack>
    )
}