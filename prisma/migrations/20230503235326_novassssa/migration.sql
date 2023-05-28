-- AlterTable
ALTER TABLE "Anamnese" ADD COLUMN     "pacienteId" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Anamnese" ADD CONSTRAINT "Anamnese_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
