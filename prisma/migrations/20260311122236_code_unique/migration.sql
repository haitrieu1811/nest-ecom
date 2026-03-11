/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_code_key" ON "VerificationCode"("code");
