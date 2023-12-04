import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

//@ts-ignore
export default async function handler(req, res) {

    const { sessionEmail } = req.query

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

    if (sites.length === 1) {
        responseData = { siteId: sites[0].id };
    } else {
        responseData = { siteId: sites[0].id };
    }

    res.status(200).json(responseData);
}
