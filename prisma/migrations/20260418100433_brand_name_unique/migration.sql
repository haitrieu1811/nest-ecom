-- This is an empty migration.
CREATE UNIQUE INDEX "Brand_name_unique_active_idx"
ON "Brand" ("name")
WHERE "deletedAt" IS NULL;