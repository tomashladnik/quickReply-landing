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

-- CreateTable
CREATE TABLE "school" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schoolId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_scan" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "resultCategory" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_scan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "demo_scan_link_code_key" ON "demo_scan_link"("code");

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");

-- AddForeignKey
ALTER TABLE "demo_patient" ADD CONSTRAINT "demo_patient_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "demo_dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_scan" ADD CONSTRAINT "demo_scan_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "demo_dentist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_scan" ADD CONSTRAINT "demo_scan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "demo_patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_scan_link" ADD CONSTRAINT "demo_scan_link_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "demo_scan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_scan" ADD CONSTRAINT "student_scan_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
