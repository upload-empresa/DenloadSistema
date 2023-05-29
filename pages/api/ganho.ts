import {
  createGanho,
  deleteGanho,
  getGanho,
  getGanhosWithSearch,
  getGanhosWithSelect,
  updateGanho,
} from '@/lib/api';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]';
import { HttpMethod } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      const {
        query: { orderBy, search },
      } = req;
      if (orderBy) {
        return getGanhosWithSelect(req, res, session);
      } else if (search) {
        return getGanhosWithSearch(req, res, session);
      } else {
        return getGanho(req, res, session);
      }
    case HttpMethod.POST:
      return createGanho(req, res, session);
    case HttpMethod.DELETE:
      return deleteGanho(req, res, session);
    case HttpMethod.PUT:
      return updateGanho(req, res, session);
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
