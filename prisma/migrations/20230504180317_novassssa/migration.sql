/*
  Warnings:

  - A unique constraint covering the columns `[id,siteId]` on the table `Anamnese` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Anamnese" DROP CONSTRAINT "Anamnese_siteId_fkey";

-- DropIndex
DROP INDEX "Anamnese_id_pacienteId_key";

-- DropIndex
DROP INDEX "Anamnese_pacienteId_idx";

-- CreateIndex
CREATE INDEX "Anamnese_siteId_idx" ON "Anamnese"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Anamnese_id_siteId_key" ON "Anamnese"("id", "siteId");

-- AddForeignKey
ALTER TABLE "Anamnese" ADD CONSTRAINT "Anamnese_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
