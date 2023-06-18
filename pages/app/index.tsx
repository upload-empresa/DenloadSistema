import { useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import { Site } from "@prisma/client";
import { Button, Stack, useDisclosure } from "@chakra-ui/react";
import { CardAdmin } from "@/components/Cards";
import { ModalAdmin } from "@/components/Modais"
import { Main } from "@/components/Main";
import { MdAdd } from "react-icons/md";

export default function AppIndex() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [creatingSite, setCreatingSite] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const siteNameRef = useRef<HTMLInputElement | null>(null);
  const siteDescriptionRef = useRef<HTMLTextAreaElement | null>(null);


  const router = useRouter();

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: sites } = useSWR<Array<Site>>(
    sessionId && `/api/site`,
    fetcher
  );



  async function createSite() {
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
