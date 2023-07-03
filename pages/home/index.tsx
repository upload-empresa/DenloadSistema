import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import { Site, User } from "@prisma/client";
import { Button, Heading, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import { CardAdmin } from "@/components/Cards";
import { ModalAdmin } from "@/components/Modais"
import { Main } from "@/components/Main";
import { MdAdd } from "react-icons/md";

export default function AppIndex() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [creatingSite, setCreatingSite] = useState<boolean>(false);
  const [showBotao, setShowBotao] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const siteNameRef = useRef<HTMLInputElement | null>(null);
  const siteDescriptionRef = useRef<HTMLTextAreaElement | null>(null);


  const router = useRouter();

  const toast = useToast()
  const statuses = ['success', 'error', 'warning', 'info']

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: sites } = useSWR<Array<Site>>(
    sessionId && `/api/site`,
    fetcher
  );

  async function fetchUsers() {
    const res = await fetch("/api/list_cooper");
    const data = await res.json();
    return data;
  }
  let contador = 0;

  useEffect(() => {
    if (sites && sites.length > 0 && sites.length < 2) {
      contador = 1;
    } else if (sites && sites.length >= 2 && sites.length < 3) {
      contador = 2;
    } else if (sites && sites.length == 3) {
      contador = 3;
      setShowBotao(false);
    } else if (sites && sites.length > 3) {
      contador = 4;
      setShowBotao(false);
    }
  }, [sites]);

  console.log(contador)

  async function createSite() {

    try {
      const users = await fetchUsers();
      const hasCooper = users.some((user: any) => user.gh_username === "cooper");
      const hasSilver = users.some((user: any) => user.gh_username === "silver");
      const hasGold = users.some((user: any) => user.gh_username === "gold");
      const hasDiamond = users.some((user: any) => user.gh_username === "diamond");

      if (hasCooper) {
        if (contador > 1) {
          setShowBotao(false);
        }
      }
      if (hasSilver) {
        if (contador > 2) {
          setShowBotao(false);
        }
      }
      if (hasGold) {
        if (contador > 3) {
          setShowBotao(false);
        }
      }
      if (hasDiamond) {
        if (contador > 4) {
          setShowBotao(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
    const res = await fetch("/api/site", {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: sessionId,
        name: siteNameRef.current?.value,
        description: siteDescriptionRef.current?.value,
      }),
    });

    if (!res.ok) {
      alert("Failed to create site");
    }

    const data = await res.json();
    contador++;
    console.log(contador)
    router.push(`/site/${data.siteId}`);
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isModalOpen, setModalOpen] = useState(false)

  const handleButtonClick = () => {
    setModalOpen(true)
    onOpen()
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    onClose()
  }


  return (

    <Main
      title={"Administrativo da Clínica"}
      w={""}
      path={""}
      button={
        showBotao ? (
          <Button
            leftIcon={<MdAdd />}
            bg={"#0BB7AF"}
            color={"white"}
            size={"sm"}
            fontWeight={500}
            onClick={handleButtonClick}
            _hover={{
              bg: '#2C7A7B'
            }}
          >
            Novo Administrador
          </Button>
        ) : null
      }
      altText={""}
      tamh={0}
      tamw={0}
    >

      {isModalOpen && (

        <ModalAdmin
          isOpenModal={isModalOpen}
          onCloseModal={handleCloseModal}
          onOpenModal={handleButtonClick}
          name1="name"
          ref1={siteNameRef}
          type1="text"
          name2="description"
          ref2={siteDescriptionRef}
          type2="text"
          onSubmit={(event: any) => {
            event.preventDefault();
            setCreatingSite(true);
            createSite();
          }} />


      )}

      {sites ? (
        sites.length > 0 ? (
          sites.map((site) => (
            <Link href={`/site/${site.id}`} key={site.id}>
              <Stack spacing={7}>
                <CardAdmin title={site.name} text={site.description} />
              </Stack>
            </Link>
          ))
        ) : (
          <>
            <p className="text-2xl font-cal text-gray-600">
              Nenhum administrador cadastro. Clique em &quot;Novo Administrador&quot; para criar um.
            </p>

          </>
        )
      ) : (
        <p>Carregando...</p>
      )}

    </Main>

  );
}
