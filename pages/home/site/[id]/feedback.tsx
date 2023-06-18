import { Stack, Textarea, useToast } from "@chakra-ui/react"

import { Main } from "@/components/Main"
import { ButtonSave } from "@/components/Buttons"
import { CardMain } from "@/components/Cards"
import { TitleCards, TitleFeedback } from "@/components/Title"
import { useState } from 'react'
import { HStack, Text } from "@chakra-ui/react"
import type { Site, Subscription } from "@prisma/client";
import { useRouter } from "next/router"
import useSWR from "swr";

import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import RatingStar from "@/components/RatingStar"

interface SiteFeedbackData {
    subscriptions: Array<Subscription>
    site: Site | null;
}

export default function Feedback() {

    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']
    const router = useRouter();
    const { id: siteId } = router.query;

    const [feedback, setFeedback] = useState('')
    const [nota, setNota] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const handleRatingChange = (value: any) => {
        setNota(value);
    };




    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        try {
            const response = await fetch('/api/feedbackemail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback, nota: Number(nota) }),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }
            //@ts-ignore
            setMessage('Seu feedback foi enviado!')
            setNota('')
            toast({
                title: `Feedback enviado com sucesso!`,
                status: 'success',
                isClosable: true,
            })
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
                        <RatingStar onChange={handleRatingChange} />
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
        </form >
    )
}