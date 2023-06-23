import { useState } from 'react'
import { HStack, Stack, Text } from "@chakra-ui/react"

import { ButtonLogin } from "@/components/Buttons"
import { FormLogin } from "@/components/Forms"

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }
            //@ts-ignore
            setMessage('Seu email de redefinição de senha foi enviado!')
        } catch (error) {
            //@ts-ignore
            setError(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <HStack
                as="main"
                bgImage="url('/login.png')"
                justify={"end"}
            >
                <Stack
                    as="article"
                    spacing={8}
                    bg={"#fbfff2b5"}
                    borderTopLeftRadius={"full"}
                    borderBottomLeftRadius={"full"}
                    px={24}
                    py={72}
                    w="40%"
                >
                    <Stack
                        spacing={6}
                    >
                        <Text
                            as="p"
                            color="#172A3C"
                            fontSize={"16px"}
                            lineHeight={"17px"}
                        >
                            Digite seu email abaixo que te enviaremos as instruções para alterar sua senha
                        </Text>
                        <FormLogin placeholder={"Email"} type={email} onChange={(e: any) => setEmail(e.target.value)} />
                    </Stack>
                    <ButtonLogin text={"Enviar"} type="submit" />
                    {error && <p>{error}</p>}
                    {message && <p>{message}</p>}
                </Stack>

            </HStack>
        </form>
    )
}
