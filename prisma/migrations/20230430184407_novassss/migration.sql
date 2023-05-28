/*
  Warnings:

  - You are about to drop the column `pacienteId` on the `Anamnese` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Anamnese" DROP CONSTRAINT "Anamnese_pacienteId_fkey";

-- AlterTable
ALTER TABLE "Anamnese" DROP COLUMN "pacienteId";
