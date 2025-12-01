-- CreateTable
CREATE TABLE "DentalLead" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'contact_sales',
    "phone" TEXT,
    "email" TEXT,
    "pagePath" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DentalLead_pkey" PRIMARY KEY ("id")
);
