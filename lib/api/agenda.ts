import prisma from '@/lib/prisma';
import cuid from 'cuid';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Agenda, Site, Paciente } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithPacienteAgenda } from '@/types';
import { startOfDay } from 'date-fns';

interface AllAgendas {
  agendas: Array<Agenda>;
  site: Site | null;
  paciente: Paciente | null;
}

export async function getAgenda(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllAgendas | (WithPacienteAgenda | null)>> {
  const { agendaId, pacienteId, published, siteId } = req.query;

  if (
    Array.isArray(agendaId) ||
    Array.isArray(pacienteId) ||
    Array.isArray(siteId) ||
    Array.isArray(published) ||
    !session.user.id
  )
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (agendaId) {
      const agenda = await prisma.agenda.findFirst({
        where: {
          id: agendaId,
        },
        include: {
          paciente: true,
        },
      });

      return res.status(200).json(agenda);
    }

    const paciente = await prisma.paciente.findFirst({
      where: {
        id: pacienteId,
      },
    });

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
      },
    });

    const agendas = !site
      ? []
      : await prisma.agenda.findMany({
          where: {
            site: {
              id: siteId,
            },
          },
          include: {
            site: true,
          },
        });

    return res.status(200).json({
      agendas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

export async function getAgendasWithSearch(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllAgendas | (WithPacienteAgenda | null)>> {
  const { agendaId, pacienteId, published, siteId } = req.query;

  if (
    Array.isArray(agendaId) ||
    Array.isArray(pacienteId) ||
    Array.isArray(siteId) ||
    Array.isArray(published) ||
    !session.user.id
  )
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (agendaId) {
      const agenda = await prisma.agenda.findFirst({
        where: {
          id: agendaId,
        },
        include: {
          paciente: true,
        },
      });

      return res.status(200).json(agenda);
    }

    const paciente = await prisma.paciente.findFirst({
      where: {
        id: pacienteId,
      },
    });

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
      },
    });

    const agendas = !site
      ? []
      : await prisma.agenda.findMany({
          where: {
            site: {
              id: siteId,
            },
          },
          include: {
            site: true,
          },
        });

    return res.status(200).json({
      agendas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

//Group By Agenda
// Função da api para contar os registros dos procedimentos dos pacientes

export async function groupByAgenda(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllAgendas | (WithPacienteAgenda | null)>> {
  const { agendaId, pacienteId, published } = req.query;

  if (
    Array.isArray(agendaId) ||
    Array.isArray(pacienteId) ||
    Array.isArray(published) ||
    !session.user.id
  )
    return res.status(400).end('Bad request. Query parameters are not valid.');
  const { procedimento } = req.body;
  try {
    if (agendaId) {
      const agenda = await prisma.agenda.findFirst({
        where: {
          id: agendaId,
        },
        include: {
          paciente: true,
        },
      });

      return res.status(200).json(agenda);
    }

    const paciente = await prisma.paciente.findFirst({
      where: {
        id: pacienteId,
      },
    });

    const agendas = !paciente
      ? []
      : await prisma.agenda.findMany({
          where: {
            paciente: {
              id: pacienteId,
            },
            createdAt: {
              // new Date() creates date with current time and day and etc.
              gte: startOfDay(new Date()),
            },
          },
        });

    // const procedimentosCount = agendas.reduce((count, agenda) => {
    //   const procedimentos = agenda.procedimento || [];
    //   procedimentos.forEach((procedimento) => {
    //     count[procedimento.id] = (count[procedimento.id] || 0) + 1;
    //   });
    //   return count;
    // }, {});

    return res.status(200).json({
      agendas,
      // procedimentosCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Agendas with Select
 *
 * Gets a Agenda from a Select input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getAgendasWithSelect(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Agenda>>> {
  const { orderBy } = req.query;

  if ((orderBy !== 'asc' && orderBy !== 'desc') || !session.user.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  try {
    const agendas = await prisma.agenda.findMany({
      where: {
        site: {
          user: {
            id: session.user.id,
          },
        },
      },
      orderBy: {
        dia: orderBy,
      },
    });

    return res.status(200).json(agendas);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Agenda
 *
 * Creates a new Agenda from a provided `siteId` query parameter and a `pacienteId` payload.
 *
 * Once created, the sites new `AgendaId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
// export async function createAgenda(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse<{
//   agendaId: string;
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
//     const response = await prisma.agenda.create({
//       data: {
//         paciente: {
//           connect: {
//             id: pacienteId,
//           },
//         },
//       },
//     });

//     return res.status(201).json({
//       agendaId: response.id,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).end(error);
//   }
// }

/**
 * Create Agenda
 *
 * Creates a new Agenda from a set of provided query parameters.
 * These include:
 *  - name
 *  - description
 *  - subdomain
 *  - userId
 *
 * Once created, the Agendas new `AgendaId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createAgenda(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  agendaId: string;
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
    const response = await prisma.agenda.create({
      data: {
        paciente: {
          connect: {
            id: pacienteId,
          },
        },
        //@ts-ignore
        pergunta: pergunta,
        resposta: resposta,
      },
    });

    return res.status(201).json({
      agendaId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Agenda
 *
 * Updates a Agenda & all of its data using a collection of provided
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
export async function updateAgenda(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Agenda>> {
  const { id, horario, dia, procedimento, slug } = req.body;

  if (!id || typeof id !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const paciente = await prisma.paciente.findFirst({
    where: {
      agendas: {
        some: {
          id,
        },
      },
    },
  });
  if (!paciente) return res.status(404).end('paciente not found');

  try {
    const agenda = await prisma.agenda.update({
      where: {
        id: id,
      },
      data: {
        horario,
        dia,
        procedimento,
        slug,
      },
    });

    return res.status(200).json(agenda);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Agenda
 *
 * Deletes a agenda from the database using a provided `agendaId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteAgenda(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { agendaId } = req.query;

  if (!agendaId || typeof agendaId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured paciente ID or session ID' });
  }

  const paciente = await prisma.paciente.findFirst({
    where: {
      agendas: {
        some: {
          id: agendaId,
        },
      },
    },
  });
  if (!paciente) return res.status(404).end('paciente not found');

  try {
    const response = await prisma.agenda.delete({
      where: {
        id: agendaId,
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
