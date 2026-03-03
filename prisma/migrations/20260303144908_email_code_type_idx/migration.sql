-- CreateIndex
CREATE INDEX "VerificationCode_email_code_type_idx" ON "VerificationCode"("email", "code", "type");
