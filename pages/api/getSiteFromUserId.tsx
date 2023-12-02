// pages/api/getSiteFromUserId.js
import prisma from '@/lib/prisma';

//@ts-ignore
export default async function handler(req, res) {
    const { userId } = req.query;

    const site = await prisma.site.findFirst({
        where: {
            userId: userId,
        },
    });

    res.status(200).json({ siteId: site?.id });
}
