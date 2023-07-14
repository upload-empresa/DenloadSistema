import { Button, Heading, HStack, Icon, Stack, Text, VStack } from "@chakra-ui/react"
import { ReactNode } from "react"
import { IconType } from "react-icons/lib"
import { FigureImage } from "../FigureImage"
import { Links } from "../Links"
import { TitleDashboardFinanceiro } from "../Title"
import { MdOutlineInsertDriveFile, MdEditNote, MdOutlineImage, MdClear } from "react-icons/md"
import cn from "clsx";
import Image from "next/image";
import { useState } from "react";

import type { ComponentProps } from "react";
import type { WithClassName } from "@/types";

interface BlurImageProps extends WithClassName, ComponentProps<typeof Image> {
    alt: string;

}

interface CardMainProps {
    children: ReactNode
    w?: any
    radius: string
    spacing?: number
}

interface CardFinanceiroDashProps {
    title: string
    color: string
}

interface CardPacientesProps {
    text: any
    bgOne: string
    color: string
}

interface CardMainPlusProps {
    children: ReactNode
}

interface CardIconPacientesProps {
    icon: IconType
    text: string
    href: string
}

export function CardMain({ children, w, radius, spacing }: CardMainProps) {
    return (
        <Stack
            as="section"
            bg="white"
            borderRadius={radius}
            px={{ md: 14, xxs: 7 }}
            py={{ md: 10, xxs: 5 }}
            w={w}
            spacing={spacing}
        >
            {children}
        </Stack>
    )
}

interface CardDiaProps {
    w: any
    path: string
    altText: string
    tamh: number
    tamw: number
    title: string
    text: any
    widthCard?: any
    mt?: any
}

export function CardDia({ w, path, altText, tamh, tamw, title, text, widthCard = "25%", mt }: CardDiaProps) {
    return (
        <HStack
            spacing={3}
            bg="white"
            borderRadius="18px"
            mt={mt}
            py={3}
            px={5}
            w={widthCard}
        >
            <FigureImage w={w} path={path} altText={altText} tamH={tamh} tamW={tamw} />
            <Stack
                spacing={2}
            >
                <Heading
                    color="#474749"
                    fontSize="16px"
                    fontWeight={700}
                >
                    {title}
                </Heading>
                <Text
                    color="#7C7C7C"
                    fontSize="14px"
                    fontWeight={500}
                >
                    R$ {text},00
                </Text>
            </Stack>
        </HStack>
    )
}

export function CardMainPlus({ children }: CardMainPlusProps) {
    return (
        <Stack
            as="section"
            borderTopLeftRadius={"20px"}
            borderBottomLeftRadius={"20px"}
            bg={"#F5F5F5"}
            pl={3}
            py={8}
        >
            {children}
        </Stack>
    )
}

export function CardMainFinanceiro() {
    return (
        <HStack
            justify={"space-between"}
        >
            <Stack
                spacing={1}
            >
                <Text
                    as="p"
                    fontSize={"14px"}
                >
                    Jorge Castro
                </Text>
                <Text
                    as="p"
                    fontSize={"12px"}
                >
                    Cárie
                </Text>
            </Stack>
            <Stack
                bg={"#0BB7AF26"}
                px={2}
                py={1}
                borderRadius={"8px"}

            >
                <Text
                    as="p"
                    color={"#0BB7AF"}
                >
                    R$ 100,00
                </Text>
            </Stack>
        </HStack>
    )
}

export function CardFinanceiroDash({ title, color }: CardFinanceiroDashProps) {
    return (
        <HStack
            w={"50%"}
        >
            <Stack>
                <HStack>
                    <Heading
                        as="h3"
                        color={color}
                        fontSize={"16px"}
                        fontWeight={500}
                    >
                        {title}
                    </Heading>
                    <HStack>
                        <Links href={""} >
                            <Text
                                as="p"
                                color={"#2facfa"}
                            >
                                Ver todas
                            </Text>
                            <FigureImage w={"100%"} path={"/right.png"} altText={"Seta indicando uma nova página"} tamH={16} tamW={17} />
                        </Links>
                    </HStack>
                </HStack>
                <Stack>
                    <CardMainFinanceiro />
                    <CardMainFinanceiro />
                    <CardMainFinanceiro />
                    <CardMainFinanceiro />
                </Stack>
            </Stack>
        </HStack>
    )
}

export function CardPacientes({ text, bgOne, color }: CardPacientesProps) {
    return (
        <Stack
            py={1}
            px={3}
            bg={bgOne}
            align={"center"}
            borderRadius={"8px"}

        >
            <Text
                color={color}
                fontSize={{ '2xl': "16px", xl: "14px", lg: "12px" }}
            >
                {text}
            </Text>

        </Stack>
    )
}

export function CardIconPacientes({ icon, text, href }: CardIconPacientesProps) {
    return (
        <Links href={href}>
            <Stack
                align={"center"}
                borderTopLeftRadius={"12px"}
                borderBottomLeftRadius={"12px"}
                px={3}
                py={2}
                _hover={{
                    bg: "#e1e1e1",
                }}
            >
                <Icon
                    as={icon}
                    fontSize={{ '2xl': "32px", lg: "24px", md: "20px", xxs: "20px" }}
                    color={"#7E7E7E"}


                />
                <Text
                    as="p"
                    color={"#7E7E7E"}
                    size={{ '2xl': "20px", lg: "12px", md: "12px" }}
                    fontSize={{ xxs: "14px" }}
                    textAlign={"center"}


                >
                    {text}
                </Text>
            </Stack>
        </Links>
    )
}

interface CardDashboardHorariosProps {
    nome: any
    procedimento: any
    horario: any
}

export function CardDashboardHorarios({ nome, procedimento, horario }: CardDashboardHorariosProps) {
    return (
        <HStack
            justify={"space-between"}
            bg="white"
            py={4}
            px={6}
            borderRadius="18px"
        >
            <Stack>
                <Heading
                    color={"#474749"}
                    fontSize={"14px"}
                    fontWeight={700}
                >
                    {nome}
                </Heading>
                <Heading
                    color={"#7C7C7C"}
                    fontSize="12px"
                    fontWeight={500}
                >
                    {procedimento}
                </Heading>
            </Stack>
            <Stack
                bgColor={"#2FACFA26"}
                py={1}
                px={5}
                borderRadius="8px"
            >
                <Text
                    color={"#181818"}
                    fontSize={"12px"}
                    fontWeight={500}
                >
                    {horario}
                </Text>
            </Stack>
        </HStack>

    )
}

interface CardDashboardFinanceiroProps {
    nome: any
    procedimento: any
    horario: any
    title: string
    color: string
    w?: string
}

export function CardDashboardFinanceiro({ nome, procedimento, horario, title, color, w }: CardDashboardFinanceiroProps) {
    return (
        <Stack
            w={w}
        >
            <TitleDashboardFinanceiro title={title} color={color} />
            <HStack
                w="100%"
                justify={"space-between"}
            >
                <Stack>
                    <Heading
                        color={"#474749"}
                        fontSize={"14px"}
                        fontWeight={700}
                    >
                        {nome}
                    </Heading>
                    <Heading
                        color={"#7C7C7C"}
                        fontSize="12px"
                        fontWeight={400}
                    >
                        {procedimento}
                    </Heading>
                </Stack>
                <Stack
                    bgColor={"#2FACFA26"}
                    py={1}
                    px={5}
                    borderRadius="8px"
                >
                    <Text
                        color={"#181818"}
                        fontSize={"12px"}
                        fontWeight={500}
                    >
                        R${horario},00
                    </Text>
                </Stack>
            </HStack>
        </Stack>
    )
}

interface CardsDocumentosProps {
    icon: IconType
    text: string
    onClick?: any
}

export function CardsDocumentos(props: BlurImageProps, { onClick }: CardsDocumentosProps) {
    const [isLoading, setLoading] = useState(true);
    return (
        <Stack
            position={"relative"}
            spacing={0}

        >
            <HStack
                bg={"#2FACFA"}
                px={5}
                py={4}
                borderRadius={"8px"}
            >
                {/* <Icon
                    as={icon}
                    color={"white"}
                    fontSize={"20px"}
                /> */}
                {/* <Text
                    as={"p"}
                    color={"white"}
                    fontSize={"12px"}
                    fontWeight={"normal"}
                >
                    {text}
                </Text> */}
                <Image
                    {...props}
                    alt={props.alt}
                    className={cn(
                        props.className,
                        "duration-700 ease-in-out",
                        isLoading
                            ? "grayscale blur-2xl scale-110"
                            : "grayscale-0 blur-0 scale-100"
                    )}
                    onLoadingComplete={() => setLoading(false)}
                />
            </HStack>
            <button onClick={onClick}>
                <Button
                    as={"a"}
                    borderRadius={"50%"}
                    bg={"red"}
                    py={3}
                    px={0}
                    position={"absolute"}
                    width={"10px"}
                    height={"20px"}
                    top="-5%"
                    left="70%"
                    zIndex={2}

                >

                    <Icon
                        as={MdClear}
                        fontSize={"16px"}
                        color={"white"}
                    />

                </Button>
            </button>
        </Stack>
    )
}

interface CardAdminProps {
    title?: any
    text: any

}

export function CardAdmin({ text, }: CardAdminProps) {
    return (
        <Stack
            spacing={2}
            align={"center"}
        >

            <Button
                py={{ lg: 16, md: 12, xxs: 10 }}
                px={{ lg: 10, md: 6, xxs: 4 }}
                bg={"#2FACFA"}
                borderRadius={"18px"}

            >
                <FigureImage w={{ lg: "100%", md: "80%", xxs: "55%" }} path={"/pastadente.png"} altText={""} tamH={82} tamW={82} />
            </Button>
            <Text
                as="p"
                color={"#6D6D6E"}
                fontSize={{ lg: "24px", md: "20px", xxs: "18px" }}
            >
                {text}
            </Text>
        </Stack>


    )
}

interface CardAddProps {
    onClick?: any

}

export function CardAdminAdd({ onClick }: CardAddProps) {
    return (
        <Button
            fontWeight={"normal"}
            _hover={{
                bg: 'transparent'
            }}
            onClick={onClick}>
            <Stack
                spacing={2}
                align={"center"}
                justify={"center"}
            >

                <FigureImage align={"center"} w={{ lg: "100%", md: "65%", xxs: "55%" }} path={"/Add.png"} altText={""} tamH={120} tamW={120} />
                <Text
                    as="p"
                    color={"#6D6D6E"}
                    fontSize={{ lg: "24px", md: "20px", xxs: "18px" }}
                >
                    Adicionar Perfil
                </Text>
            </Stack>
        </Button>


    )
}