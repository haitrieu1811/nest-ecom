/*
  Warnings:

  - A unique constraint covering the columns `[email,code,type]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VerificationCode_code_type_key";

-- DropIndex
DROP INDEX "VerificationCode_email_code_type_idx";

-- DropIndex
DROP INDEX "VerificationCode_email_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_email_code_type_key" ON "VerificationCode"("email", "code", "type");
