import prisma from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Foto, Site, Paciente } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithPacienteFoto } from '@/types';

interface AllFotos {
  fotos: Array<Foto>;
  site: Site | null;
  paciente: Paciente | null;
}

export async function getFoto(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllFotos | (WithPacienteFoto | null)>> {
  const { fotoId, pacienteId, published } = req.query;

  if (
    Array.isArray(fotoId) ||
    Array.isArray(pacienteId) ||
    Array.isArray(published) ||
    !session.user.id
  )
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (fotoId) {
      const foto = await prisma.foto.findFirst({
        where: {
          id: fotoId,
        },
        include: {
          paciente: true,
        },
      });

      return res.status(200).json(foto);
    }

    const paciente = await prisma.paciente.findFirst({
      where: {
        id: pacienteId,
      },
    });

    const fotos = !paciente
      ? []
      : await prisma.foto.findMany({
          where: {
            paciente: {
              id: pacienteId,
            },
          },
          include: {
            paciente: true,
          },
        });

    return res.status(200).json({
      fotos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Foto
 *
 * Creates a new Foto from a provided `siteId` query parameter and a `pacienteId` payload.
 *
 * Once created, the sites new `FotoId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createFoto(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  fotoId: string;
}>> {
  const { pacienteId } = req.query;

  if (!pacienteId || typeof pacienteId !== 'string') {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const paciente = await prisma.paciente.findFirst({
    where: {
      id: pacienteId,
    },
  });
  if (!paciente) return res.status(404).end('paciente not found');

  try {
    const response = await prisma.foto.create({
      data: {
        paciente: {
          connect: {
            id: pacienteId,
          },
        },
      },
    });

    return res.status(201).json({
      fotoId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Foto
 *
 * Updates a Foto & all of its data using a collection of provided
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
export async function updateFoto(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Foto>> {
  const { id, url, resposta } = req.body;

  if (!id || typeof id !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const paciente = await prisma.paciente.findFirst({
    where: {
      fotos: {
        some: {
          id,
        },
      },
    },
  });
  if (!paciente) return res.status(404).end('paciente not found');

  try {
    const foto = await prisma.foto.update({
      where: {
        id: id,
      },
      data: {
        url,
      },
    });

    return res.status(200).json(foto);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Foto
 *
 * Deletes a Foto from the database using a provided `FotoId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteFoto(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { fotoId } = req.query;

  if (!fotoId || typeof fotoId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured paciente ID or session ID' });
  }

  const paciente = await prisma.paciente.findFirst({
    where: {
      fotos: {
        some: {
          id: fotoId,
        },
      },
    },
  });
  if (!paciente) return res.status(404).end('paciente not found');

  try {
    const response = await prisma.foto.delete({
      where: {
        id: fotoId,
      },
      include: {
        paciente: true,
      },
    });

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
