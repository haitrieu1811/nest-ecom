/*
  Warnings:

  - A unique constraint covering the columns `[email,type]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "VerificationCodeType" ADD VALUE 'LOGIN';
ALTER TYPE "VerificationCodeType" ADD VALUE 'DISABLE_2FA';

-- DropIndex
DROP INDEX "VerificationCode_email_code_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_email_type_key" ON "VerificationCode"("email", "type");
