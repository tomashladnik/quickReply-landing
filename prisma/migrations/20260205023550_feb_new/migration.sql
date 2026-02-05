-- DropIndex
DROP INDEX "demo_scan_dentistid_idx";

-- DropIndex
DROP INDEX "demo_scan_patientid_idx";

-- AlterTable
ALTER TABLE "demo_scan" ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "programCode" TEXT;

-- CreateTable
CREATE TABLE "programs" (
    "code" TEXT NOT NULL,
    "intervalDays" INTEGER NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("code")
);
