import prisma from '@/lib/prisma';
import { generatePasswordResetToken } from 'utils/auth';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: 'helenita.lannes.salles@gmail.com',
        pass: 'wmytvnqxwrmqqhyy',
    },
});
//@ts-ignore
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    const { email } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            res.status(400).json({ message: 'Usuário não encontrado!' })
            return
        }

        const token = generatePasswordResetToken(user.id)

        const resetLink = `https://app.denload.com/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Redefinição de senha',
            text: `Olá ${user.name},\n\nClique no link abaixo para redefinir sua senha:\n\n${resetLink}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email para resetar a senha enviado!' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
