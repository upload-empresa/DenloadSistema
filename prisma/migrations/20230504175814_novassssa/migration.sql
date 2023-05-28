/*
  Warnings:

  - A unique constraint covering the columns `[id,pacienteId]` on the table `Anamnese` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Anamnese" DROP CONSTRAINT "Anamnese_siteId_fkey";

-- DropIndex
DROP INDEX "Anamnese_id_siteId_key";

-- DropIndex
DROP INDEX "Anamnese_siteId_idx";

-- CreateIndex
CREATE INDEX "Anamnese_pacienteId_idx" ON "Anamnese"("pacienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Anamnese_id_pacienteId_key" ON "Anamnese"("id", "pacienteId");

-- AddForeignKey
ALTER TABLE "Anamnese" ADD CONSTRAINT "Anamnese_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;
