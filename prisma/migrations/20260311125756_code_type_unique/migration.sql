/*
  Warnings:

  - A unique constraint covering the columns `[code,type]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VerificationCode_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_code_type_key" ON "VerificationCode"("code", "type");
