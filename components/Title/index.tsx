import { Heading, HStack, Input, Button, InputGroup, InputLeftElement, Select } from "@chakra-ui/react"
import { ReactNode, useState, useEffect } from "react"
import { MdSearch } from "react-icons/md"
import { Paciente } from "@prisma/client"
import { MdArrowForward } from "react-icons/md"

interface TitleCardsProps {
    title: string
}

interface TitleCardsPacientesProps {
    children: ReactNode
    pacientes: Array<Paciente>;
}

export function TitleCards({ title }: TitleCardsProps) {
    return (
        <Heading
            as="h2"
            color={"#4F4F4F"}
            fontWeight={600}
            fontSize={"20px"}
        >
            {title}
        </Heading>
    )
}

export function TitleCardsPacientes({ children, pacientes }: TitleCardsPacientesProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Array<Paciente>>([]);

    useEffect(() => {
        // função que irá realizar a chamada da API
        const searchApi = async () => {
            const response = await fetch(`http://app.localhost:3000/api/paciente?search=${searchTerm}`);
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

    return (
        <HStack
            justify={"space-between"}
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
                <Select variant='filled' placeholder='Ordenar por' >
                    <option value="name">Nome</option>
                    <option value="age">Idade</option>
                    <option value="gender">Gênero</option>
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
}
export function TitleDashboardGrafic({ title }: TitleDashboardGraficProps) {
    return (
        <HStack
            justify="space-between"
        >
            <Heading
                color={"#4F4F4F"}
                fontSize={"16px"}
                fontWeight={600}
            >
                {title}
            </Heading>
            <Select
                w="40%"
                fontSize="14px"
            >
                <option>3 meses</option>
                <option>6 meses</option>
                <option>12 meses</option>
            </Select>
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
            fontSize={"18px"}
            fontWeight={500}
            color={"#170F49"}
        >
            {title}
        </Heading>
    )
}