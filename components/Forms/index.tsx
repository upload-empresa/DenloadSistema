import { FormControl, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement, Select, Textarea } from "@chakra-ui/react"
import { useState } from "react"

interface FormsProps {
    label: any
    label2?: any
    type?: string
    placeholder?: any
    w?: string
    name?: any
    value?: any
    onChange?: any
    onInput?: any
    ref?: any
    mb?: any
    isRequired?: any
}

export function Forms({ label, placeholder, type, w, name, value, onChange, ref, onInput, mb, isRequired }: FormsProps) {

    return (
        <FormControl isRequired={isRequired} w={w} mb={mb}>
            <FormLabel color={"#828282"} fontSize={{ '2xl': "18px", lg: "14px", md: "14px", xxs: "14px" }}>{label}</FormLabel>
            <Input type={type} ref={ref} name={name} value={value} onChange={onChange} onInput={onInput} placeholder={placeholder} _placeholder={{ color: "#A1A1A1", fontSize: "14px" }} required />
        </FormControl>
    )
}

export function FormsSelect({ label, w, name, value, onChange, ref, onInput, mb }: FormsProps) {

    return (
        <FormControl w={w} mb={mb}>
            <FormLabel color={"#828282"} fontSize={{ '2xl': "18px", lg: "14px", md: "14px", xxs: "14px" }}>{label}</FormLabel>
            <Select
                name={name}
                value={value}
                onChange={onChange}
            >
                <option value="">Selecione o sexo</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
            </Select>

        </FormControl>
    )
}

export function FormsAnamnese({ label, w, mb, label2 }: FormsProps) {
    return (
        <FormControl w={w} mb={mb}>
            <FormLabel color={"#828282"} fontSize={{ '2xl': "18px", lg: "14px", md: "14px", xxs: "14px" }}>{label}</FormLabel>
            <FormLabel color={"#828282"} fontSize={{ '2xl': "18px", lg: "14px", md: "14px", xxs: "14px" }}>{label2}</FormLabel>
        </FormControl>
    )
}

export function FormsValue({ label, placeholder, type, w, name, value, onChange, ref, onInput }: FormsProps) {
    return (
        <FormControl w={w}>
            <FormLabel color={"#828282"} fontSize={"14px"}>{label}</FormLabel>
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1em'
                >
                    R$
                </InputLeftElement>

                <Input type={type} ref={ref} name={name} value={value} onChange={onChange} onInput={onInput} placeholder={placeholder} _placeholder={{ color: "#A1A1A1", fontSize: "14px" }} required />
                <InputRightElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='0.9em'
                >
                    {/* ,00 */}
                </InputRightElement>

            </InputGroup>
        </FormControl>
    )
}


export function FormsFile() {
    return (
        <Input
            type={"file"}
        />
    )
}

interface SelectsProps {
    label: string
    onInput?: any
    defaultValue?: any
    mb?: any
}


export function Selects({ label, onInput, defaultValue, mb }: SelectsProps) {
    const handleInput = (event: any) => {
        const selectedValue = event.target.value;

        if (selectedValue === defaultValue) {
            // alert("Por favor, selecione uma opção válida.");
        } else {
            onInput(event);
        }
    };

    return (
        <FormControl isRequired mb={mb}>
            <FormLabel color={"#828282"} fontSize={"14px"}>{label}</FormLabel>
            <Select name="grupo" onChange={handleInput} defaultValue={defaultValue} color="#A1A1A1" fontSize={"14px"}>
                <option value="" disabled>Selecione a opção</option>
                <option value="Infantil">Infantil</option>
                <option value="Jovem">Jovem</option>
                <option value="Adulto">Adulto</option>
                <option value="Idoso">Idoso</option>
            </Select>
        </FormControl>
    );
}


interface TextAreasProps {
    label: string
    name?: any
    onInput?: any
    value?: any

}

export function TextAreas({ label, name, onInput, value }: TextAreasProps) {
    return (
        <FormControl>
            <FormLabel color={"#828282"} fontSize={"14px"}>{label}</FormLabel>
            <Textarea name={name} onInput={onInput} value={value} placeholder='Observações do paciente' _placeholder={{ color: "#A1A1A1", fontSize: "14px" }} />
        </FormControl>
    )
}

interface FormLoginProps {
    placeholder?: string
    type?: any
    onChange?: any
    name?: any
    value?: any

}

export function FormLogin({ placeholder, type, onChange, name, value, }: FormLoginProps) {
    return (
        <Input variant='flushed' borderBottom={"1.5px solid #0000007a"} placeholder={placeholder} type={type} onChange={onChange} name={name} value={value} />

    )
}

interface SelectsProps {
    label: string
    onInput1: any
    defaultValue1: any
}

export function SelectsFinanceiro({ label, onInput1, defaultValue1 }: SelectsProps) {
    return (
        <FormControl>
            <FormLabel color={"#828282"} fontSize={"14px"}>{label}</FormLabel>
            <Select name="pago" placeholder='Defina o status do pagamento' color="#A1A1A1"
                fontSize={"14px"} onChange={onInput1} defaultValue={defaultValue1}>
                <option value='true' color="#A1A1A1">Não Pago</option>
                <option value='false' color="#A1A1A1">Pago</option>

            </Select>
        </FormControl>
    )
}