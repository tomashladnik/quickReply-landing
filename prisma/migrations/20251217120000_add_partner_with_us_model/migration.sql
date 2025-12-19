-- CreateTable
CREATE TABLE "PartnerWithUs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);