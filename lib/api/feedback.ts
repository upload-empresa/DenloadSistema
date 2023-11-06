import prisma from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Feedback, Site } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithSiteFeedback } from '@/types';

interface AllFeedbacks {
  feedbacks: Array<Feedback>;
  site: Site | null;
}

/**
 * Get Feedback
 *
 * Fetches & returns either a single or all Feedbacks available depending on
 * whether a `FeedbackId` query parameter is provided. If not all Feedbacks are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getFeedback(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllFeedbacks | (WithSiteFeedback | null)>> {
  const { feedbackId, siteId } = req.query;

  // if (Array.isArray(feedbackId) || Array.isArray(siteId) || !session.user.id)
  //   return res.status(400).end('Bad request. Query parameters are not valid.');

    if (Array.isArray(feedbackId) || Array.isArray(siteId))
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (feedbackId) {
      const feedback = await prisma.feedback.findFirst({
        where: {
          id: feedbackId,
          site: {
            user: {
              id: 'clom02sp80000ufn8aqtah56e',
            },
          },
        },
        include: {
          site: true,
        },
      });

      return res.status(200).json(feedback);
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          id: 'clom02sp80000ufn8aqtah56e',
        },
      },
    });

    const feedbacks = !site
      ? []
      : await prisma.feedback.findMany({
          where: {
            site: {
              id: siteId,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

    return res.status(200).json({
      feedbacks,
      site,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Feedbacks with Search
 *
 * Gets a Feedback from a search input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getFeedbacksWithSearch(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Feedback>>> {
  const { search } = req.query;

  if (typeof search !== 'string' || !session.user.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        site: {
          user: {
            id: session.user.id,
          },
        },
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Feedback
 *
 * Creates a new Feedback from a provided `siteId` query parameter.
 *
 * Once created, the sites new `FeedbackId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createFeedback(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  feedbackId: string;
}>> {
  const { siteId } = req.query;

  if (!siteId || typeof siteId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      id: siteId,
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end('Site not found');

  try {
    const response = await prisma.feedback.create({
      data: {
        image: `/placeholder.png`,
        imageBlurhash: placeholderBlurhash,
        site: {
          connect: {
            id: siteId,
          },
        },
      },
    });

    return res.status(201).json({
      feedbackId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Feedback
 *
 * Deletes a Feedback from the database using a provided `FeedbackId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteFeedback(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { feedbackId } = req.query;

  if (!feedbackId || typeof feedbackId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      feedback: {
        some: {
          id: feedbackId,
        },
      },
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end('Site not found');

  try {
    const response = await prisma.feedback.delete({
      where: {
        id: feedbackId,
      },
      include: {
        site: {
          select: { subdomain: true, customDomain: true },
        },
      },
    });
    if (response?.site?.subdomain) {
      // revalidate for subdomain
      await revalidate(
        `https://${response.site?.subdomain}.vercel.pub`, // hostname to be revalidated
        response.site.subdomain, // siteId
        //@ts-ignore
        response.slug // slugname for the feedback
      );
    }
    if (response?.site?.customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${response.site.customDomain}`, // hostname to be revalidated
        response.site.customDomain, // siteId
        //@ts-ignore
        response.slug // slugname for the feedback
      );

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Feedback
 *
 * Updates a Feedback & all of its data using a collection of provided
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
export async function updateFeedback(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Feedback>> {
  const { id, name, email, message, slug, image, subdomain, customDomain } =
    req.body;

  if (!id || typeof id !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      feedback: {
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
    const feedback = await prisma.feedback.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        message,
        slug,
        image,
        imageBlurhash: (await getBlurDataURL(image)) ?? undefined,
      },
    });
    if (subdomain) {
      // revalidate for subdomain
      await revalidate(
        `https://${subdomain}.vercel.pub`, // hostname to be revalidated
        subdomain, // siteId
        slug // slugname for the feedback
      );
    }
    if (customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${customDomain}`, // hostname to be revalidated
        customDomain, // siteId
        slug // slugname for the feedback
      );

    return res.status(200).json(feedback);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
