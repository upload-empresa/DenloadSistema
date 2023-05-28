import prisma from '@/lib/prisma';
import cuid from 'cuid';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Anamnese, Site, Paciente } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithPacienteAnamnese } from '@/types';

interface AllAnamneses {
  anamneses: Array<Anamnese>;
  site: Site | null;
  paciente: Paciente | null;
}

export async function getAnamnese(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<
  AllAnamneses | (WithPacienteAnamnese | null)
>> {
  const { anamneseId, pacienteId, published } = req.query;

  if (
    Array.isArray(anamneseId) ||
    Array.isArray(pacienteId) ||
    Array.isArray(published) ||
    !session.user.id
  )
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (anamneseId) {
      const anamnese = await prisma.anamnese.findFirst({
        where: {
          id: anamneseId,
        },
        include: {
          paciente: true,
        },
      });

      return res.status(200).json(anamnese);
    }

    const paciente = await prisma.paciente.findFirst({
      where: {
        id: pacienteId,
      },
    });

    const anamneses = !paciente
      ? []
      : await prisma.anamnese.findMany({
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
      anamneses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Anamnese
 *
 * Creates a new Anamnese from a provided `siteId` query parameter and a `pacienteId` payload.
 *
 * Once created, the sites new `AnamneseId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
// export async function createAnamnese(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse<{
//   anamneseId: string;
// }>> {
//   const { pacienteId } = req.query;

//   if (!pacienteId || typeof pacienteId !== 'string') {
//     return res
//       .status(400)
//       .json({ error: 'Missing or misconfigured site ID or session ID' });
//   }

//   const paciente = await prisma.paciente.findFirst({
//     where: {
//       id: pacienteId,
//     },
//   });
//   if (!paciente) return res.status(404).end('paciente not found');

//   try {
//     const response = await prisma.anamnese.create({
//       data: {
//         paciente: {
//           connect: {
//             id: pacienteId,
//           },
//         },
//       },
//     });

//     return res.status(201).json({
//       anamneseId: response.id,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).end(error);
//   }
// }

/**
 * Create Anamnese
 *
 * Creates a new Anamnese from a set of provided query parameters.
 * These include:
 *  - name
 *  - description
 *  - subdomain
 *  - userId
 *
 * Once created, the Anamneses new `AnamneseId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createAnamnese(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  anamneseId: string;
}>> {
  const { pergunta, resposta, description, userId } = req.body;

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
    const response = await prisma.anamnese.create({
      data: {
        paciente: {
          connect: {
            id: pacienteId,
          },
        },
        pergunta: pergunta,
        resposta: resposta,
      },
    });

    return res.status(201).json({
      anamneseId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Anamnese
 *
 * Deletes a anamnese from the database using a provided `anamneseId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteAnamnese(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { anamneseId } = req.query;

  if (!anamneseId || typeof anamneseId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured paciente ID or session ID' });
  }

  const paciente = await prisma.paciente.findFirst({
    where: {
      anamneses: {
        some: {
          id: anamneseId,
        },
      },
    },
  });
  if (!paciente) return res.status(404).end('paciente not found');

  try {
    const response = await prisma.anamnese.delete({
      where: {
        id: anamneseId,
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

/**
 * Update Anamnese
 *
 * Updates a Anamnese & all of its data using a collection of provided
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
export async function updateAnamnese(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Anamnese>> {
  const { id, pergunta, resposta } = req.body;

  if (!id || typeof id !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const paciente = await prisma.paciente.findFirst({
    where: {
      anamneses: {
        some: {
          id,
        },
      },
    },
  });
  if (!paciente) return res.status(404).end('paciente not found');

  try {
    const anamnese = await prisma.anamnese.update({
      where: {
        id: id,
      },
      data: {
        pergunta,
        resposta,
      },
    });

    return res.status(200).json(anamnese);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
