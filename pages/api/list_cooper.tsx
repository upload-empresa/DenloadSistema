import prisma from '@/lib/prisma';

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                gh_username: true,
            },
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
