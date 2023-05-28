import { FormControl, FormLabel, Input, Select, Textarea } from "@chakra-ui/react"

interface FormsProps {
    label: any
    type?: string
    placeholder: any
    w?: string
    name?: any
    value?: any
    onChange?: any
}

interface SelectsProps {
    label: string
    onInput?: any
    defaultValue?: any
}

interface TextAreasProps {
    label: string
    name?: any
    onInput?: any
    value?: any
}



export function Forms({ label, placeholder, type, w, name, value, onChange }: FormsProps) {
    return (
        <FormControl w={w}>
            <FormLabel color={"#828282"} fontSize={"14px"}>{label}</FormLabel>
            <Input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} _placeholder={{ color: "#A1A1A1", fontSize: "14px" }} />
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

export function Selects({ label, onInput, defaultValue }: SelectsProps) {
    return (
        <FormControl>
            <FormLabel color={"#828282"} fontSize={"14px"}>{label}</FormLabel>
            <Select name="grupo"
                onInput={onInput}
                defaultValue={defaultValue}
                color="#A1A1A1" fontSize={"14px"}>
                <option value="Infantil" color="#A1A1A1">Infantil</option>
                <option value="Jovem" color="#A1A1A1">Jovem</option>
                <option value="Adulto" color="#A1A1A1">Adulto</option>
                <option value="Idoso" color="#A1A1A1">Idoso</option>
            </Select>
        </FormControl>
    )
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