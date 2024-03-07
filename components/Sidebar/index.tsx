'use client'

import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    ButtonGroup,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    Heading,
    AvatarBadge
} from '@chakra-ui/react'
import { signOut } from 'next-auth/react';
import type { Meta, WithChildren } from "@/types"
import {
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi'
import { MdHome, MdEvent, MdGroup, MdAssignment, MdAccountBalanceWallet, MdEditCalendar, MdQuestionAnswer } from 'react-icons/md'
import { IconType } from 'react-icons'
import { FigureImage } from '../FigureImage'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useState } from 'react'
import useRequireAuth from "../../lib/useRequireAuth";
import Loader from '../app/Loader';

import { useRouter } from "next/router";

import {
    Button,
} from '@chakra-ui/react'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

import { useSession } from "next-auth/react";
import { fetcher } from "@/lib/fetcher";
import useSWR from 'swr';


interface LinkItemProps {
    name: string
    icon: IconType
    href: any
}

interface NavItemProps extends FlexProps {
    icon: IconType
    href: any
    children: React.ReactNode
}

interface MobileProps extends FlexProps {
    onOpen1: () => void
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}






// const initialFocusRef = React.useRef()

interface SidebarProps extends WithChildren {
    meta?: Meta
    children?: React.ReactNode
    title?: any
    button?: React.ReactNode
    wi?: any
    path?: any
    altText?: any
    tamh?: any
    tamw?: any
    siteProps?: any
}






const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const router = useRouter();
    const session = useRequireAuth();
    const sessionEmail = session?.user.email;

    const [siteId, setSiteId] = useState<string | null>(null);
    const { id } = router.query;

    useEffect(() => {
        const fetchSiteId = async () => {
            try {
                const extractedSiteId = id;
                console.log(extractedSiteId);
                if (typeof extractedSiteId === 'string' || typeof extractedSiteId === 'number') {
                    setSiteId(extractedSiteId);
                    localStorage.setItem('siteId', extractedSiteId);
                } else {
                    console.error('Invalid siteId:', extractedSiteId);
                }
            } catch (error) {
                console.error('Error fetching site ID:', error);
            }
        };

        if (siteId === null) {
            const storedSiteId = localStorage.getItem('siteId');
            if (storedSiteId !== null) {
                setSiteId(storedSiteId);
            } else {
                fetchSiteId();
            }
        }
    }, [id]);

    useEffect(() => {
        if (siteId !== null) {
            //@ts-ignore
            localStorage.setItem('siteId', id);
        }
    }, [id]);

    // console.log(session?.user.email)
    console.log(siteId)



    const LinkItems: Array<LinkItemProps> = [
        { name: 'Dashboard', icon: MdHome, href: `/site/${siteId}/dashboard` },
        { name: 'Agenda', icon: MdEvent, href: "https://calendar.google.com/" },
        { name: 'Pacientes', icon: MdGroup, href: `/site/${siteId}/` },
        { name: 'Estoque', icon: MdAssignment, href: `/site/${siteId}/estoques` },
        { name: 'Financeiro', icon: MdAccountBalanceWallet, href: `/site/${siteId}/login-Finance` },
        { name: 'Dia', icon: MdEditCalendar, href: `/site/${siteId}/login-Finance` },
        { name: 'Feedback', icon: MdQuestionAnswer, href: `/site/${siteId}/feedback` },
    ]

    // console.log(LinkItems);
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('#2FAFCA', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <FigureImage w={"70%"} path={"/logodenload.png"} altText={"Logo do Denload"} tamH={2000} tamW={600} />
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} href={link.href}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    )
}

const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
    return (
        <Box
            as="a"
            href={href}
            color="white"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'white',
                    color: '#66686A',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: '#66686A',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    )
}

const MobileNav = ({ onOpen1, ...rest }: MobileProps) => {
    const session = useRequireAuth()
    const [step, setStep] = useState(1);
    const { isOpen, onOpen, onClose } = useDisclosure();
    if (!session) return <Loader />

    // const iconColor = useColorModeValue('white', 'gray.900');
    // const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const renderModalContent = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <ModalHeader fontWeight='bold'>Passo 1 de 4</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Passo 1: Aqui está a primeira etapa do tutorial.
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                <Button colorScheme='gray' onClick={onClose}>
                                    Fechar
                                </Button>
                                <Button colorScheme='blue' onClick={handleNextStep}>
                                    Próximo
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <ModalHeader fontWeight='bold'>Passo 2 de 4</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Passo 2: Agora, siga estas instruções.
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                <Button colorScheme='gray' onClick={onClose}>
                                    Fechar
                                </Button>
                                <Button colorScheme='blue' onClick={handleNextStep}>
                                    Próximo
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </div>
                );

            default:
                return (
                    <div>
                        <ModalHeader fontWeight='bold'>Passo {step} de 4</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Passo {step}: Conteúdo do passo atual.
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                <Button colorScheme='gray' onClick={onClose}>
                                    Fechar
                                </Button>
                                <Button colorScheme='blue' onClick={handleNextStep}>
                                    {step === 4 ? 'Concluir' : 'Próximo'}
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </div>
                );
        }
    };

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={('white')}
            borderBottomWidth="1px"
            borderBottomColor={('white')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen1}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                {/* Logo */}
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                {/* <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} /> */}
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={'/avatar'}
                                >
                                    <AvatarBadge boxSize='1.25em' bg='green.500' />

                                </Avatar>


                                {session.user && (
                                    <>
                                        <VStack
                                            display={{ base: 'none', md: 'flex' }}
                                            alignItems="flex-start"
                                            spacing="1px"
                                            ml="2">
                                            <Text fontSize="sm">{session.user.name}</Text>
                                            <Text fontSize="xs" color="gray.600">
                                                Admin
                                            </Text>
                                        </VStack>
                                        <Box display={{ base: 'none', md: 'flex' }}>
                                            <FiChevronDown />
                                        </Box>
                                    </>
                                )}

                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={('white')}
                            borderColor={('gray.700')}>
                            {/* <MenuItem>Perfil</MenuItem> */}
                            {/* <MenuDivider /> */}
                            <MenuItem onClick={() => signOut()}>Sair</MenuItem>

                            {/* <Button onClick={onOpen}>Open Modal</Button> */}

                            <Modal isOpen={isOpen} onClose={onClose} size="sm">
                                <ModalOverlay />
                                <ModalContent>
                                    {renderModalContent()}
                                </ModalContent>
                            </Modal>

                        </MenuList>
                    </Menu>
                </Flex>
            </HStack >
        </Flex >
    )
}

const SidebarWithHeader = ({ children, title, button, wi, path, altText, tamh, tamw }: SidebarProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen1={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                <HStack as="section" bg="#EDF1F2" pb={5} pt={10} spacing={0} px={7} align="start">
                    <Stack w={{ lg: "80vw", xxs: "90vw" }} spacing={6}>
                        <HStack
                            justify="space-between"
                            flexDir={{ md: "row", xxs: "column" }}
                            align={{ md: "none", xxs: "start" }}
                            spacing={0}
                        >
                            <HStack>
                                <FigureImage w={wi} path={path} altText={altText} tamH={tamh} tamW={tamw} />
                                <Heading as="h1" fontSize={{ xl: "28px", md: "24px", xxs: "20px" }} fontWeight={400}>
                                    {title}
                                </Heading>
                            </HStack>
                            {button}
                        </HStack>
                        <Stack>{children}</Stack>
                    </Stack>
                </HStack>
            </Box>
        </Box>
    )
}



export default SidebarWithHeader