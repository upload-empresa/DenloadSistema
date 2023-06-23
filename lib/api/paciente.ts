import prisma from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Paciente, Site } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithSitePaciente } from '@/types';

interface AllPacientes {
  pacientes: Array<Paciente>;
  site: Site | null;
}

/**
 * Get Paciente
 *
 * Fetches & returns either a single or all pacientes available depending on
 * whether a `pacienteId` query parameter is provided. If not all pacientes are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getPaciente(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllPacientes | (WithSitePaciente | null)>> {
  const { pacienteId, siteId } = req.query;

  if (Array.isArray(pacienteId) || Array.isArray(siteId) || !session.user.id)
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (pacienteId) {
      const paciente = await prisma.paciente.findFirst({
        where: {
          id: pacienteId,
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

      return res.status(200).json(paciente);
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          id: session.user.id,
        },
      },
    });

    const pacientes = !site
      ? []
      : await prisma.paciente.findMany({
          where: {
            site: {
              id: siteId,
            },
          },
          // orderBy: {
          //   createdAt: 'desc',
          // },
        });

    return res.status(200).json({
      pacientes,
      site,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Get Paciente from day
 *
 * Fetches & returns either a single or all pacientes available depending on
 * whether a `pacienteId` query parameter is provided. If not all pacientes are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getPacienteDay(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllPacientes | (WithSitePaciente | null)>> {
  const { pacienteId, siteId } = req.query;

  if (Array.isArray(pacienteId) || Array.isArray(siteId) || !session.user.id)
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    if (pacienteId) {
      const paciente = await prisma.paciente.findFirst({
        where: {
          id: pacienteId,
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

      return res.status(200).json(paciente);
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          id: session.user.id,
        },
      },
    });

    const pacientes = !site
      ? []
      : await prisma.paciente.findMany({
          where: {
            site: {
              id: siteId,
            },
          },
        });

    return res.status(200).json({
      pacientes,
      site,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Pacientes with Search
 *
 * Gets a Paciente from a search input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getPacientesWithSearch(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Paciente>>> {
  const { search, siteId, pacienteId } = req.query;

  if (typeof search !== 'string' || !search.trim() || !session?.user?.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  if (Array.isArray(pacienteId) || Array.isArray(siteId) || !session.user.id)
    return res.status(400).end('Bad request. Query parameters are not valid.');

  try {
    const pacientes = await prisma.paciente.findMany({
      where: {
        site: {
          id: siteId,
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

    return res.status(200).json(pacientes);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Gets Pacientes with Select
 *
 * Gets a Paciente from a Select input in the frontend.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getPacientesWithSelect(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Paciente>>> {
  const { orderBy } = req.query;

  if ((orderBy !== 'asc' && orderBy !== 'desc') || !session.user.id) {
    return res
      .status(400)
      .end('Bad request. Search query parameter is not valid.');
  }

  try {
    const pacientes = await prisma.paciente.findMany({
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

    return res.status(200).json(pacientes);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Get Paciente
 *
 * Fetches & returns either a single or all pacientes available depending on
 * whether a `pacienteId` query parameter is provided. If not all pacientes are
 * returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
// export async function getPacientesWithSearch(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse<Array<Paciente>>> {
//   const { orderBy } = req.query;

//   if (typeof orderBy !== 'string' || !orderBy.trim() || !session?.user?.id) {
//     return res
//       .status(400)
//       .end('Bad request. Search query parameter is not valid.');
//   }

//   try {
//     const pacientes = await prisma.paciente.findMany({
//       where: {
//         site: {
//           user: {
//             id: session.user.id,
//           },
//         },
//       },
//       orderBy: {
//         name: orderBy === 'asc' ? 'asc' : 'desc',
//         // name: 'desc',
//         // createdAt: 'desc',
//       },
//     });

//     return res.status(200).json(pacientes);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).end(error);
//   }
// }

/**
 * Create Paciente
 *
 * Creates a new paciente from a provided `siteId` query parameter.
 *
 * Once created, the sites new `pacienteId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createPaciente(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  pacienteId: string;
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
    const response = await prisma.paciente.create({
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
      pacienteId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Paciente with Anamnese
 *
 * Creates a new paciente from a provided `siteId` query parameter.
 *
 * Once created, the sites new `pacienteId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createPacienteAnamnese(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  pacienteId: string;
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
    const response = await prisma.paciente.create({
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
      pacienteId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Paciente
 *
 * Deletes a paciente from the database using a provided `pacienteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deletePaciente(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { pacienteId } = req.query;

  if (!pacienteId || typeof pacienteId !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      pacientes: {
        some: {
          id: pacienteId,
        },
      },
      user: {
        id: session.user.id,
      },
    },
  });
  if (!site) return res.status(404).end('Site not found');

  try {
    const response = await prisma.paciente.delete({
      where: {
        id: pacienteId,
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
        response.slug // slugname for the paciente
      );
    }
    if (response?.site?.customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${response.site.customDomain}`, // hostname to be revalidated
        response.site.customDomain, // siteId
        //@ts-ignore
        response.slug // slugname for the paciente
      );

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Paciente
 *
 * Updates a paciente & all of its data using a collection of provided
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
export async function updatePaciente(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Paciente>> {
  const {
    id,
    name,
    telefone,
    rg,
    sexo,
    complemento,
    cep,
    endereco,
    anotacoes,
    cpf,
    observacoes,
    grupo,
    email,
    slug,
    image,
    subdomain,
    customDomain,
    pago,
  } = req.body;

  if (!id || typeof id !== 'string' || !session?.user?.id) {
    return res
      .status(400)
      .json({ error: 'Missing or misconfigured site ID or session ID' });
  }

  const site = await prisma.site.findFirst({
    where: {
      pacientes: {
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
    const paciente = await prisma.paciente.update({
      where: {
        id: id,
      },
      data: {
        name,
        telefone,
        rg,
        observacoes,
        sexo,
        complemento,
        anotacoes,
        endereco,
        cep,
        cpf,
        grupo,
        email,
        slug,
        image,
        pago,
        imageBlurhash: (await getBlurDataURL(image)) ?? undefined,
      },
    });
    if (subdomain) {
      // revalidate for subdomain
      await revalidate(
        `https://${subdomain}.vercel.pub`, // hostname to be revalidated
        subdomain, // siteId
        slug // slugname for the paciente
      );
    }
    if (customDomain)
      // revalidate for custom domain
      await revalidate(
        `https://${customDomain}`, // hostname to be revalidated
        customDomain, // siteId
        slug // slugname for the paciente
      );

    return res.status(200).json(paciente);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
