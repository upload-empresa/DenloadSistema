import { useEffect, useState } from 'react';
import { HStack, Stack, Text } from "@chakra-ui/react";
import { ButtonLogin } from "@/components/Buttons";
import { FormLogin } from "@/components/Forms";
import { useRouter } from 'next/router';
//@ts-ignore
export default function Password({ token }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const router = useRouter();
    
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

    //@ts-ignore
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/finance-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            console.log(response.ok); //true
            console.log(siteId); //Undefined

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            //@ts-ignore
            setMessage('Acesso liberado!');

            console.log(siteId)
            router.push(`/site/${siteId}/financeiro` )
        } catch (error) {
            //@ts-ignore
            setMessage('Senha incorreta!');
        }
    };

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
                    <Stack spacing={6}>
                        <Text
                            as="p"
                            color="#172A3C"
                            fontSize={"16px"}
                            lineHeight={"17px"}
                        >
                            Digite a senha do financeiro
                        </Text>
                        <FormLogin
                            placeholder={"Senha"}
                            type= "password"
                            onChange={(e: any) => setPassword(e.target.value)}
                        />
                    </Stack>
                    <ButtonLogin text={"Enviar"} type="submit" />
                    {error && <p>{error}</p>}
                    {message && <p>{message}</p>}
                </Stack>
            </HStack>
        </form>
    );
}
