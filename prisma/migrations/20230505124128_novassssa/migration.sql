/*
  Warnings:

  - You are about to drop the column `siteId` on the `Anamnese` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Anamnese" DROP CONSTRAINT "Anamnese_siteId_fkey";

-- DropIndex
DROP INDEX "Anamnese_id_siteId_key";

-- DropIndex
DROP INDEX "Anamnese_siteId_idx";

-- AlterTable
ALTER TABLE "Anamnese" DROP COLUMN "siteId";
