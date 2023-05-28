import prisma from '@/lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { Documento, Site, Paciente } from '.prisma/client';
import type { Session } from 'next-auth';
import { revalidate } from '@/lib/revalidate';
import { getBlurDataURL, placeholderBlurhash } from '@/lib/utils';

import type { WithPacienteDocumento } from '@/types';

interface AllDocumentos {
    documentos: Array<Documento>;
    site: Site | null;
    paciente: Paciente | null;
}

export async function getDocumento(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<AllDocumentos | (WithPacienteDocumento | null)>> {
    const { documentoId, pacienteId, published } = req.query;

    if (
        Array.isArray(documentoId) ||
        Array.isArray(pacienteId) ||
        Array.isArray(published) ||
        !session.user.id
    )
        return res.status(400).end('Bad request. Query parameters are not valid.');

    try {
        if (documentoId) {
            const documento = await prisma.documento.findFirst({
                where: {
                    id: documentoId,
                },
                include: {
                    paciente: true,
                },
            });

            return res.status(200).json(documento);
        }

        const paciente = await prisma.paciente.findFirst({
            where: {
                id: pacienteId,
            },
        });

        const documentos = !paciente
            ? []
            : await prisma.documento.findMany({
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
            documentos,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}

/**
 * Create Documento
 *
 * Creates a new Documento from a provided `siteId` query parameter and a `pacienteId` payload.
 *
 * Once created, the sites new `DocumentoId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createDocumento(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<{
    documentoId: string;
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
        const response = await prisma.documento.create({
            data: {
                paciente: {
                    connect: {
                        id: pacienteId,
                    },
                },
            },
        });

        return res.status(201).json({
            documentoId: response.id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}

/**
 * Update Documento
 *
 * Updates a Documento & all of its data using a collection of provided
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
export async function updateDocumento(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
): Promise<void | NextApiResponse<Documento>> {
    const { id, url, resposta } = req.body;

    if (!id || typeof id !== 'string' || !session?.user?.id) {
        return res
            .status(400)
            .json({ error: 'Missing or misconfigured site ID or session ID' });
    }

    const paciente = await prisma.paciente.findFirst({
        where: {
            documentos: {
                some: {
                    id,
                },
            },
        },
    });
    if (!paciente) return res.status(404).end('paciente not found');

    try {
        const documento = await prisma.documento.update({
            where: {
                id: id,
            },
            data: {
                url,
            },
        });

        return res.status(200).json(documento);
    } catch (error) {
        console.error(error);
        return res.status(500).end(error);
    }
}
