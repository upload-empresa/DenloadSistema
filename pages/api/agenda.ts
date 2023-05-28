import {
  createAgenda,
  //@ts-ignore
  deleteAgenda,
  getAgenda,
  groupByAgenda,
  //@ts-ignore
  getAgendasWithSearch,
  updateAgenda,
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
        query: { search },
      } = req;
      if (search) {
        return getAgendasWithSearch(req, res, session);
      } else {
        return getAgenda(req, res, session);
      }
    case HttpMethod.POST:
      //@ts-ignore
      return createAgenda(req, res, session);
    case HttpMethod.DELETE:
      return deleteAgenda(req, res, session);
    case HttpMethod.PUT:
      return updateAgenda(req, res, session);
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
