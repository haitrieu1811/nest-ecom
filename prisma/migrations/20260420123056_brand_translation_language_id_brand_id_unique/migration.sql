/*
  Warnings:

  - A unique constraint covering the columns `[languageId,brandId]` on the table `BrandTranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "description" VARCHAR(500) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "BrandTranslation_languageId_brandId_key" ON "BrandTranslation"("languageId", "brandId") WHERE "deletedAt" IS NULL;
