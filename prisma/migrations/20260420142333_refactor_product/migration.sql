/*
  Warnings:

  - You are about to drop the column `images` on the `SKU` table. All the data in the column will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VariantOption` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[languageId,productId]` on the table `ProductTranslation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value,productId]` on the table `SKU` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variants` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `SKU` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "VariantOption" DROP CONSTRAINT "VariantOption_createdById_fkey";

-- DropForeignKey
ALTER TABLE "VariantOption" DROP CONSTRAINT "VariantOption_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "VariantOption" DROP CONSTRAINT "VariantOption_variantId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "name" VARCHAR(500) NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "variants" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "SKU" DROP COLUMN "images",
ADD COLUMN     "image" TEXT NOT NULL;

-- DropTable
DROP TABLE "Variant";

-- DropTable
DROP TABLE "VariantOption";

-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_languageId_productId_unique" ON "ProductTranslation"("languageId", "productId") WHERE "deletedAt" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SKU_value_productId_unique" ON "SKU"("value", "productId") WHERE "deletedAt" IS NULL;
