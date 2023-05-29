import prisma from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Ganho, Site } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithSiteGanho } from '@/types';

interface AllGanhos {
  ganhos: Array<Ganho>;
  site: Site | null;
}

/**
 * Get Ganho
 *
 * Fetches & returns either a single or all ganhos available depending on
 * whether a `ganhoId` query parameter is provided. If not all ganhos are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getGanho(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllGanhos | (WithSiteGanho | null)>> {
  const { ganhoId, siteId } = req.query;

  if (Array.isArray(ganhoId) || Array.isArray(siteId) || !session.user.id)
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (ganhoId) {
      const ganho = await prisma.ganho.findFirst({
        where: {
          id: ganhoId,
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

      return res.status(200).json(ganho);
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          id: session.user.id,
        },
      },
    });

    const ganhos = !site
      ? []
      : await prisma.ganho.findMany({
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
      ganhos,
      site,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Ganhos with Search
 *
 * Gets a Ganho from a search input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getGanhosWithSearch(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Ganho>>> {
  const { search } = req.query;

  if (typeof search !== 'string' || !session.user.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  try {
    const ganhos = await prisma.ganho.findMany({
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

    return res.status(200).json(ganhos);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Ganhos with Select
 *
 * Gets a Ganho from a Select input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getGanhosWithSelect(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Ganho>>> {
  const { orderBy } = req.query;

  if ((orderBy !== 'asc' && orderBy !== 'desc') || !session.user.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  try {
    const ganhos = await prisma.ganho.findMany({
      where: {
        site: {
          user: {
            id: session.user.id,
          },
        },
      },
      orderBy: {
        name: orderBy,
      },
    });

    return res.status(200).json(ganhos);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Ganho
 *
 * Creates a new ganho from a provided `siteId` query parameter.
 *
 * Once created, the sites new `ganhoId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createGanho(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  ganhoId: string;
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
    const response = await prisma.ganho.create({
      data: {
        site: {
          connect: {
            id: siteId,
          },
        },
      },
    });

    return res.status(201).json({
      ganhoId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Ganho
 *
 * Deletes a ganho from the database using a provided `ganhoId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteGanho(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { ganhoId } = req.query;

  if (!ganhoId || typeof ganhoId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      ganho: {
        some: {
          id: ganhoId,
        },
      },
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end('Site not found');

  try {
    const response = await prisma.ganho.delete({
      where: {
        id: ganhoId,
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
        response.slug // slugname for the ganho
      );
    }
    if (response?.site?.customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${response.site.customDomain}`, // hostname to be revalidated
        response.site.customDomain, // siteId
        //@ts-ignore
        response.slug // slugname for the ganho
      );

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Ganho
 *
 * Updates a ganho & all of its data using a collection of provided
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
export async function updateGanho(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Ganho>> {
  const {
    id,
    name,
    recebimento,
    empresa,
    pago,
    slug,
    valor,
    subdomain,
    customDomain,
  } = req.body;

  if (!id || typeof id !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      ganho: {
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
    const ganho = await prisma.ganho.update({
      where: {
        id: id,
      },
      data: {
        name,
        slug,
        valor,
        recebimento,
        empresa,
        pago,
      },
    });
    if (subdomain) {
      // revalidate for subdomain
      await revalidate(
        `https://${subdomain}.vercel.pub`, // hostname to be revalidated
        subdomain, // siteId
        slug // slugname for the ganho
      );
    }
    if (customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${customDomain}`, // hostname to be revalidated
        customDomain, // siteId
        slug // slugname for the ganho
      );

    return res.status(200).json(ganho);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
