import { HStack, IconButton, Icon, Text } from "@chakra-ui/react"

import { Links } from "../Links"

interface SideSectionProps {
    text: string
    href: string
    icone: any
}


export function SideSection({ text, href, icone }: SideSectionProps) {
    return (
        <Links href={href}>
            <HStack
                pl={4}
                py="3"
                w="100%"
                bg="white"
                spacing={0}
                cursor="pointer"
                _hover={{
                    bg:"#efeaea"
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
                    color="#7C7C7C"
                    _hover={{ color: "#1C85B1" }}
                    cursor="pointer"
                    zIndex={2}

                >
                </IconButton>
                <Text color="#7C7C7C" w="70%" cursor="pointer" fontSize="16px" fontWeight="medium">{text}</Text>
            </HStack>
        </Links>
    )
}