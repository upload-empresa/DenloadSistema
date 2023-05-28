-- CreateTable
CREATE TABLE "Anamneses" (
    "id" TEXT NOT NULL,
    "pergunta" TEXT,
    "resposta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteId" TEXT,
    "pacienteId" TEXT,

    CONSTRAINT "Anamneses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Anamneses_siteId_idx" ON "Anamneses"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Anamneses_id_siteId_key" ON "Anamneses"("id", "siteId");

-- AddForeignKey
ALTER TABLE "Anamneses" ADD CONSTRAINT "Anamneses_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anamneses" ADD CONSTRAINT "Anamneses_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
