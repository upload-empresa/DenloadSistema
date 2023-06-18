-- CreateEnum
CREATE TYPE "GrupoType" AS ENUM ('Infantil', 'Jovem', 'Adulto', 'Idoso');

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "name" STRING,
    "celular" STRING,
    "endereco" STRING,
    "password" STRING,
    "token" STRING,
    "username" STRING,
    "gh_username" STRING,
    "email" STRING,
    "emailVerified" TIMESTAMP(3),
    "image" STRING,
    "userHasPaid" BOOL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "type" STRING NOT NULL,
    "provider" STRING NOT NULL,
    "providerAccountId" STRING NOT NULL,
    "refresh_token" STRING,
    "refresh_token_expires_in" INT4,
    "access_token" STRING,
    "expires_at" INT4,
    "token_type" STRING,
    "scope" STRING,
    "id_token" STRING,
    "session_state" STRING,
    "oauth_token_secret" STRING,
    "oauth_token" STRING,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" STRING NOT NULL,
    "sessionToken" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" STRING NOT NULL,
    "token" STRING NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" STRING NOT NULL,
    "title" STRING,
    "description" STRING,
    "content" STRING,
    "slug" STRING NOT NULL,
    "image" STRING,
    "imageBlurhash" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOL NOT NULL DEFAULT false,
    "siteId" STRING,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estoque" (
    "id" STRING NOT NULL,
    "name" STRING,
    "slug" STRING,
    "validade" STRING,
    "minimo" STRING,
    "unidade" STRING,
    "vencimento" STRING,
    "dataDaCompra" STRING,
    "valor" STRING,
    "valorTotal" STRING,
    "image" STRING,
    "imageBlurhash" STRING,
    "pago" BOOL NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteId" STRING,

    CONSTRAINT "Estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" STRING,
    "email" STRING,
    "slug" STRING,
    "name" STRING,
    "nota" STRING,
    "image" STRING,
    "imageBlurhash" STRING,
    "siteId" STRING,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" STRING NOT NULL,
    "name" STRING,
    "telefone" STRING,
    "sexo" STRING,
    "observacoes" STRING,
    "anotacoes" STRING,
    "rg" STRING,
    "cpf" STRING,
    "endereco" STRING,
    "cep" STRING,
    "complemento" STRING,
    "email" STRING,
    "grupo" "GrupoType",
    "image" STRING,
    "imageBlurhash" STRING,
    "pago" BOOL NOT NULL DEFAULT false,
    "slug" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteId" STRING,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" STRING NOT NULL,
    "slug" STRING,
    "horario" TIMESTAMP(3),
    "dia" STRING,
    "valor" STRING,
    "procedimento" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" STRING,
    "imageBlurhash" STRING,
    "siteId" STRING,
    "pacienteId" STRING,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anamnese" (
    "id" STRING NOT NULL,
    "slug" STRING,
    "pergunta" STRING,
    "resposta" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" STRING,
    "imageBlurhash" STRING,
    "published" BOOL NOT NULL DEFAULT false,
    "pacienteId" STRING,

    CONSTRAINT "Anamnese_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" STRING NOT NULL,
    "url" STRING,
    "pacienteId" STRING,

    CONSTRAINT "Foto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" STRING NOT NULL,
    "url" STRING,
    "pacienteId" STRING,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" STRING NOT NULL,
    "name" STRING,
    "slug" STRING,
    "valor" STRING,
    "vencimento" STRING,
    "dataDaCompra" STRING,
    "empresa" STRING,
    "pago" BOOL NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteId" STRING,

    CONSTRAINT "Despesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ganho" (
    "id" STRING NOT NULL,
    "name" STRING,
    "slug" STRING,
    "empresa" STRING,
    "valor" STRING,
    "recebimento" STRING,
    "pago" BOOL NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteId" STRING,

    CONSTRAINT "Ganho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" STRING NOT NULL,
    "name" STRING,
    "estado" STRING,
    "cidade" STRING,
    "email" STRING,
    "celular" STRING,
    "description" STRING,
    "logo" STRING,
    "font" STRING NOT NULL DEFAULT 'font-cal',
    "image" STRING,
    "imageBlurhash" STRING,
    "subdomain" STRING,
    "customDomain" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomer" STRING,
    "userId" STRING,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Example" (
    "id" INT4 NOT NULL DEFAULT unique_rowid(),
    "name" STRING,
    "description" STRING,
    "domainCount" INT4,
    "url" STRING,
    "image" STRING,
    "imageBlurhash" STRING,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" STRING NOT NULL,
    "stripeId" STRING,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "subscriptionStatus" BOOL NOT NULL,
    "siteId" STRING,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Post_siteId_idx" ON "Post"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_siteId_key" ON "Post"("id", "siteId");

-- CreateIndex
CREATE INDEX "Estoque_siteId_idx" ON "Estoque"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Estoque_id_siteId_key" ON "Estoque"("id", "siteId");

-- CreateIndex
CREATE INDEX "Feedback_siteId_idx" ON "Feedback"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_id_siteId_key" ON "Feedback"("id", "siteId");

-- CreateIndex
CREATE INDEX "Paciente_siteId_idx" ON "Paciente"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_id_siteId_key" ON "Paciente"("id", "siteId");

-- CreateIndex
CREATE INDEX "Agenda_siteId_idx" ON "Agenda"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Agenda_id_siteId_key" ON "Agenda"("id", "siteId");

-- CreateIndex
CREATE INDEX "Despesa_siteId_idx" ON "Despesa"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Despesa_id_siteId_key" ON "Despesa"("id", "siteId");

-- CreateIndex
CREATE INDEX "Ganho_siteId_idx" ON "Ganho"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Ganho_id_siteId_key" ON "Ganho"("id", "siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_subdomain_key" ON "Site"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "Site_customDomain_key" ON "Site"("customDomain");

-- CreateIndex
CREATE INDEX "Site_userId_idx" ON "Site"("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estoque" ADD CONSTRAINT "Estoque_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anamnese" ADD CONSTRAINT "Anamnese_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Foto" ADD CONSTRAINT "Foto_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ganho" ADD CONSTRAINT "Ganho_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;
