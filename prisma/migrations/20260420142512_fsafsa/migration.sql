-- RenameIndex
ALTER INDEX "ProductTranslation_languageId_productId_unique" RENAME TO "ProductTranslation_languageId_productId_key";

-- RenameIndex
ALTER INDEX "SKU_value_productId_unique" RENAME TO "SKU_value_productId_key";
