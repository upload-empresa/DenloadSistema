import { Stack } from "@chakra-ui/react"
import NextImage from 'next/image'

interface FigureImageProps {
    w: any
    path: any
    altText: string
    tamH: number
    tamW: number
    align?: any
}

export function FigureImage({ w, path, altText, tamH, tamW, align }: FigureImageProps) {
    return (
        <Stack
            as="figure"
            w={w}
            align={align}
        >
            <NextImage src={path} alt={altText} height={tamH} width={tamW} />
        </Stack>
    )
}