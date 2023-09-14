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
import type { Meta, WithChildren } from "@/types"
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi'
import { MdHome, MdEvent, MdGroup, MdAssignment, MdAccountBalanceWallet, MdEditCalendar, MdQuestionAnswer, MdPerson, MdOutlineLogout, MdMenu, MdClose } from 'react-icons/md'
import { IconType } from 'react-icons'
import { FigureImage } from '../FigureImage'
import { AnyCnameRecord } from 'dns'
import React from 'react'

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Button,
    PopoverAnchor,
} from '@chakra-ui/react'

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
    onOpen: () => void
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Dashboard', icon: MdHome, href: 'iba1' },
    { name: 'Agenda', icon: MdEvent, href: 'iba2' },
    { name: 'Pacientes', icon: MdGroup, href: 'iba3' },
    { name: 'Estoque', icon: MdAssignment, href: 'iba' },
    { name: 'Financeiro', icon: MdAccountBalanceWallet, href: 'iba' },
    { name: 'Dia', icon: MdEditCalendar, href: 'iba' },
    { name: 'Feedback', icon: MdQuestionAnswer, href: 'iba' },
]

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
}


const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('#01233C', 'gray.900')}
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

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Logo
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                >
                                    <AvatarBadge boxSize='1.25em' bg='green.500' />



                                </Avatar>


                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">Justina Clark</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Admin
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem>Perfil</MenuItem>
                            <MenuDivider />
                            <MenuItem>Sair</MenuItem>
                            <Popover
                                // initialFocusRef={initialFocusRef}
                                placement='bottom'
                                closeOnBlur={false}
                            >
                                <PopoverTrigger>
                                    <Button backgroundColor="white">Tutorial</Button>
                                </PopoverTrigger>
                                <PopoverContent color='white' bg='#66686A' borderColor='#66686A'>
                                    <PopoverHeader pt={4} fontWeight='bold' border='0'>
                                        Veja seu perfil
                                    </PopoverHeader>
                                    <PopoverArrow bg='#66686A' />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore.
                                    </PopoverBody>
                                    <PopoverFooter
                                        border='0'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='space-between'
                                        pb={4}
                                    >
                                        <Box fontSize='sm'>Passo 2 de 4</Box>
                                        <ButtonGroup size='sm'>
                                            <Button colorScheme='gray'>Já sei usar</Button>
                                            <Button colorScheme='blue'>
                                                Próximo
                                            </Button>
                                        </ButtonGroup>
                                    </PopoverFooter>
                                </PopoverContent>
                            </Popover>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
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
            <MobileNav onOpen={onOpen} />
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