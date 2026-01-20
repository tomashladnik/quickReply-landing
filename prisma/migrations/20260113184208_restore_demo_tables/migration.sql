-- Restore demo tables (safe/idempotent)

CREATE TABLE IF NOT EXISTS "demo_dentist" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "demo_patient" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dentistId" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "demo_scan" (
  "id" TEXT PRIMARY KEY,
  "status" TEXT NOT NULL DEFAULT 'link_sent',
  "imageUrls" JSONB,
  "result" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "submittedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "dentistId" TEXT,
  "patientId" TEXT
);

CREATE TABLE IF NOT EXISTS "demo_scan_link" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL,
  "scanId" TEXT NOT NULL,
  "dentistId" TEXT,
  "patientId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3)
);

-- Unique index for code (create only if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'demo_scan_link_code_key'
  ) THEN
    CREATE UNIQUE INDEX "demo_scan_link_code_key" ON "demo_scan_link" ("code");
  END IF;
END
$$;

-- Foreign keys (add only if missing)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'demo_patient_dentistId_fkey') THEN
    ALTER TABLE "demo_patient"
      ADD CONSTRAINT "demo_patient_dentistId_fkey"
      FOREIGN KEY ("dentistId") REFERENCES "demo_dentist"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'demo_scan_dentistId_fkey') THEN
    ALTER TABLE "demo_scan"
      ADD CONSTRAINT "demo_scan_dentistId_fkey"
      FOREIGN KEY ("dentistId") REFERENCES "demo_dentist"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'demo_scan_patientId_fkey') THEN
    ALTER TABLE "demo_scan"
      ADD CONSTRAINT "demo_scan_patientId_fkey"
      FOREIGN KEY ("patientId") REFERENCES "demo_patient"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'demo_scan_link_scanId_fkey') THEN
    ALTER TABLE "demo_scan_link"
      ADD CONSTRAINT "demo_scan_link_scanId_fkey"
      FOREIGN KEY ("scanId") REFERENCES "demo_scan"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END
$$;
