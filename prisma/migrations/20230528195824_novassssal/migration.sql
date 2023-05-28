/*
  Warnings:

  - You are about to alter the column `refresh_token_expires_in` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `expires_at` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `domainCount` on the `Example` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Example` table. The data in that column will be cast from `BigInt` to `Int`. This cast may fail. Please make sure the data in the column can be cast.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "refresh_token_expires_in" SET DATA TYPE INT4;
ALTER TABLE "Account" ALTER COLUMN "expires_at" SET DATA TYPE INT4;

-- RedefineTables
CREATE TABLE "_prisma_new_Example" (
    "id" INT4 NOT NULL DEFAULT unique_rowid(),
    "name" STRING,
    "description" STRING,
    "domainCount" INT4,
    "url" STRING,
    "image" STRING,
    "imageBlurhash" STRING,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Example" ("description","domainCount","id","image","imageBlurhash","name","url") SELECT "description","domainCount","id","image","imageBlurhash","name","url" FROM "Example";
DROP TABLE "Example" CASCADE;
ALTER TABLE "_prisma_new_Example" RENAME TO "Example";
