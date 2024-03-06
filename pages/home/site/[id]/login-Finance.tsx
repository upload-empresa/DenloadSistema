import { useState } from 'react';
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
    const { siteId } = router.query;

    //SITEID ESTÁ VINDO COMO UNDEFINED

    // console.log(token2)

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

            router.push(`/site/1/financeiro` ) //AQUI ESTÁ O UNDEFINED -> Aqui está o problema, eu preciso arrumar o siteId correto.
            console.log("Passamo po")
        } catch (error) {
            //@ts-ignore
            setError(error.message);
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
                            type={password}
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
