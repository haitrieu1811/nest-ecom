-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_languageId_categoryId_unique" ON "CategoryTranslation"("languageId", "categoryId") WHERE "deletedAt" IS NULL;
