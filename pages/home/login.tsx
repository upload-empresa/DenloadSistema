import type { ReactElement } from "react";
import { useSession, getCsrfToken, signIn } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { NextPageWithLayout } from "types";
import { AuthLayout } from "@/components/layouts";
import { getParsedCookie } from "@/lib/cookie";
import env from "@/lib/env";

import { HStack, Stack, Text } from "@chakra-ui/react"

import { ButtonLogin } from "@/components/Buttons"
import { FormLogin } from "@/components/Forms"
import { Links } from "@/components/Links"
import { useToast } from '@chakra-ui/react'

const Login: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken, redirectAfterSignIn }) => {
  const { status } = useSession();
  const router = useRouter();
  const { t } = useTranslation("common");

  if (status === "authenticated") {
    router.push(redirectAfterSignIn);
  }

  const toast = useToast()
  const statuses = ['success', 'error', 'warning', 'info']

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;

      const response = await signIn("credentials", {
        email,
        password,
        csrfToken,
        redirect: false,
        callbackUrl: redirectAfterSignIn,
      });

      formik.resetForm();

      if (!response?.ok) {
        {

          toast({
            title: `Email ou senha incorretos`,
            status: 'error',
            isClosable: true,
          })

        }
        return;
      }

    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <HStack
          as="main"
          bgImage="url('/login.png')"
          justify={"end"}
        >
          <Stack
            as="article"
            spacing={8}
            bg={"#fbfff2b5"}
            borderTopLeftRadius={"full"}
            borderBottomLeftRadius={"full"}
            px={24}
            py={72}
          >
            <Stack
              spacing={6}
            >
              <FormLogin placeholder={"Email"} type="email" onChange={formik.handleChange} name="email" value={formik.values.email} />
              <FormLogin placeholder={"Senha"} type="password" onChange={formik.handleChange} name="password" value={formik.values.password} />
              <Links
                href={"/login/esqueci-a-senha"}
              >
                <Text
                  as="p"
                  color={"#2FAFCA"}
                  fontSize={"16px"}
                  fontWeight={400}
                >
                  Esqueci a senha
                </Text>
              </Links>


            </Stack>
            <ButtonLogin text={"Entrar"} type="submit" />
          </Stack>
        </HStack>
      </form>

    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="Welcome back" description="Log in to your account">
      {page}
    </AuthLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req, res, locale }: GetServerSidePropsContext = context;

  const cookieParsed = getParsedCookie(req, res);

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ["common"]) : {}) || null,
      csrfToken: await getCsrfToken(context) || null,
      redirectAfterSignIn: cookieParsed.url ?? env.redirectAfterSignIn,
    },
  };
};

export default Login;
