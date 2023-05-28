import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'

import "@/styles/globals.css";

import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        {/* <main> */}
        <Component {...pageProps} />
        {/* </main> */}
        {/* <Analytics /> */}
      </SessionProvider>
    </ChakraProvider>
  );
}