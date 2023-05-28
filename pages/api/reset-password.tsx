import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
//@ts-ignore
export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    const { password, token } = req.body

    try {
        const user = await prisma.user.findFirst({ where: { token: token } })

        if (!user) {
            res.status(400).json({ message: 'Invalid token' })
            return
        }

        const hashedPassword = await (password)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGhmYmpzcngwMDAydWZwZ2w5bXJpd3JjIiwiaWF0IjoxNjgzNTc5MjUxfQ.cL7tuJEb2Y_BIGpEQgYHjyGvsHsE_EqOpjw5rv5W8C4',
            }
        })

        res.status(200).json({ message: 'Password updated' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
