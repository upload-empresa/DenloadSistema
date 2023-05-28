import { Stack, Heading, HStack } from "@chakra-ui/react"
import { ReactNode } from "react"
import { MdGroup, MdHome, MdMedication, MdOutlinePayments } from 'react-icons/md'

import { FigureImage } from "../FigureImage"
import { SideSection } from "./sidesection"

interface SidebarProps {
    children: ReactNode
    title: string
    button?: any
    w: string
    path: string
    altText: string
    tamh: number
    tamw: number

}

export function Sidebar({ children, title, button, w, path, altText, tamh, tamw }: SidebarProps) {
    return (
        <HStack
            align={"flex-start"}
            spacing={0}
            w="100vw"
        >
            <Stack w="17vw" h="100vh" py={12} bg="white" spacing={8} pr={0}>
                <Stack>
                    <SideSection href="/dashboard" text="Dashboard" icone={MdHome} />
                    <SideSection href="/pacientes" text="Pacientes" icone={MdGroup} />
                    <SideSection href="/financeiro" text="Fluxo de Caixa" icone={MdOutlinePayments} />
                    <SideSection href="/estoque" text="Estoque" icone={undefined} />
                    <SideSection href="/procedimentos" text="Procedimentos" icone={MdMedication} />
                    <SideSection href="/feedback" text="Feedback" icone={undefined} />
                </Stack>
            </Stack>
            <HStack
                as="section"
                w={"81vw"}
                bg={"#EDF1F2"}
                py={5}
                spacing={0}
                px={7}
            >
                <Stack
                    w={"100vw"}
                    spacing={6}
                >
                    <HStack
                        justify={"space-between"}
                    >
                        <HStack>
                            <FigureImage w={w} path={path} altText={altText} tamH={tamh} tamW={tamw} />
                            <Heading
                                as="h1"
                                fontSize={"28px"}
                                fontWeight={400}
                            >
                                {title}
                            </Heading>
                        </HStack>
                        {button}
                    </HStack>
                    <Stack>
                        {children}
                    </Stack>
                </Stack>
            </HStack>
        </HStack>
    )
}