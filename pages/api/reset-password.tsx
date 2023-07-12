import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
//@ts-ignore
export default async function handler(req, res) {

    // if (req.method !== 'PUT') {
    //     res.status(405).json({ message: 'Method not allowed' });
    //     return;
    // }

    // const { token } = req.query;
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGpmb3c0MWUwMDAwdWYxczBoZGdpdXUzIiwiaWF0IjoxNjg5MDI0MDcwfQ.VjK0pevk0jSBWBwJVa8Viqv0xYJIyGLrZUBB5-YGXRw'





    const { password, token2 } = req.body;

    try {

        const hashedPassword = await hashPassword(password);

        await prisma.user.update({
            //@ts-ignore
            where: { token: token2 },
            data: {
                password: hashedPassword,
            },

        });


        res.status(200).json({ message: 'Password updated' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });

    }
}
