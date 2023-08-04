import { Heading, HStack, Input, Button, InputGroup, InputLeftElement, Select } from "@chakra-ui/react"
import { ReactNode, useState, useEffect } from "react"
import { MdSearch } from "react-icons/md"
import { Paciente } from "@prisma/client"
import { MdArrowForward } from "react-icons/md"
import { useRouter } from "next/router"

interface TitleCardsProps {
    title: string
    text?: string
    mb?: any
}

interface TitleCardsPacientesProps {
    children: ReactNode
    pacientes: Array<Paciente>;
    flexDir?: any
}

export function TitleCards({ title, text, mb }: TitleCardsProps) {

    return (
        <Heading
            as="h2"
            color={"#4F4F4F"}
            fontWeight={600}
            mb={mb}
            fontSize={{ '2xl': "24px", lg: "20px", md: "18px", xxs: "16px" }}
        >
            {title}
        </Heading>
    )
}

export function TitleCardsPacientes({ children, pacientes, flexDir }: TitleCardsPacientesProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState('')
    const [searchResults, setSearchResults] = useState<Array<Paciente>>([]);
    const router = useRouter();
    const { id: siteId } = router.query;

    useEffect(() => {
        // função que irá realizar a chamada da API
        const searchApi = async () => {
            const response = await fetch(`/api/paciente?siteId=${siteId}&search=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        }

        // chamando a função da API apenas se houver algum termo de pesquisa
        if (searchTerm) {
            searchApi();
        } else {
            setSearchResults(pacientes);
        }
    }, [searchTerm]);

    function handleOptionChange(event: any) {
        setSelectedOption(event.target.value)
    }
    return (
        <HStack
            justify={"space-between"}
            align={{ lg: "none", xxs: "start" }}
            flexDir={flexDir}
            spacing={0}
        >
            {children}
            <HStack>
                <InputGroup>
                    <InputLeftElement
                        // eslint-disable-next-line react/no-children-prop
                        children={<MdSearch size={"22px"} />}
                    />
                    <Input type='text' placeholder='Pesquisar' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </InputGroup>
                <Select variant='filled' placeholder='Ordenar por' onChange={handleOptionChange}>
                    <option value="asc">Ordem alfabética (A-Z)</option>
                    <option value="desc">Ordem alfabética (Z-A)</option>

                </Select>
            </HStack>
            {searchTerm ? (
                <div>
                    {searchResults.map((paciente) => (
                        <div key={paciente.id}>{paciente.name}</div>
                    ))}
                </div>
            ) : (
                <div>
                    {pacientes.map((paciente) => (
                        <div key={paciente.id}>{paciente.name}</div>
                    ))}
                </div>
            )}
        </HStack>
    )
}

interface TitleDashboardGraficProps {
    title: string
    value?: any
    onChange?: any
    flexDir?: any
}
export function TitleDashboardGrafic({ title, value, onChange, flexDir }: TitleDashboardGraficProps) {
    return (
        <HStack
            justify="space-between"
            flexDir={flexDir}
        >
            <Heading
                color={"#4F4F4F"}
                fontSize={"16px"}
                fontWeight={600}
            >
                {title}
            </Heading>
            {/* <Select
                w={{ lg: "40%", xxs: "100%" }}
                fontSize="14px"
                value={value}
                onChange={onChange}
            >
                <option>3 meses</option>
                <option>6 meses</option>
                <option>12 meses</option>
            </Select> */}
        </HStack>
    )
}

interface TitleDashboardProps {
    title: string
}

export function TitleDashboard({ title }: TitleDashboardProps) {
    return (
        <Heading
            color={"#4F4F4F"}
            fontSize={"16px"}
            fontWeight={600}
        >
            {title}
        </Heading>
    )
}

interface TitleDashboardFinanceiroProps {
    title: string
    color: string
}

export function TitleDashboardFinanceiro({ title, color }: TitleDashboardFinanceiroProps) {
    return (
        <HStack
            justify="space-between"
        >
            <Heading
                color={color}
                fontWeight={600}
                fontSize="12px"
            >
                {title}
            </Heading>
            <Button
                as="a"
                rightIcon={<MdArrowForward />}
                color={color}
                bg="transparent"
                cursor={"pointer"}
                fontWeight={600}
                fontSize="12px"
                _hover={{
                    textDecor: "none"
                }}
            >
                Ver todas
            </Button>
        </HStack>
    )
}

interface TitleFeedbackProps {
    title: string
}

export function TitleFeedback({ title }: TitleFeedbackProps) {
    return (
        <Heading
            fontSize={{ lg: "18px", xxs: "16px" }}
            fontWeight={500}
            color={"#170F49"}
        >
            {title}
        </Heading>
    )
}

export function TitleAdmin() {
    return (
        <Heading
            as="h1"
            fontSize={{ lg: "48px", md: "36px", xxs: "28px" }}
            fontWeight={"normal"}
            color={"#171717"}
            textAlign={"center"}
        >
            Escolha um administrador
        </Heading>
    )
}