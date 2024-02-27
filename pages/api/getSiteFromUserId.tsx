import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

//@ts-ignore
export default async function handler(req, res) {

    const { siteId } = req.query

    if (typeof siteId !== 'string' || !siteId.trim()) {
        return res.status(400).end('Bad request. id query parameter is not valid.');
    }


    await prisma.site.update({
        where: {
            id: siteId
        },
        data: {
            subdomain: siteId
        }
    })

    const site = await prisma.site.findUnique({
        where: {
            subdomain: siteId
        },
    });


    res.status(200).json(site);
}
