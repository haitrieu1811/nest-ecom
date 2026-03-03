-- DropIndex
DROP INDEX "VerificationCode_email_code_type_idx";

-- CreateIndex
CREATE INDEX "VerificationCode_email_type_idx" ON "VerificationCode"("email", "type");
