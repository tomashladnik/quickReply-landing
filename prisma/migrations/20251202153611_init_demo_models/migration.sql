
-- CreateTable
CREATE TABLE "demo_dentist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demo_dentist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dentistId" TEXT NOT NULL,

    CONSTRAINT "demo_patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_scan" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'link_sent',
    "imageUrls" JSONB,
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "dentistId" TEXT,
    "patientId" TEXT,

    CONSTRAINT "demo_scan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "demo_patient" ADD CONSTRAINT "demo_patient_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "demo_dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_scan" ADD CONSTRAINT "demo_scan_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "demo_dentist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_scan" ADD CONSTRAINT "demo_scan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "demo_patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
