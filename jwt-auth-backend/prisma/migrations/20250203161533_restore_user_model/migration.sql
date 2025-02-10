/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "Space" (
    "id" SERIAL NOT NULL,
    "spaceId" TEXT NOT NULL,
    "occupied" BOOLEAN NOT NULL DEFAULT false,
    "startTime" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Space_spaceId_key" ON "Space"("spaceId");
