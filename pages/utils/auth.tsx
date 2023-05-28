import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '@/lib/prisma'

export const generatePasswordResetToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4MTc2MzMzNCwiaWF0IjoxNjgxNzYzMzM0fQ.3bbYCAF9StLjsEIbpTfnGxnx5QgrKTdrRi_tGkKhtFI';
    const token = jwt.sign({ userId }, secret, {} as SignOptions);

    return token;
};

export async function verifyPasswordResetToken(token) {
    try {
        const decoded = jwt.verify(token, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4MTc2MzMzNCwiaWF0IjoxNjgxNzYzMzM0fQ.3bbYCAF9StLjsEIbpTfnGxnx5QgrKTdrRi_tGkKhtFI')

        const user = await prisma.user.findUnique({ where: { id: decoded.sub } })

        if (!user) {
            return null
        }

        return user
    } catch (error) {
        console.error(error)
        return null
    }
}