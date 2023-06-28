import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { signOut } from "next-auth/react";
import Loader from "./Loader";
import useRequireAuth from "../../lib/useRequireAuth";

import type { WithChildren } from "@/types";

interface LayoutProps extends WithChildren {
    siteId?: string;
}

export default function Layout({ siteId, children }: LayoutProps) {
    const title = "Platforms on Vercel";
    const description =
        "Create a fullstack application with multi-tenancy and custom domains support using Next.js, Prisma, and PostgreSQL";
    const logo = "/favicon.ico";
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
        <>
            <div>{children}</div>

        </>
    );
}