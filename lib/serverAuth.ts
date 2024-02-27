import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import { authOptions } from '../pages/api/auth/[...nextauth]';

const serverAuth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  siteId: any
) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    throw new Error('Not signed in 1');
  }

  try {
    const currentSite = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });

    return { currentSite };
  } catch (error) {
    throw new Error('Not signed in');
  }
};

export default serverAuth;
