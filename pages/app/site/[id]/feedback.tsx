import { Stack, Textarea } from "@chakra-ui/react"

import { Main } from "@/components/Main"
import { ButtonSave } from "@/components/Buttons"
import { CardMain } from "@/components/Cards"
import { TitleCards, TitleFeedback } from "@/components/Title"
import { useState } from 'react'
import { HStack, Text } from "@chakra-ui/react"

export default function Feedback() {
    const [feedback, setFeedback] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        try {
            const response = await fetch('/api/feedbackemail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback }),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }
            //@ts-ignore
            setMessage('Seu feedback foi enviado!')
        } catch (error) {
            //@ts-ignore
            setError(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <Main title={"Feedback"} w={"25%"} path={"/perfil.png"} altText={"Ícone do Denload"} tamh={51} tamw={56}>
                <CardMain radius={"18px"} spacing={5}>
                    <TitleCards title={"Adicionar Feedback"} />
                    <Stack>
                        <TitleFeedback title={"Qual sua nota para o Denload?"} />
                    </Stack>
                    <Stack>
                        <TitleFeedback title={"Feedback Adicional"} />
                        <Textarea placeholder='Deixe aqui sua sugestão para melhorar o Denload' typeof="feedback" onChange={(e) => setFeedback(e.target.value)} />
                    </Stack>
                    <Stack
                        align={"end"}
                        w="100%"
                    >
                        <ButtonSave align="end" type="submit" />
                    </Stack>
                </CardMain>
            </Main>
        </form>
    )
}