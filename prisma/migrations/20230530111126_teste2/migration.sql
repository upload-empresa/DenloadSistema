/*
  Warnings:

  - The `horario` column on the `Agenda` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Agenda" DROP COLUMN "horario",
ADD COLUMN     "horario" TIMESTAMP(3);
