import {
  createEstoque,
  deleteEstoque,
  getEstoquesWithSearch,
  getEstoquesWithSelect,
  getEstoque,
  updateEstoque,
} from '@/lib/api';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]';
import { HttpMethod } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function estoque(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      const {
        query: { orderBy, search },
      } = req;
      if (orderBy) {
        return getEstoquesWithSelect(req, res, session);
      } else if (search) {
        return getEstoquesWithSearch(req, res, session);
      } else {
        return getEstoque(req, res, session);
      }
    case HttpMethod.POST:
      return createEstoque(req, res, session);
    case HttpMethod.DELETE:
      return deleteEstoque(req, res, session);
    case HttpMethod.PUT:
      return updateEstoque(req, res, session);
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
