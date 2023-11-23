import {
  createAnamnese,
  deleteAnamnese,
  getAnamnese,
  updateAnamnese,
} from '@/lib/api';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]';
import { HttpMethod } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function anamnese(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  // if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      //@ts-ignore
      return getAnamnese(req, res, session);
    case HttpMethod.POST:
      //@ts-ignore
      return createAnamnese(req, res, session);
    case HttpMethod.DELETE:
      //@ts-ignore
      return deleteAnamnese(req, res, session);
    case HttpMethod.PUT:
      //@ts-ignore
      return updateAnamnese(req, res, session);
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
