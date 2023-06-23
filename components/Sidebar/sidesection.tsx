import { HStack, IconButton, Icon, Text } from "@chakra-ui/react"

import { Links } from "../Links"

interface SideSectionProps {
    text: string
    href?: any
    icone: any
    onClick?: any
}


export function SideSection({ text, href, icone, onClick }: SideSectionProps) {
    return (
        <Links href={href}>
            <HStack
                pl={4}
                py={{ lg: "3", xxs: "2" }}
                w="100%"
                spacing={{ '2xl': 4, lg: 0 }}
                cursor="pointer"
                _hover={{
                    bg: "#041d30"
                }}
            >
                <IconButton
                    icon={<Icon justify="end" as={icone} />}
                    fontSize={{ '2xl': "32px", xl: "28px", lg: "24px", xxs: "22px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent={"start"}
                    variant="unstyled"
                    aria-label='Conta do usuário'
                    color="white"
                    cursor="pointer"
                    zIndex={2}
                    onClick={onClick}

                >
                </IconButton>
                <Text color="white" w="70%" cursor="pointer" fontSize={{ '2xl': "24px", xl: "20px", lg: "16px" }} fontWeight="medium">{text}</Text>
            </HStack>
        </Links>
    )
}

interface SideSectionLogoutProps {
    text: string
    icone: any
    onClick?: any
}

export function SideSectionLogout({ text, icone, onClick }: SideSectionLogoutProps) {
    return (
        <HStack
            pl={4}
            py={{ lg: "3", xxs: "2" }}
            w="100%"
            spacing={0}
            cursor="pointer"
            _hover={{
                bg: "#041d30"
            }}
        >
            <IconButton
                icon={<Icon justify="end" as={icone} />}
                fontSize="24px"
                display="flex"
                alignItems="center"
                justifyContent={"start"}
                variant="unstyled"
                aria-label='Conta do usuário'
                color="white"
                cursor="pointer"
                zIndex={2}
                onClick={onClick}

            >
            </IconButton>
            <Text onClick={onClick} color="white" w="70%" cursor="pointer" fontSize="16px" fontWeight="medium">{text}</Text>
        </HStack>
    )
}