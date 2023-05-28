-- CreateTable
CREATE TABLE "Foto" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "pacienteId" TEXT,

    CONSTRAINT "Foto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Foto" ADD CONSTRAINT "Foto_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
