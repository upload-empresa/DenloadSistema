import { IoPersonOutline } from "react-icons/io5"
import { MdOutlineInsertDriveFile, MdOutlineImage, MdEditNote, MdEdit, MdOutlineImageSearch } from "react-icons/md"
import { SlNote } from "react-icons/sl"

import { CardMainPlus, CardIconPacientes } from "."
import { useRouter } from "next/router"

export function CardPacientesPlus() {

    return (
        <CardMainPlus>
            <CardIconPacientes icon={IoPersonOutline} text={"Dados"} href={"/pacientes/dados-do-paciente"} />
            <CardIconPacientes icon={MdOutlineInsertDriveFile} text={"Documentos"} href={"/pacientes/documentos-do-paciente"} />
            <CardIconPacientes icon={MdOutlineImage} text={"Imagens"} href={"/pacientes/imagens-do-paciente"} />
            <CardIconPacientes icon={MdEditNote} text={"Anamneses"} href={"/pacientes/anamneses"} />
            <CardIconPacientes icon={SlNote} text={"Anotações"} href={"/pacientes/anotacoes"} />
        </CardMainPlus>

    )
}

export function CardPerfilPlus() {
    return (
        <CardMainPlus>
            <CardIconPacientes icon={IoPersonOutline} text={"Perfil"} href={"/pefil"} />
            <CardIconPacientes icon={MdEdit} text={"Editar Perfil"} href={"/perfil/editar-perfil"} />
        </CardMainPlus>

    )
}

export function CardFinanceiroPlus() {
    const router = useRouter();
    const { id: siteId } = router.query;
    return (
        <CardMainPlus>
            <CardIconPacientes icon={IoPersonOutline} text={"Geral"} href={`/site/${siteId}/financeiro`} />
            <CardIconPacientes icon={MdOutlineInsertDriveFile} text={"Ganhos"} href={`/site/${siteId}/ganhos`} />
            <CardIconPacientes icon={MdOutlineImageSearch} text={"Despesas"} href={`/site/${siteId}/despesas`} />
        </CardMainPlus>

    )
}