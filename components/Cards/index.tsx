import { Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react"
import { ReactNode } from "react"
import { IconType } from "react-icons/lib"
import { FigureImage } from "../FigureImage"
import { Links } from "../Links"
import { TitleDashboardFinanceiro } from "../Title"

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
            px={14}
            py={10}
            w={w}
            spacing={spacing}
        >
            {children}
        </Stack>
    )
}

interface CardDiaProps {
    w: string
    path: string
    altText: string
    tamh: number
    tamw: number
    title: string
    text: any
}

export function CardDia({ w, path, altText, tamh, tamw, title, text }: CardDiaProps) {
    return (
        <HStack
            spacing={3}
            bg="white"
            borderRadius="18px"
            py={3}
            px={5}
            w="25%"
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
                fontSize={"12px"}
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
                    bg: "#2FACFA",
                    color: "white"
                }}
            >
                <Icon
                    as={icon}
                    fontSize={"24px"}
                    color={"#7E7E7E"}
                    _hover={{
                        color: "white"
                    }}

                />
                <Text
                    as="p"
                    color={"#7E7E7E"}
                    size={"12px"}
                    _hover={{
                        color: "white"
                    }}

                >
                    {text}
                </Text>
            </Stack>
        </Links>
    )
}

interface CardDashboardHorariosProps {
    nome: string
    procedimento: string
    horario: string
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
    nome: string
    procedimento: string
    horario: string
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
                        {horario}
                    </Text>
                </Stack>
            </HStack>
        </Stack>
    )
}

