import { useState } from 'react'
import { IconButton, Drawer, DrawerOverlay, DrawerContent, Stack, Heading, HStack } from '@chakra-ui/react'
import { MdHome, MdEvent, MdGroup, MdAssignment, MdAccountBalanceWallet, MdEditCalendar, MdQuestionAnswer, MdPerson, MdOutlineLogout, MdMenu, MdClose } from 'react-icons/md'
import { signOut } from "next-auth/react";

import { FigureImage } from '../FigureImage'
import { SideSection, SideSectionLogout } from './sidesection'
import { useRouter } from 'next/router'
import useRequireAuth from "../../lib/useRequireAuth";
import Loader from '../app/Loader';
import type { Meta, WithChildren } from "@/types"
import Cookies from 'js-cookie';


interface SidebarProps extends WithChildren {
    meta?: Meta
    children: React.ReactNode
    title: string
    button?: React.ReactNode
    w: string
    path: string
    altText: string
    tamh: number
    tamw: number
}


export function Sidebar({ children, title, button, w, path, altText, tamh, tamw }: SidebarProps) {
    const siteId = Cookies.get('siteId');

    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();
    const sitePage = router.pathname.startsWith("/app/site/[id]");
    const postPage = router.pathname.startsWith("/app/post/[id]");
    const rootPage = !sitePage && !postPage;
    const tab = rootPage
        ? router.asPath.split("/")[1]
        : router.asPath.split("/")[3];


    const handleOpen = () => {
        setIsOpen(true)
    };

    const handleClose = () => {
        setIsOpen(false)
    };

    const session = useRequireAuth();
    if (!session) return <Loader />;

    return (
        <HStack align="strech" spacing={0}>
            <Stack w={{ lg: "17vw", xxs: "0" }} display={{ lg: "flex", xxs: "none" }} py={12} bg="#01233C" spacing={8} pr={0}>
                <Stack>
                    <SideSection href={`/site/${siteId}/dashboard`} text="Dashboard" icone={MdHome} />
                    <SideSection href={"https://calendar.google.com/"} text="Agenda" icone={MdEvent} />
                    <SideSection href={`/site/${siteId}/`} text="Pacientes" icone={MdGroup} />
                    <SideSection href={`/site/${siteId}/estoques`} text="Estoque" icone={MdAssignment} />
                    <SideSection href={`/site/${siteId}/financeiro`} text="Financeiro" icone={MdAccountBalanceWallet} />
                    <SideSection href={`/site/${siteId}/dia`} text="Dia" icone={MdEditCalendar} />
                    <SideSection href={`/site/${siteId}/feedback`} text="Feedback" icone={MdQuestionAnswer} />
                </Stack>
                <Stack display={{ lg: "flex", xxs: "none" }}>
                    <SideSection href={`/site/${siteId}/perfil`} text="Perfil" icone={MdPerson} />
                    <SideSectionLogout text="Logout" icone={MdOutlineLogout} onClick={() => signOut()} />

                </Stack>
            </Stack>
            <HStack as="section" w={{ lg: "83vw", xxs: "100vw" }} bg="#EDF1F2" pb={5} pt={10} spacing={0} px={7} align="start">
                <Stack w={{ lg: "80vw", xxs: "90vw" }} spacing={6}>
                    <HStack
                        justify="space-between"
                        flexDir={{ md: "row", xxs: "column" }}
                        align={{ md: "none", xxs: "start" }}
                        spacing={0}
                    >
                        <HStack>
                            <FigureImage w={w} path={path} altText={altText} tamH={tamh} tamW={tamw} />
                            <Heading as="h1" fontSize={{ xl: "28px", md: "24px", xxs: "20px" }} fontWeight={400}>
                                {title}
                            </Heading>
                        </HStack>
                        {button}
                    </HStack>
                    <Stack>{children}</Stack>
                </Stack>
            </HStack>
            <IconButton
                display={{ lg: "none", xxs: "flex" }}
                icon={isOpen ? <MdClose /> : <MdMenu />}
                aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
                onClick={isOpen ? handleClose : handleOpen}
                position="fixed"
                top={{ md: "20px", sm: "13px", xs: "10px", xxs: "7px" }}
                left="20px"
                zIndex={999}
                bg="transparent"
                color="white"
            />
            {isOpen && (
                <Drawer placement="left" size={{ xxs: "xs" }} onClose={handleClose} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent bg="#01233C" color="#FFF">
                        <IconButton
                            icon={<MdClose />}
                            aria-label="Close sidebar"
                            onClick={handleClose}
                            bg="transparent"
                            alignSelf="flex-end"
                        />
                        <Stack spacing={0}>
                            <SideSection href="/" text="Dashboard" icone={MdHome} />
                            <SideSection href="https://calendar.google.com/calendar/u/0/r" text="Agenda" icone={MdEvent} />
                            <SideSection href="/pacientes" text="Pacientes" icone={MdGroup} />
                            <SideSection href="/estoque" text="Estoque" icone={MdAssignment} />
                            <SideSection href="/financeiro" text="Financeiro" icone={MdAccountBalanceWallet} />
                            <SideSection href="/dia" text="Dia" icone={MdEditCalendar} />
                            <SideSection href="/feedback" text="Feedback" icone={MdQuestionAnswer} />
                        </Stack>
                        <Stack spacing={0}>
                            <SideSection href="/perfil" text="Perfil" icone={MdPerson} />
                            <SideSection href="/login" text="Logout" icone={MdOutlineLogout} />
                        </Stack>
                    </DrawerContent>
                </Drawer>
            )}
        </HStack>
    )
}

