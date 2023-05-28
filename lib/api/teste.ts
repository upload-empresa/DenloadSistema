import { prisma } from '../prisma2';

export const procedimentoCount = async () => {
  return await prisma.author.findMany({
    select: {
      _count: {
        select: {
          ibas: true,
        },
      },
    },
  });
};
