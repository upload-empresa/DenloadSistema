import prisma from '@/lib/prisma';
//@ts-ignore
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    const { email, password, name, celular } = req.body

    
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                celular,
                password,
                gh_username: 'cooper'
            },
        })
        
        console.log(user);
        res.status(201).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
