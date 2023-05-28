import { Link } from "@chakra-ui/react"
import NextLink from 'next/link'
import { ReactNode } from 'react'

interface LinksProps {
    href: string
    children: ReactNode
}

export function Links({ href, children }:LinksProps) {
    return (
        <NextLink href={href} passHref>
            <Link
                as="a"
                _hover={{
                    textDecoration: 'none'
                }}
            >
                {children}
            </Link>
        </NextLink>
    )
}