import { IoPersonOutline } from "react-icons/io5"
import { MdOutlineInsertDriveFile, MdOutlineImage, MdEditNote, MdEdit, MdOutlineImageSearch } from "react-icons/md"
import { SlNote } from "react-icons/sl"

import { CardMainPlus, CardIconPacientes } from "."
import { useRouter } from "next/router"

export function CardPacientesPlus() {
    const router = useRouter();
    const { id: pacienteId } = router.query;

    return (
        <CardMainPlus>
            <CardIconPacientes icon={IoPersonOutline} text={"Dados"} href={`/paciente/${pacienteId}/dadospaciente`} />
            <CardIconPacientes icon={MdOutlineInsertDriveFile} text={"Documentos"} href={`/paciente/${pacienteId}/documentos-do-paciente`} />
            <CardIconPacientes icon={MdOutlineImage} text={"Imagens"} href={`/paciente/${pacienteId}/fotos-do-paciente`} />
            <CardIconPacientes icon={MdEditNote} text={"Anamneses"} href={`/paciente/${pacienteId}/anamnese`} />
            <CardIconPacientes icon={SlNote} text={"Anotações"} href={`/paciente/${pacienteId}/anotacoes`} />
        </CardMainPlus>

    )
}

export function CardPerfilPlus() {
    const router = useRouter();
    const { id: siteId } = router.query;
    return (
        <CardMainPlus>
            <CardIconPacientes icon={IoPersonOutline} text={"Perfil"} href={"/"} />
            <CardIconPacientes icon={MdEdit} text={"Editar Perfil"} href={`/site/${siteId}/perfil`} />
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