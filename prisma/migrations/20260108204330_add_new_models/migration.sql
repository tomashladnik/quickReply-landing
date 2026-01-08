-- DropForeignKey
ALTER TABLE "demo_scan_link" DROP CONSTRAINT IF EXISTS "demo_scan_link_scanId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "demo_dentist_email_idx";

-- DropIndex
DROP INDEX IF EXISTS "demo_patient_dentistid_idx";

-- DropIndex
DROP INDEX IF EXISTS "demo_scan_dentistid_idx";

-- DropIndex
DROP INDEX IF EXISTS "demo_scan_patientid_idx";

-- DropIndex
DROP INDEX IF EXISTS "demo_scan_link_scanid_idx";

-- AlterTable
ALTER TABLE "PartnerWithUs" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(
    3
);

-- AlterTable
ALTER TABLE "demo_scan_link" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(
    3
), ALTER COLUMN "expiresAt" SET DATA TYPE TIMESTAMP(
    3
);

-- CreateTable
CREATE TABLE "partner_application" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "program" VARCHAR(50) NOT NULL,
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
    CONSTRAINT "partner_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_clinic" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "clinic_name" TEXT NOT NULL,
    "street_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "address_line" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "partner_clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charity_program" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "business_id" UUID NOT NULL,
    "charity_partner_clinic_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "charity_program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charity_program_partner" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "program_id" UUID NOT NULL,
    "clinic_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "charity_program_partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_clinic_coverage" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "clinic_id" UUID NOT NULL,
    "coverage_zip" TEXT,
    "coverage_county" TEXT,
    "coverage_state" TEXT,
    "accepting_new_patients" BOOLEAN NOT NULL DEFAULT TRUE,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "network_clinic_coverage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_partner_application_program" ON "partner_application"("program");

-- CreateIndex
CREATE INDEX "idx_partner_application_status" ON "partner_application"("status");

-- CreateIndex
CREATE INDEX "idx_partner_application_submitted_at" ON "partner_application"("submitted_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "charity_program_business_id_key" ON "charity_program"("business_id");

-- CreateIndex
CREATE INDEX "charity_program_business_id_idx" ON "charity_program"("business_id");

-- CreateIndex
CREATE INDEX "charity_program_charity_partner_clinic_id_idx" ON "charity_program"("charity_partner_clinic_id");

-- CreateIndex
CREATE INDEX "charity_program_partner_program_id_idx" ON "charity_program_partner"("program_id");

-- CreateIndex
CREATE INDEX "charity_program_partner_clinic_id_idx" ON "charity_program_partner"("clinic_id");

-- CreateIndex
CREATE UNIQUE INDEX "charity_program_partner_program_id_clinic_id_key"
  ON "charity_program_partner"("program_id", "clinic_id");

-- CreateIndex
CREATE INDEX "network_clinic_coverage_coverage_zip_idx" ON "network_clinic_coverage"("coverage_zip");

-- CreateIndex
CREATE INDEX "network_clinic_coverage_coverage_county_idx" ON "network_clinic_coverage"("coverage_county");

-- CreateIndex
CREATE INDEX "network_clinic_coverage_coverage_state_idx" ON "network_clinic_coverage"("coverage_state");

-- CreateIndex
CREATE INDEX "network_clinic_coverage_accepting_new_patients_idx"
  ON "network_clinic_coverage"("accepting_new_patients");

-- AddForeignKey
ALTER TABLE "demo_scan_link"
    ADD CONSTRAINT "demo_scan_link_scanId_fkey" FOREIGN KEY (
        "scanId"
    )
        REFERENCES "demo_scan"(
            "id"
        ) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charity_program"
    ADD CONSTRAINT "charity_program_charity_partner_clinic_id_fkey" FOREIGN KEY (
        "charity_partner_clinic_id"
    )
        REFERENCES "partner_clinic"(
            "id"
        ) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charity_program_partner"
    ADD CONSTRAINT "charity_program_partner_program_id_fkey" FOREIGN KEY (
        "program_id"
    )
        REFERENCES "charity_program"(
            "id"
        ) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charity_program_partner"
    ADD CONSTRAINT "charity_program_partner_clinic_id_fkey" FOREIGN KEY (
        "clinic_id"
    )
        REFERENCES "partner_clinic"(
            "id"
        ) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_clinic_coverage"
    ADD CONSTRAINT "network_clinic_coverage_clinic_id_fkey" FOREIGN KEY (
        "clinic_id"
    )
        REFERENCES "partner_clinic"(
            "id"
        ) ON DELETE RESTRICT ON UPDATE CASCADE;