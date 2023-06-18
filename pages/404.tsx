import { Button, Heading, Stack, Text } from "@chakra-ui/react"
import { Links } from "../components/Links"

export default function Error() {
    return(
        <Stack
            bg="#B7DFFF"
            h="100vh"
            align="center"
        >
            <Text
                as="p"
                fontSize={"32px"}
                lineHeight={"48px"}
            >
                Esta página não foi encontrada
            </Text>
            <Heading
                color="#E9F5FE"
                fontSize={"400px"}
            >
                404
            </Heading>
            <Links href={"/login"} >
                <Button
                    as='button'
                    colorScheme="blue"
                    borderRadius="24px"
                    size="md"
                >
                    Voltar para a página inicial
                </Button>
            </Links>
        </Stack>
    )
}