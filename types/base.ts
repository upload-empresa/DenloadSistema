import type { Prisma } from '@prisma/client';

export type ApiError = {
  code?: string;
  message: string;
  values: { [key: string]: string };
};

export type ApiResponse<T = unknown> = {
  data: T | null;
  error: ApiError | null;
};

export type AnamneseCount = Prisma.AnamneseGetPayload<{
  select: {
    id: true;
    slug: true;
    pergunta: true;
    resposta: true;
    createdAt: true;
    updatedAt: true;
    image: true;
    imageBlurhash: true;
    published: true;
  };
}>;
