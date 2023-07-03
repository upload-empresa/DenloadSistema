import prisma from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { User, Site } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithSiteUser } from '@/types';

interface AllUsers {
  users: Array<User>;
  site: Site | null;
}

/**
 * Get User
 *
 * Fetches & returns either a single or all users available depending on
 * whether a `userId` query parameter is provided. If not all users are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getUser(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllUsers | (WithSiteUser | null)>> {
  const { userId, siteId } = req.query;

  if (Array.isArray(userId) || Array.isArray(siteId) || !session.user.id)
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (userId) {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      return res.status(200).json(user);
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          id: session.user.id,
        },
      },
    });

    const users = !site
      ? []
      : await prisma.user.findMany({
          where: {
            id: userId,
          },
          // orderBy: {
          //   createdAt: 'desc',
          // },
        });

    return res.status(200).json({
      users,
      site,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create User
 *
 * Creates a new user from a provided `siteId` query parameter.
 *
 * Once created, the sites new `userId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createUser(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  userId: string;
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
    const response = await prisma.user.create({
      data: {
        image: `/placeholder.png`,
      },
    });

    return res.status(201).json({
      userId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete User
 *
 * Deletes a user from the database using a provided `userId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end('Site not found');

  try {
    const response = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update user
 *
 * Updates a user & all of its data using a collection of provided
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
export async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<User>> {
  const { id, name, email, username, gh_username } = req.body;

  if (!id || typeof id !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end('Site not found');

  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        username,
        gh_username,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
