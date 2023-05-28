-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "horario" TEXT,
    "dia" TEXT,
    "procedimento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "imageBlurhash" TEXT,
    "pacienteId" TEXT,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
