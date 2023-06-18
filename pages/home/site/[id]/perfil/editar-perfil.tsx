import { HStack, Stack, Heading, Text } from "@chakra-ui/react"
import { IoPersonOutline } from "react-icons/io5"
import { MdEdit } from "react-icons/md"

import { ButtonSave } from "@/components/Buttons"
import { CardMainPlus, CardIconPacientes, CardMain } from "@/components/Cards"
import { FigureImage } from "@/components/FigureImage"
import { Forms } from "@/components/Forms"
import { TitleCards } from "@/components/Title"
import { Main } from "@/components/Main"

export default function EditPerfil() {
    return (
        <Main title={"Perfil"} w={"65%"} path={"/perfil.png"} altText={"Ícone do Denload"} tamh={51} tamw={56}>
            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardMainPlus>
                    <CardIconPacientes icon={IoPersonOutline} text={"Perfil"} href={"/perfil"} />
                    <CardIconPacientes icon={MdEdit} text={"Editar Perfil"} href={"/perfil/editar-perfil"} />
                </CardMainPlus>
                <CardMain radius={"0 18px 18px 0"} w={"90%"} spacing={5}>
                    <TitleCards title={"Editar Perfil do Consultório"} text="Edite os dados do seu consultório" />
                    <HStack
                        align={"end"}
                    >
                        <FigureImage w={undefined} path={"/image 3 (2).png"} altText={"Imagem do Dentista"} tamH={90} tamW={90} />
                        <Stack
                            spacing={1}
                        >
                            <Heading
                                color={"#4F4F4F"}
                                fontSize={"20px"}
                                fontWeight={500}
                            >
                                Nome do Dentista
                            </Heading>
                            <Text
                                as="p"
                                color={"#77757F"}
                            >
                                teste@gmail.com
                            </Text>
                        </Stack>
                    </HStack>
                    <HStack
                        spacing={10}
                        align="start"
                    >
                        <Stack
                            w="50%"
                            spacing={4}
                        >
                            <Forms label={"Nome"} type={"text"} placeholder={"Digite o seu nome"} />
                            <Forms label={"Estado"} type={"text"} placeholder={"Digite o seu Estado"} />
                            <Forms label={"Nome da Clínica"} type={"text"} placeholder={"Digite o nome da clínica"} />
                            <Forms label={"Cidade"} type={"text"} placeholder={"Digite a sua cidade"} />
                            <Forms label={"E-mail"} type={"text"} placeholder={"Digite o seu e-mail"} />
                            <Forms label={"Celular"} type={"number"} placeholder={"Digite o seu número"} />
                        </Stack>
                        <Stack
                            w="50%"
                        >
                            <Heading
                                fontSize="16px"
                                color="#828282"
                                fontWeight={600}
                            >
                                Redefinir Senha
                            </Heading>
                            <Forms label={"Senha Atual"} type={"text"} placeholder={"Digite a sua senha atual"} />
                            <Forms label={"Nova Senha"} type={"text"} placeholder={"Digite a sua nova senha"} />
                            <Forms label={"Confirmar Nova Senha"} type={"number"} placeholder={"Digite a confirmação da sua nova senha"} />

                        </Stack>
                    </HStack>
                    <ButtonSave align="end" />
                </CardMain>
            </HStack>

        </Main>

    )
}