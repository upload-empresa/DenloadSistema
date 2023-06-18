import prisma from '@/lib/prisma';
//@ts-ignore
export default async function handler(req, res) {
  const { id: userId } = req.query;
  if (req.method !== 'PUT') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { email, password, name, celular } = req.body;

  try {
    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      res.status(400).json({ message: 'Invalid id' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: password,
        email: email,
        name: name,
        celular: celular,
        id: userId
        // id: 'clidm4a2v0000ufncla24326z',
      },
    });

    res.status(200).json({ message: 'Certo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
