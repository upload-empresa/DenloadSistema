import { NextApiRequest, NextApiResponse } from 'next';
import serverAuth from '@/lib/serverAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { siteId } = req.query;

    const { currentSite } = await serverAuth(req, res, siteId);

    // console.log(currentUser?.isAdmin)

    return res.status(200).json(currentSite);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
