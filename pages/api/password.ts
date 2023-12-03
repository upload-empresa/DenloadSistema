import prisma from '@/lib/prisma';

//@ts-ignore
export default async function handler(req, res) {
  const { userId } = req.query; // Mudei para userId diretamente

  if (req.method !== 'PUT') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { email, password, name, celular } = req.body;

  try {
    const user = await prisma.user.findMany({ where: { id: userId } });

    console.log(userId);

    if (!user || user.length === 0) {
      // Modificado para verificar se user é um array vazio
      res.status(400).json({ message: 'Invalid id' });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: password,
        email: email,
        name: name,
        celular: celular,
        id: userId,
      },
    });

    res.status(200).json({ message: 'Certo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
