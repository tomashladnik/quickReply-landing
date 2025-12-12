/*
  Warnings:

  - A unique constraint covering the columns `[shortCode]` on the table `multiuse_scans_demo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "multiuse_scans_demo" ADD COLUMN     "shortCode" TEXT,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- CreateTable
CREATE TABLE "demo_scan_link" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "dentistId" TEXT,
    "patientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "demo_scan_link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "demo_scan_link_code_key" ON "demo_scan_link"("code");

-- CreateIndex
CREATE UNIQUE INDEX "multiuse_scans_demo_shortCode_key" ON "multiuse_scans_demo"("shortCode");

-- AddForeignKey
ALTER TABLE "demo_scan_link" ADD CONSTRAINT "demo_scan_link_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "demo_scan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
