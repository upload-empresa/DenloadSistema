import prisma from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Estoque, Site } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithSiteEstoque } from '@/types';

interface AllEstoques {
  estoques: Array<Estoque>;
  site: Site | null;
}

/**
 * Get Estoque
 *
 * Fetches & returns either a single or all estoques available depending on
 * whether a `estoqueId` query parameter is provided. If not all estoques are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getEstoque(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllEstoques | (WithSiteEstoque | null)>> {
  const { estoqueId, siteId } = req.query;

  if (Array.isArray(estoqueId) || Array.isArray(siteId) || !session.user.id)
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (estoqueId) {
      const estoque = await prisma.estoque.findFirst({
        where: {
          id: estoqueId,
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

      return res.status(200).json(estoque);
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          id: session.user.id,
        },
      },
    });

    const estoques = !site
      ? []
      : await prisma.estoque.findMany({
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
      estoques,
      site,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Estoques with Search
 *
 * Gets a Estoque from a search input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getEstoquesWithSearch(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Estoque>>> {
  const { search } = req.query;

  if (typeof search !== 'string' || !search.trim() || !session?.user?.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  try {
    const estoques = await prisma.estoque.findMany({
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
      // orderBy: {
      //   createdAt: 'desc',
      // },
    });

    return res.status(200).json(estoques);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Estoques with Select
 *
 * Gets a Estoque from a Select input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getEstoquesWithSelect(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Estoque>>> {
  const { orderBy, siteId } = req.query;

  if ((orderBy !== 'asc' && orderBy !== 'desc') || !session.user.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  if (Array.isArray(siteId) || !session.user.id)
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    const estoques = await prisma.estoque.findMany({
      where: {
        site: {
          id: siteId,
          user: {
            id: session.user.id,
          },
        },
      },
      orderBy: {
        name: orderBy,
      },
    });

    return res.status(200).json(estoques);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Estoque
 *
 * Creates a new Estoque from a provided `siteId` query parameter.
 *
 * Once created, the sites new `EstoqueId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createEstoque(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  estoqueId: string;
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
    const response = await prisma.estoque.create({
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
      estoqueId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Estoque
 *
 * Deletes a Estoque from the database using a provided `EstoqueId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteEstoque(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { estoqueId } = req.query;

  if (!estoqueId || typeof estoqueId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      estoques: {
        some: {
          id: estoqueId,
        },
      },
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end('Site not found');

  try {
    const response = await prisma.estoque.delete({
      where: {
        id: estoqueId,
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
        response.slug // slugname for the estoque
      );
    }
    if (response?.site?.customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${response.site.customDomain}`, // hostname to be revalidated
        response.site.customDomain, // siteId
        //@ts-ignore
        response.slug // slugname for the estoque
      );

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Estoque
 *
 * Updates a Estoque & all of its data using a collection of provided
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
export async function updateEstoque(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Estoque>> {
  const {
    id,
    name,
    validade,
    minimo,
    unidade,
    dataDaCompra,
    valor,
    valorTotal,
    slug,
    pago,
    image,
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
      estoques: {
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
    const estoque = await prisma.estoque.update({
      where: {
        id: id,
      },
      data: {
        name,
        validade,
        minimo,
        unidade,
        dataDaCompra,
        valor,
        valorTotal,
        //@ts-ignore
        pago,
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
        slug // slugname for the estoque
      );
    }
    if (customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${customDomain}`, // hostname to be revalidated
        customDomain, // siteId
        slug // slugname for the estoque
      );

    return res.status(200).json(estoque);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
