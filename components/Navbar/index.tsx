import { Button, HStack, Stack, Text, Icon, Heading } from "@chakra-ui/react"
import { MdHome } from 'react-icons/md'
import type { Site } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";
import { FigureImage } from "../FigureImage"
import Link from "next/link";
import useSWR from "swr";

interface SiteNavbarData {
    sites: Array<Site>;
    site: Site | null;
}

export function Navbar() {
    const router = useRouter();
    const { id: siteId } = router.query;

    const { data } = useSWR<SiteNavbarData>(
        siteId && `/api/paciente?siteId=${siteId}`,
        fetcher,
        {
            onSuccess: (data) => !data?.site && router.push("/"),
        }
    );
    return (
        <>
            <HStack
                as="section"
                bg="white"
                w="100%"
                py={5}
                px={7}
                justify={"space-between"}
            >
                <HStack
                    as="article"
                >
                    <FigureImage w={"25%"} path={"/logo.png"} altText={"Logo do Denload"} tamH={182} tamW={391} />
                    <Button
                        as="button"
                        colorScheme={"green"}
                    >
                        Assine um Plano
                    </Button>
                </HStack>
                <HStack
                    as="article"
                >
                    <Text
                        as="p"
                        color={"gray.400"}
                    >
                        Olá, <Text as="span" color={"gray"}>{data ? data?.site?.name : "..."}</Text>
                    </Text>

                    <FigureImage w={undefined} path={data?.site?.image} altText={"Pessoa Cadastrada no Denload"} tamH={58} tamW={61} />


                </HStack>


            </HStack>
        </>
    )
}