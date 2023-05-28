import type { NextApiRequest, NextApiResponse } from 'next';

import { procedimentoCount } from '@/lib/api/teste';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGET(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        data: null,
        error: { message: `Method ${method} Not Allowed` },
      });
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const authors = await procedimentoCount();

  return res.status(200).json({ data: authors, error: null });
};
