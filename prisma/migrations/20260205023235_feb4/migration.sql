/*
  Warnings:

  - A unique constraint covering the columns `[stripeCheckoutSessionId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Service" AS ENUM ('ReplyQuick', 'DentalScan');

-- DropForeignKey
ALTER TABLE "demo_scan_link" DROP CONSTRAINT "demo_scan_link_scanId_fkey";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "city" TEXT;

-- AlterTable
ALTER TABLE "demo_scan_link" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "expiresAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "service" "Service" NOT NULL DEFAULT 'ReplyQuick',
ADD COLUMN     "stripeCheckoutSessionId" TEXT,
ADD COLUMN     "stripeProductId" TEXT,
ADD COLUMN     "stripeSubscriptionItemId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "service" "Service" NOT NULL DEFAULT 'ReplyQuick';

-- CreateTable
CREATE TABLE "BusinessPricing" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "pricePerScan" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DentalPricingTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minScans" INTEGER NOT NULL,
    "maxScans" INTEGER,
    "pricePerScan" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DentalPricingTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerWithUs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerWithUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dentist_application" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" VARCHAR(50) DEFAULT 'new',
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "organization" VARCHAR(255),
    "street_address" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(50),
    "zip_code" VARCHAR(20),
    "country" VARCHAR(100) DEFAULT 'USA',
    "notes" TEXT DEFAULT '',
    "decision_path" VARCHAR(50) DEFAULT '',
    "payload" JSONB,
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "payment_per_scan" INTEGER NOT NULL DEFAULT 700,
    "setup_link_sent_at" TIMESTAMP(3),
    "stripe_account_id" TEXT,
    "stripe_status" TEXT NOT NULL,
    "size" VARCHAR(20),

    CONSTRAINT "dentist_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_usage_events" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "stripeSubscriptionItemId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "stripeUsageRecordId" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_usage_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessPricing_businessId_key" ON "BusinessPricing"("businessId");

-- CreateIndex
CREATE INDEX "BusinessPricing_businessId_idx" ON "BusinessPricing"("businessId");

-- CreateIndex
CREATE INDEX "idx_dentist_application_status" ON "dentist_application"("status");

-- CreateIndex
CREATE INDEX "idx_dentist_application_stripe_account_id" ON "dentist_application"("stripe_account_id");

-- CreateIndex
CREATE INDEX "idx_dentist_application_submitted_at" ON "dentist_application"("submitted_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "scan_usage_events_scanId_key" ON "scan_usage_events"("scanId");

-- CreateIndex
CREATE INDEX "scan_usage_events_businessId_recordedAt_idx" ON "scan_usage_events"("businessId", "recordedAt");

-- CreateIndex
CREATE INDEX "scan_usage_events_userId_recordedAt_idx" ON "scan_usage_events"("userId", "recordedAt");

-- CreateIndex
CREATE INDEX "demo_dentist_email_idx" ON "demo_dentist"("email");

-- CreateIndex
CREATE INDEX "demo_patient_dentistid_idx" ON "demo_patient"("dentistId");

-- CreateIndex
CREATE INDEX "demo_scan_dentistid_idx" ON "demo_scan"("dentistId");

-- CreateIndex
CREATE INDEX "demo_scan_patientid_idx" ON "demo_scan"("patientId");

-- CreateIndex
CREATE INDEX "demo_scan_link_scanid_idx" ON "demo_scan_link"("scanId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeCheckoutSessionId_key" ON "subscriptions"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "subscriptions_service_status_idx" ON "subscriptions"("service", "status");

-- AddForeignKey
ALTER TABLE "demo_scan_link" ADD CONSTRAINT "demo_scan_link_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "demo_scan"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BusinessPricing" ADD CONSTRAINT "BusinessPricing_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
