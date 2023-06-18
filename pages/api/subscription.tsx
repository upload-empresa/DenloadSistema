import {
    getSubscription,
    updateSubscription
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
            return getSubscription(req, res, session);
        case HttpMethod.PUT:
            return updateSubscription(req, res, session);
        default:
            res.setHeader('Allow', [
                HttpMethod.GET,
                HttpMethod.PUT,
            ]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
