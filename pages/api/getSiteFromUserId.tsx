import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';
// import { useRouter } from "next/router";

//@ts-ignore
export default async function handler(req, res) {

    // const router = useRouter();
    const { sessionEmail } = req.query
    // const { id: siteId } = router.query;

    console.log(req.query);

    if (typeof sessionEmail !== 'string' || !sessionEmail.trim()) {
        return res.status(400).end('Bad request. sessionEmail query parameter is not valid.');
    }

    const user = await prisma.user.findUnique({
        where: {
            email: sessionEmail,
        },
    });

    const userId = user?.id;

    const sites = await prisma.site.findMany({
        where: {
            userId: userId,
        },
    });

    let responseData;

    // console.log(sites[1].name)
    // console.log(sites[0].id)

    //Comparar o siteId atual da aplicação com o siteId 
    //que está registrado dentro do array de sites

    if (sites.length === 1) {
        responseData = { siteId: 140 };
    } else {
        responseData = { siteId: 22 };
    }

    //AQUI TEM O PROBLEMA DA SIDEBAR -> NA LÓGICA DESSE ARRAY

    res.status(200).json(responseData);
}
