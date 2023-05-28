import { useState, useEffect } from 'react';
import { HStack, Stack, Text } from "@chakra-ui/react";
import { ButtonLogin } from "@/components/Buttons";
import { FormLogin } from "@/components/Forms";

export default function ResetPassword({ token }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // useEffect(() => {
    //     if (!token) {
    //         setError('Token inválido.');
    //     }
    // }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, token }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            setMessage('Sua senha foi redefinida com sucesso.');
        } catch (error) {
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
                            Digite sua nova senha abaixo
                        </Text>
                        <FormLogin
                            placeholder={"Nova senha"}
                            type={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormLogin
                            placeholder={"Confirmar senha"}
                            type={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
