import { HStack } from "@chakra-ui/react"

import { Main } from "../Main"
import { ButtonSave } from "../Buttons"
import { CardMain } from "../Cards"
import { Forms, FormsValue } from "../Forms"
import { TitleCards } from "../Title"

interface EstoqueAttributesProps {
    title: string
    text: string
    name1?: any
    name2?: any
    name3?: any
    name4?: any
    name5?: any
    name6?: any
    name7?: any
    name8?: any
    onChange1?: any
    onChange2?: any
    onChange3?: any
    onChange4?: any
    onChange5?: any
    onChange6?: any
    onChange7?: any
    onChange8?: any
    value1?: any
    value2?: any
    value3?: any
    value4?: any
    value5?: any
    value6?: any
    value7?: any
    value8?: any
    onClick?: any
}

export function EstoqueAttributes({ title, text, name1, name2, name3, name4, name5, name6, name7, name8, onChange1, onChange2, onChange3, onChange5, onChange4, onChange6, onChange7, onChange8, value1, value2, value3, value4, value5, value6, value7, value8, onClick }: EstoqueAttributesProps) {
    return (
        <Main title={"Estoque"} w={"25%"} path={"/perfil.png"} altText={"Ícone do Denload"} tamh={51} tamw={56}>
            <CardMain radius={"18px"} spacing={5}>
                <TitleCards title={title} />
                <HStack spacing={{ md: 6, xxs: 0 }} flexDir={{ md: "row", xxs: "column" }}>
                    <Forms label={"Nome"} type={"text"} placeholder={"Digite o nome do produto"} name={name1} onChange={onChange1} value={value1} mb={{ md: "0", xxs: "10%" }} />

                    <Forms label={"Unidade"} type={"text"} placeholder={"Digite a unidade do produto. Ex: un, mL"} name={name2} onChange={onChange2} value={value2} mb={{ md: "0", xxs: "10%" }} />
                </HStack>
                <HStack spacing={{ md: 6, xxs: 0 }} flexDir={{ md: "row", xxs: "column" }}>
                    <Forms label={"Validade"} type={"date"} placeholder={"Digite a sua validade"} name={name3} onChange={onChange3} value={value3} mb={{ md: "0", xxs: "10%" }} />

                    <Forms label={"Data da Compra"} type={"date"} placeholder={"Digite a data da compra"} name={name4} onChange={onChange4} value={value4} mb={{ md: "0", xxs: "10%" }} />
                </HStack>
                <HStack spacing={{ md: 6, xxs: 0 }} flexDir={{ md: "row", xxs: "column" }}>
                    <Forms label={"Demanda diária"} type={"text"} placeholder={"Digite a demanda diária do produto"} name={name5} onChange={onChange5} value={value5} mb={{ md: "0", xxs: "10%" }} />

                    <Forms label={"Tempo de ressuprimento"} type={"text"} placeholder={"Digite o tempo de ressuprimento do produto"} name={name6} onChange={onChange6} value={value6} mb={{ md: "0", xxs: "10%" }} />
                </HStack>
                <HStack spacing={{ md: 6, xxs: 0 }} flexDir={{ md: "row", xxs: "column" }}>
                    <Forms label={"Estoque de segurança"} type={"text"} placeholder={"Digite o estoque de segurança"} name={name7} onChange={onChange7} value={value7} mb={{ md: "0", xxs: "10%" }} />
                    
                    <FormsValue label={"Valor do Produto"} type={"number"} placeholder={"Digite o valor do produto"} name={name8} onChange={onChange8} value={value8} mb={{ md: "0", xxs: "10%" }} />
                </HStack>
                <ButtonSave align="end" onClick={onClick} />
            </CardMain>
        </Main>

    )
}