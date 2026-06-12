-- CreateTable
CREATE TABLE "Province" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" INTEGER NOT NULL,
    "codeName" VARCHAR(100) NOT NULL,
    "divisionType" VARCHAR(50) NOT NULL,
    "phoneCode" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ward" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" INTEGER NOT NULL,
    "codeName" VARCHAR(100) NOT NULL,
    "divisionType" VARCHAR(50) NOT NULL,
    "shortCodeName" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provinceCode" INTEGER NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Province_code_key" ON "Province"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_code_key" ON "Ward"("code");

-- CreateIndex
CREATE INDEX "Ward_provinceCode_idx" ON "Ward"("provinceCode");

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "Province"("code") ON DELETE CASCADE ON UPDATE CASCADE;
