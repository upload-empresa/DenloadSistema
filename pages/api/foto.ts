import { createFoto, deleteFoto, getFoto, updateFoto } from '@/lib/api';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]';
import { HttpMethod } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function foto(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getFoto(req, res, session);
    case HttpMethod.POST:
      return createFoto(req, res, session);
    case HttpMethod.DELETE:
      return deleteFoto(req, res, session);
    case HttpMethod.PUT:
      return updateFoto(req, res, session);
    default:
      res.setHeader('Allow', [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.DELETE,
        HttpMethod.PUT,
      ]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
