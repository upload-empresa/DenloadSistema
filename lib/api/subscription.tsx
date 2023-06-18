import prisma from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Subscription, Site } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithSiteSubscription } from '@/types';

interface AllSubscriptions {
    subscriptions: Array<Subscription>;
    site: Site | null;
}

/**
 * Get Subscription
 *
 * Fetches & returns either a single or all subscriptions available depending on
 * whether a `subscriptionId` query parameter is provided. If not all subscriptions are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getSubscription(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<AllSubscriptions | (WithSiteSubscription | null)>> {
    const { subscriptionId, siteId } = req.query;


    if (Array.isArray(subscriptionId) || Array.isArray(siteId) || !session.user.id)
        return res.status(400).end('Bad request. Query parameters are not valid.');

    try {
        if (subscriptionId) {
            const subscription = await prisma.subscription.findFirst({
                where: {
                    id: subscriptionId,
                    site: {
                        user: {
                            id: session.user.id,
                        },
                    },
                },
                include: {
                    site: true,
                },
            });

            return res.status(200).json(subscription);
        }

        const site = await prisma.site.findFirst({
            where: {
                id: siteId,
                user: {
                    id: session.user.id,
                },
            },
        });

        const subscriptions = !site
            ? []
            : await prisma.subscription.findMany({
                where: {
                    site: {
                        id: siteId,
                    },
                    subscriptionStatus: true
                },
                // orderBy: {
                //   createdAt: 'desc',
                // },
            });

        return res.status(200).json({
            subscriptions,
            site,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}





/**
 * Update Subscription
 *
 * Updates a Subscription & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - title
 *  - description
 *  - content
 *  - slug
 *  - image
 *  - imageBlurhash
 *  - published
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateSubscription(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<Subscription>> {
    const {
        id,
    } = req.body;

    if (!id || typeof id !== 'string' || !session?.user?.id) {
        return res
            .status(400)
            .json({ error: 'Missing or misconfigured site ID or session ID' });
    }

    const site = await prisma.site.findFirst({
        where: {
            subscriptions: {
                some: {
                    id,
                },
            },
            user: {
                id: session.user.id,
            },
        },
    });
    if (!site) return res.status(404).end('Site not found');

    try {
        const subscription = await prisma.subscription.update({
            where: {
                id: id,
            },
            data: {
                subscriptionStatus: true,
            },
        });
        return res.status(200).json(subscription);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
