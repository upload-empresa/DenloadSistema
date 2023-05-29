import prisma from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Despesa, Site } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithSiteDespesa } from '@/types';

interface AllDespesas {
  despesas: Array<Despesa>;
  site: Site | null;
}

/**
 * Get Despesa
 *
 * Fetches & returns either a single or all despesas available depending on
 * whether a `despesaId` query parameter is provided. If not all despesas are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getDespesa(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllDespesas | (WithSiteDespesa | null)>> {
  const { despesaId, siteId } = req.query;

  if (Array.isArray(despesaId) || Array.isArray(siteId) || !session.user.id)
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (despesaId) {
      const despesa = await prisma.despesa.findFirst({
        where: {
          id: despesaId,
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

      return res.status(200).json(despesa);
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          id: session.user.id,
        },
      },
    });

    const despesas = !site
      ? []
      : await prisma.despesa.findMany({
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
      despesas,
      site,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Despesas with Search
 *
 * Gets a Despesa from a search input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getDespesasWithSearch(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Despesa>>> {
  const { search } = req.query;

  if (typeof search !== 'string' || !session.user.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  try {
    const despesas = await prisma.despesa.findMany({
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

    return res.status(200).json(despesas);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Despesas with Select
 *
 * Gets a Despesa from a Select input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getDespesasWithSelect(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Despesa>>> {
  const { orderBy } = req.query;

  if ((orderBy !== 'asc' && orderBy !== 'desc') || !session.user.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  try {
    const despesas = await prisma.despesa.findMany({
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

    return res.status(200).json(despesas);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Despesa
 *
 * Creates a new despesa from a provided `siteId` query parameter.
 *
 * Once created, the sites new `despesaId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createDespesa(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  despesaId: string;
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
    const response = await prisma.despesa.create({
      data: {
        // image: `/placeholder.png`,
        // imageBlurhash: placeholderBlurhash,
        site: {
          connect: {
            id: siteId,
          },
        },
      },
    });

    return res.status(201).json({
      despesaId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Despesa
 *
 * Deletes a despesa from the database using a provided `despesaId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteDespesa(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { despesaId } = req.query;

  if (!despesaId || typeof despesaId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      despesa: {
        some: {
          id: despesaId,
        },
      },
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end('Site not found');

  try {
    const response = await prisma.despesa.delete({
      where: {
        id: despesaId,
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
        response.slug // slugname for the despesa
      );
    }
    if (response?.site?.customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${response.site.customDomain}`, // hostname to be revalidated
        response.site.customDomain, // siteId
        //@ts-ignore
        response.slug // slugname for the despesa
      );

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Despesa
 *
 * Updates a despesa & all of its data using a collection of provided
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
export async function updateDespesa(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Despesa>> {
  const {
    id,
    name,
    slug,
    valor,
    subdomain,
    customDomain,
    vencimento,
    dataDaCompra,
    empresa,
  } = req.body;

  if (!id || typeof id !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      despesa: {
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
    const despesa = await prisma.despesa.update({
      where: {
        id: id,
      },
      data: {
        name,
        slug,
        valor,
        vencimento,
        dataDaCompra,
        empresa,
      },
    });
    if (subdomain) {
      // revalidate for subdomain
      await revalidate(
        `https://${subdomain}.vercel.pub`, // hostname to be revalidated
        subdomain, // siteId
        slug // slugname for the despesa
      );
    }
    if (customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${customDomain}`, // hostname to be revalidated
        customDomain, // siteId
        slug // slugname for the despesa
      );

    return res.status(200).json(despesa);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
