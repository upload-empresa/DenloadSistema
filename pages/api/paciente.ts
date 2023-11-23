import {
  createPaciente,
  deletePaciente,
  getPaciente,
  getPacientesWithSearch,
  getPacientesWithSelect,
  updatePaciente,
} from '@/lib/api';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]';
import { HttpMethod } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  // if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      const {
        query: { orderBy, search },
      } = req;
      if (orderBy) {
        //@ts-ignore
        return getPacientesWithSelect(req, res, session);
      } else if (search) {
        //@ts-ignore
        return getPacientesWithSearch(req, res, session);
      } else {
        //@ts-ignore
        return getPaciente(req, res, session);
      }
    case HttpMethod.POST:
      //@ts-ignore
      return createPaciente(req, res, session);
    case HttpMethod.DELETE:
      //@ts-ignore
      return deletePaciente(req, res, session);
    case HttpMethod.PUT:
      //@ts-ignore
      return updatePaciente(req, res, session);
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
