import { HStack } from "@chakra-ui/react"

import { Main } from "../Main"
import { ButtonSave } from "../Buttons"
import { CardMain } from "../Cards"
import { Forms, FormsValue, SelectsFinanceiro } from "../Forms"
import { TitleCards } from "../Title"
import { CardFinanceiroPlus } from "../Cards/plus"
import { ReactNode } from "react"

interface FinanceiroAttributesProps {
    title: string
    text: string
    titlePage: string
    children?: ReactNode
    onChange1?: any
    value1?: any
    onChange2?: any
    value2?: any
    onChange3?: any
    value3?: any
    onChange4?: any
    value4?: any
    onChange5?: any
    value5?: any
    onClick?: any
}

export function FinanceiroAttributes({ title, text, titlePage, children, onChange1, value1, onChange2, value2, onChange3, value3, onChange4, value4, onChange5, value5, onClick }: FinanceiroAttributesProps) {
    return (
        <Main title={titlePage} w={"25%"} path={"/perfil.png"} altText={"Ícone do Denload"} tamh={51} tamw={56}>
            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardFinanceiroPlus />
                <CardMain radius={"0 18px 18px 0"} spacing={5} w={{ md: "90%", xxs: "70%" }} >
                    <TitleCards title={title} />
                    <HStack spacing={{ lg: 6, xxs: 0 }} flexDir={{ lg: "row", xxs: "column" }}>
                        <Forms label={"Nome"} type={"text"} placeholder={"Digite o nome da despesa"} name="name" onChange={onChange1} value={value1} mb={{ lg: "0", xxs: "10%" }} />
                        <Forms label={"Data do Vencimento"} type={"date"} placeholder={"Digite a data do vencimento"} onChange={onChange2} value={value2} />
                    </HStack>
                    <HStack spacing={{ lg: 6, xxs: 0 }} flexDir={{ lg: "row", xxs: "column" }}>
                        <FormsValue label={"Valor"} type={"number"} placeholder={"Digite o valor total"} onChange={onChange3} value={value3} mb={{ lg: "0", xxs: "10%" }} />
                        {/* <Forms label={"Data da Compra"} type={"date"} placeholder={"Digite a data da compra"} onChange={onChange4} value={value4} /> */}
                    </HStack>
                    {/* <Forms label={"Empresa"} type={"text"} placeholder={"Digite o nome da empresa"}
                        onChange={onChange5} value={value5} /> */}
                    {children}
                    <ButtonSave align="end" onClick={onClick} />
                </CardMain>
            </HStack>
        </Main>

    )

}

interface FinanceiroEditPropsProps {
    title: string
    text: string
    titlePage: string
    children?: ReactNode
    onChange1?: any
    value1?: any
    onChange2?: any
    value2?: any
    onChange3?: any
    value3?: any
    onChange4?: any
    value4?: any
    onClick?: any
    onInput1: any
    defaultValue1: any
}

export function FinanceiroEdit({ title, text, titlePage, children, onChange1, value1, onChange2, value2, onChange3, value3, onChange4, value4, onClick, onInput1, defaultValue1 }: FinanceiroEditPropsProps) {
    return (
        <Main title={titlePage} w={"25%"} path={"/perfil.png"} altText={"Ícone do Denload"} tamh={51} tamw={56}>
            <HStack
                spacing={0}
                align={"stretch"}
            >
                <CardFinanceiroPlus />
                <CardMain radius={"0 18px 18px 0"} spacing={5} w={"90%"} >
                    <TitleCards title={title} />
                    <HStack spacing={{ lg: 6, xxs: 0 }} flexDir={{ lg: "row", xxs: "column" }}>
                        <Forms label={"Nome do Paciente"} type={"text"} placeholder={"Digite o nome do paciente"} name="name" onChange={onChange1} value={value1} />
                        <Forms label={"Data da Consulta"} type={"date"} placeholder={"Digite a data da consulta"} onChange={onChange2} value={value2} />
                    </HStack>
                    <HStack spacing={{ lg: 6, xxs: 0 }} flexDir={{ lg: "row", xxs: "column" }}>
                        <FormsValue label={"Valor"} type={"number"} placeholder={"Digite o valor da consulta"} onChange={onChange3} value={value3} />
                        {/* <SelectsFinanceiro label={"Status do Pagamento"} onInput1={onInput1} defaultValue1={defaultValue1} /> */}


                    </HStack>
                    {children}
                    <ButtonSave align="end" onClick={onClick} />
                </CardMain>
            </HStack>
        </Main>

    )

}