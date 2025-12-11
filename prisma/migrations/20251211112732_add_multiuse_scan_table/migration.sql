-- CreateTable
CREATE TABLE "multiuse_scans_demo" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "demo_scan_id" TEXT,
    "patient_name" TEXT,
    "patient_email" TEXT,
    "patient_phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "brightness_score" DECIMAL(10,2),
    "shade_value" TEXT,
    "ideal_shade" TEXT,
    "flow_type" TEXT,
    "simplified_status" TEXT,
    "clinic_recommended" BOOLEAN DEFAULT false,
    "school_level" TEXT,
    "consent_method" TEXT,
    "parent_contact" TEXT,
    "minor_protected" BOOLEAN DEFAULT false,
    "report_delivery_status" TEXT DEFAULT 'pending',
    "original_json" JSONB,
    "status" TEXT DEFAULT 'pending',
    "completed_at" TIMESTAMP(3),
    "result_json" JSONB,

    CONSTRAINT "multiuse_scans_demo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scans_demo_scan_id_idx" ON "multiuse_scans_demo"("demo_scan_id");

-- CreateIndex
CREATE INDEX "scans_flow_type_idx" ON "multiuse_scans_demo"("flow_type");

-- CreateIndex
CREATE INDEX "scans_status_idx" ON "multiuse_scans_demo"("status");

-- CreateIndex
CREATE INDEX "scans_created_at_idx" ON "multiuse_scans_demo"("created_at");

-- CreateIndex
CREATE INDEX "scans_report_delivery_status_idx" ON "multiuse_scans_demo"("report_delivery_status");

-- CreateIndex
CREATE INDEX "scans_school_level_idx" ON "multiuse_scans_demo"("school_level");