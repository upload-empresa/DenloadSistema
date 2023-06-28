import { HStack, Icon, Input, InputGroup, InputLeftElement, } from "@chakra-ui/react"

import { MdPerson, MdSearch } from "react-icons/md"

import { FigureImage } from "../FigureImage"
import { useRouter } from "next/router";
import React from "react";
import { signOut } from "next-auth/react";
import Loader from "../app/Loader";
import useRequireAuth from "../../lib/useRequireAuth";

import type { WithChildren } from "@/types";

interface LayoutProps extends WithChildren {
    siteId?: string;
}

export function Navbar({ siteId, children }: LayoutProps) {
    const router = useRouter();
    const sitePage = router.pathname.startsWith("/app/site/[id]");
    const postPage = router.pathname.startsWith("/app/post/[id]");
    const rootPage = !sitePage && !postPage;
    const tab = rootPage
        ? router.asPath.split("/")[1]
        : router.asPath.split("/")[3];

    const session = useRequireAuth();
    if (!session) return <Loader />;
    return (

        <HStack
            as="section"
            bg="#01233C"
            w="100%"
            position={"sticky"}
            top={0}
            zIndex={200}
            py={2}
            px={7}
            justify={"space-between"}
        >
            <HStack
                as="article"
                pl={{ lg: 0, md: 10, xxs: 10 }}
            >
                <FigureImage w={"50%"} path={"/logodenload.png"} altText={"Logo do Denload"} tamH={1488} tamW={451} />
            </HStack>






        </HStack>
    )
}