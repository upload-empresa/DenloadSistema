-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "pacienteId" TEXT,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
