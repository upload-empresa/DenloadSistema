/*
  Warnings:

  - You are about to drop the `Anamneses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Anamneses" DROP CONSTRAINT "Anamneses_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "Anamneses" DROP CONSTRAINT "Anamneses_siteId_fkey";

-- DropTable
DROP TABLE "Anamneses";

-- CreateTable
CREATE TABLE "Anamnese" (
    "id" TEXT NOT NULL,
    "pergunta" TEXT,
    "resposta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteId" TEXT,
    "pacienteId" TEXT,

    CONSTRAINT "Anamnese_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Anamnese_siteId_idx" ON "Anamnese"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Anamnese_id_siteId_key" ON "Anamnese"("id", "siteId");

-- AddForeignKey
ALTER TABLE "Anamnese" ADD CONSTRAINT "Anamnese_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anamnese" ADD CONSTRAINT "Anamnese_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
