/*
  Warnings:

  - A unique constraint covering the columns `[id,siteId]` on the table `Agenda` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Agenda" ADD COLUMN     "siteId" TEXT;

-- CreateIndex
CREATE INDEX "Agenda_siteId_idx" ON "Agenda"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Agenda_id_siteId_key" ON "Agenda"("id", "siteId");

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
