/*
  Warnings:

  - You are about to drop the `PartnerWithUs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `demo_dentist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `demo_patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `demo_scan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `demo_scan_link` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('ON_FILE', 'PENDING', 'EXPIRED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "ConsentTemplateScope" AS ENUM ('GLOBAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "DataExportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ImportJobRowStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ImportJobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ImportJobType" AS ENUM ('PATIENT_PMS_IMPORT');

-- CreateEnum
CREATE TYPE "InsuranceRelation" AS ENUM ('SELF', 'SPOUSE', 'CHILD', 'OTHER');

-- CreateEnum
CREATE TYPE "InsuranceSource" AS ENUM ('OFFICE', 'PATIENT');

-- CreateEnum
CREATE TYPE "InsuranceStatus" AS ENUM ('PENDING_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InvoicePaymentMethod" AS ENUM ('CASH', 'EXTERNAL_PORTAL', 'STRIPE', 'OTHER');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED', 'VOID');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('OOP', 'PLAN', 'COPAY');

-- CreateEnum
CREATE TYPE "JurisdictionAgreementStatus" AS ENUM ('PENDING', 'SIGNED', 'EXPIRED', 'REVOKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LegalTemplateType" AS ENUM ('BAA', 'DPA', 'ADDENDUM', 'TELEHEALTH');

-- CreateEnum
CREATE TYPE "PaymentPreference" AS ENUM ('INSURANCE', 'OUT_OF_POCKET');

-- CreateEnum
CREATE TYPE "ScanCadence" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'PAUSED');

-- CreateEnum
CREATE TYPE "ScanFormMode" AS ENUM ('SILENT', 'MINIMAL', 'FULL');

-- CreateEnum
CREATE TYPE "ScanInputType" AS ENUM ('XRAY', 'PHOTO', 'INTRAORAL');

-- CreateEnum
CREATE TYPE "ScanJobStatus" AS ENUM ('SCHEDULED', 'SENT', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ScanJobType" AS ENUM ('SEND_LINK');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PROCESSING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'TRANSGENDER', 'NON_BINARY', 'OTHER', 'UNKNOWN', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "SubmissionSource" AS ENUM ('PATIENT', 'GUARDIAN', 'CLINIC', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "VerificationSource" AS ENUM ('CLEARINGHOUSE', 'MANUAL', 'NONE');

-- DropForeignKey
ALTER TABLE "demo_patient" DROP CONSTRAINT "demo_patient_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "demo_scan" DROP CONSTRAINT "demo_scan_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "demo_scan" DROP CONSTRAINT "demo_scan_patientId_fkey";

-- DropForeignKey
ALTER TABLE "demo_scan_link" DROP CONSTRAINT "demo_scan_link_scanId_fkey";

-- DropTable
DROP TABLE "PartnerWithUs";

-- DropTable
DROP TABLE "demo_dentist";

-- DropTable
DROP TABLE "demo_patient";

-- DropTable
DROP TABLE "demo_scan";

-- DropTable
DROP TABLE "demo_scan_link";

-- CreateTable
CREATE TABLE "A2PBrand" (
    "id" TEXT NOT NULL,
    "brandSid" TEXT NOT NULL,
    "userId" TEXT,
    "companyName" TEXT,
    "status" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "A2PBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "A2PCampaign" (
    "id" TEXT NOT NULL,
    "campaignSid" TEXT NOT NULL,
    "brandSid" TEXT,
    "brandRefId" TEXT,
    "userId" TEXT,
    "usecase" TEXT,
    "status" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "A2PCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "A2PNumberRegistration" (
    "id" TEXT NOT NULL,
    "numberSid" TEXT NOT NULL,
    "e164" TEXT,
    "phoneNumberId" UUID,
    "campaignSid" TEXT,
    "campaignRefId" TEXT,
    "userId" TEXT,
    "status" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "A2PNumberRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "API_KEY" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR(32) NOT NULL,

    CONSTRAINT "API_KEY_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "voice_id" TEXT,
    "timezone" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "SMSBackup" BOOLEAN,
    "fallbackTemplate" TEXT,
    "followupDelay" INTEGER,
    "transferToHuman" BOOLEAN,
    "fallbackToVoicemail" BOOLEAN,
    "optOutLogic" BOOLEAN,
    "personality" TEXT NOT NULL,
    "responseSpeed" INTEGER NOT NULL,
    "smsScript" TEXT,

    CONSTRAINT "AgentDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "textCampaignId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "businessId" TEXT NOT NULL,
    "userId" TEXT,
    "actorType" TEXT NOT NULL,
    "userDisplayName" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "entityLabel" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "summary" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT,
    "industry" TEXT,
    "address" TEXT,
    "zipCode" TEXT,
    "source" TEXT,
    "description" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "state" TEXT,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "agentId" TEXT,
    "contactId" TEXT,
    "callSid" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "updateTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "direction" TEXT NOT NULL DEFAULT 'outbound',
    "cost" DOUBLE PRECISION,
    "transcriptText" TEXT,
    "summary" TEXT,
    "userSentiment" TEXT,
    "qualification" TEXT,
    "recordingUrl" TEXT,
    "publicLogUrl" TEXT,
    "disconnectionReason" TEXT,
    "outcome" TEXT,
    "fromNumber" TEXT NOT NULL,
    "toNumber" TEXT NOT NULL,
    "agentName" TEXT,
    "contactName" TEXT,
    "userId" TEXT,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scope" "ConsentTemplateScope" NOT NULL DEFAULT 'GLOBAL',
    "businessId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentTemplateVersion" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT,

    CONSTRAINT "ConsentTemplateVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataExportRequest" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "status" "DataExportStatus" NOT NULL DEFAULT 'PENDING',
    "exportPath" TEXT,
    "fileHash" TEXT,
    "region" TEXT,
    "legalBasis" TEXT,
    "exportType" TEXT,
    "originIp" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "DataExportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUpTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUpTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrequentlySentContact" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "FrequentlySentContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrequentlySentGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FrequentlySentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "scope" TEXT,
    "tokenType" TEXT,
    "expiryDate" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportJob" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ImportJobType" NOT NULL DEFAULT 'PATIENT_PMS_IMPORT',
    "status" "ImportJobStatus" NOT NULL DEFAULT 'PENDING',
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "processedRows" INTEGER NOT NULL DEFAULT 0,
    "failedRows" INTEGER NOT NULL DEFAULT 0,
    "parseErrors" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportJobRow" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "status" "ImportJobRowStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportJobRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insurance" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "payerName" TEXT NOT NULL,
    "payerId" TEXT,
    "planName" TEXT,
    "memberId_enc" TEXT NOT NULL,
    "memberId_hash" TEXT NOT NULL,
    "groupNumber_enc" TEXT,
    "groupNumber_hash" TEXT,
    "subscriberName" TEXT,
    "subscriberDOB" TIMESTAMP(3),
    "relationshipToSubscriber" "InsuranceRelation",
    "employer" TEXT,
    "coverageStart" TIMESTAMP(3),
    "coverageEnd" TIMESTAMP(3),
    "status" "InsuranceStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "source" "InsuranceSource" NOT NULL DEFAULT 'OFFICE',
    "verificationSource" "VerificationSource" DEFAULT 'CLEARINGHOUSE',
    "verificationStatus" TEXT,
    "verificationRef" TEXT,
    "verificationPayload" JSONB,
    "verificationError" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "lastCheckedAt" TIMESTAMP(3),
    "verifyAttemptCount" INTEGER NOT NULL DEFAULT 0,
    "nextVerifyAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdByUserId" TEXT,
    "reviewedByUserId" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "scanId" TEXT,
    "scanLinkId" TEXT,
    "type" "InvoiceType" NOT NULL DEFAULT 'OOP',
    "amountDue" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "externalRef" TEXT,
    "notes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLine" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "cdtCode" TEXT,
    "description" TEXT NOT NULL,
    "tooth" TEXT,
    "surfaces" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "InvoiceLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoicePayment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "method" "InvoicePaymentMethod" NOT NULL,
    "externalTxnId" TEXT,
    "stripePaymentIntentId" TEXT,
    "amount" INTEGER NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PAID',
    "paidAt" TIMESTAMP(3),
    "receiptUrl" TEXT,

    CONSTRAINT "InvoicePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceTemplateSetting" (
    "businessId" TEXT NOT NULL,
    "template" JSONB NOT NULL,
    "logoPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceTemplateSetting_pkey" PRIMARY KEY ("businessId")
);

-- CreateTable
CREATE TABLE "JurisdictionAgreement" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "status" "JurisdictionAgreementStatus" NOT NULL DEFAULT 'PENDING',
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL,
    "renderedBody" TEXT NOT NULL,
    "unsignedPdfPath" TEXT,
    "signedPdfPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signedAt" TIMESTAMP(3),
    "effectiveDate" TIMESTAMP(3),
    "signedByUserId" TEXT,
    "signedByName" TEXT,
    "signedByEmail" TEXT,
    "signerTitle" TEXT,
    "documentHash" TEXT,

    CONSTRAINT "JurisdictionAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurisdictionTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "country" TEXT,
    "state" TEXT,
    "region" TEXT,
    "templateType" "LegalTemplateType" NOT NULL DEFAULT 'BAA',
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "body" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JurisdictionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListContact" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "ListContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "scanCadence" "ScanCadence" NOT NULL DEFAULT 'MONTHLY',
    "scanCadenceReason" TEXT,
    "scanCadenceUpdatedAt" TIMESTAMP(3),
    "consentVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dob" TIMESTAMP(3),
    "sex" "Sex",
    "consentStatus" "ConsentStatus" DEFAULT 'PENDING',
    "consentDate" TIMESTAMP(3),
    "consentFileUrl" TEXT,
    "consentCollectedBy" TEXT,
    "consentCollectedAt" TIMESTAMP(3),
    "auditReference" TEXT,
    "clinicLocation" TEXT,
    "treatingProvider" TEXT,
    "languagePreference" TEXT,
    "timezone" TEXT,
    "guardianName" TEXT,
    "guardianRelationship" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientConsent" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateVersionId" TEXT NOT NULL,
    "status" "ConsentStatus" NOT NULL DEFAULT 'ON_FILE',
    "signedFullName" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL,
    "signedByUserId" TEXT,
    "signedIp" TEXT,
    "signedUserAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "npi" TEXT,
    "tin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderConfig" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "primaryProvider" TEXT NOT NULL DEFAULT 'twilio',
    "backupProvider" TEXT,
    "regionPreferences" JSONB,

    CONSTRAINT "ProviderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "scanLinkId" TEXT,
    "status" "ScanStatus" NOT NULL DEFAULT 'SUBMITTED',
    "filePath" TEXT,
    "imageUrl" TEXT,
    "inputType" "ScanInputType",
    "source" TEXT,
    "notes" TEXT,
    "qualityScore" DOUBLE PRECISION,
    "submittedBy" "SubmissionSource",
    "metadata" JSONB,
    "patientConsentAt" TIMESTAMP(3),
    "patientConsentVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "paymentPreference" "PaymentPreference",

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanJob" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "scanLinkId" TEXT NOT NULL,
    "type" "ScanJobType" NOT NULL DEFAULT 'SEND_LINK',
    "status" "ScanJobStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledSendAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScanJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanLink" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "patientId" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'dental_scan',
    "tokenHash" TEXT NOT NULL,
    "formMode" "ScanFormMode" NOT NULL DEFAULT 'SILENT',
    "intendedChannel" TEXT NOT NULL,
    "intendedContact" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "prefillFirstName" TEXT,
    "prefillLastName" TEXT,
    "prefillFullName" TEXT,
    "prefillEmail" TEXT,
    "prefillPhone" TEXT,
    "prefillDob" TIMESTAMP(3),
    "prefillSex" "Sex",
    "prefillPayerName" TEXT,
    "prefillMemberId" TEXT,
    "paymentPreference" "PaymentPreference",

    CONSTRAINT "ScanLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanRequest" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "scanLinkId" TEXT,
    "dueBy" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "sentAt" TIMESTAMP(3),
    "completedScanId" TEXT,
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remindersSent" INTEGER NOT NULL DEFAULT 0,
    "maxReminders" INTEGER NOT NULL DEFAULT 3,
    "lastResendAt" TIMESTAMP(3),

    CONSTRAINT "ScanRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanResult" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "findings" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION,
    "recommendations" JSONB,
    "overlayImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanShortLink" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdByUserId" TEXT,

    CONSTRAINT "ScanShortLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanSubscription" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "cadence" "ScanCadence" NOT NULL DEFAULT 'MONTHLY',
    "deliverVia" TEXT NOT NULL DEFAULT 'sms',
    "preferredHour" INTEGER NOT NULL DEFAULT 10,
    "quietHours" JSONB,
    "nextSendAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3),
    "lastCompletedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "retryIntervalHours" INTEGER NOT NULL DEFAULT 24,
    "retryAttempts" INTEGER NOT NULL DEFAULT 0,
    "maxRetryAttempts" INTEGER NOT NULL DEFAULT 3,
    "lastRetryAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lockedAt" TIMESTAMP(3),

    CONSTRAINT "ScanSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextCampaign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "optOutLink" BOOLEAN NOT NULL DEFAULT true,
    "sendDate" TIMESTAMP(3),
    "timeZone" TEXT,
    "senderNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextCampaignContact" (
    "id" TEXT NOT NULL,
    "textCampaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "lastActivity" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextCampaignContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextCampaignContactFollowUp" (
    "id" TEXT NOT NULL,
    "textCampaignContactId" TEXT NOT NULL,
    "textCampaignFollowUpId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "TextCampaignContactFollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextCampaignFollowUp" (
    "id" TEXT NOT NULL,
    "textCampaignId" TEXT NOT NULL,
    "delayMinutes" INTEGER NOT NULL,
    "followupTemplate" TEXT,
    "stopIfReplied" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TextCampaignFollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextCampaignTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextCampaignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialKey" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "valueHash" TEXT NOT NULL,
    "firstUsedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "times" INTEGER NOT NULL DEFAULT 0,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrialKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwilioA2PEventLog" (
    "id" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" TEXT,
    "status" TEXT,
    "accountSid" TEXT,
    "schemaVersion" TEXT,
    "brandSid" TEXT,
    "campaignSid" TEXT,
    "numberSid" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "payload" JSONB,

    CONSTRAINT "TwilioA2PEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCredential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "calendarTokens" TEXT,

    CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "llmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "voice_id" TEXT NOT NULL,
    "timezone" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "SMSBackup" BOOLEAN,
    "fallbackTemplate" TEXT,
    "followupDelay" INTEGER,
    "transferToHuman" BOOLEAN,
    "fallbackToVoicemail" BOOLEAN,
    "optOutLogic" BOOLEAN,
    "personality" TEXT NOT NULL,
    "responseSpeed" INTEGER NOT NULL,
    "generalTools" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "smsScript" TEXT,
    "paused" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_messaging_services" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "serviceSid" TEXT,
    "campaignSid" TEXT,
    "status" TEXT,
    "lastEventType" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_messaging_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_phone_numbers" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "twilioSid" TEXT,
    "accountSid" TEXT,
    "friendlyName" TEXT,
    "voiceUrl" TEXT,
    "smsUrl" TEXT,
    "statusCallback" TEXT,
    "apiVersion" TEXT,
    "uri" TEXT,
    "messagingServiceSid" TEXT,
    "campaignSid" TEXT,
    "capabilities" JSONB,
    "provider" TEXT NOT NULL DEFAULT 'twilio',
    "providerId" TEXT,
    "providerMetadata" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_phone_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_profiles" (
    "userId" TEXT NOT NULL,
    "businessName" TEXT,
    "businessWebsite" TEXT,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "campaign_contacts" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "callAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastActivity" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "type" TEXT NOT NULL DEFAULT 'call',
    "targetAudience" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charity_scans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "short_code" VARCHAR(32) NOT NULL,
    "business_id" UUID,
    "patient_name" TEXT NOT NULL,
    "patient_email" TEXT,
    "patient_phone" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "is_minor" BOOLEAN NOT NULL DEFAULT false,
    "guardian_name" TEXT,
    "guardian_relationship" TEXT,
    "guardian_consent_given" BOOLEAN NOT NULL DEFAULT false,
    "guardian_consent_timestamp" TIMESTAMP(3),
    "guardian_ip_address" TEXT,
    "guardian_user_agent" TEXT,
    "consent_method" TEXT,
    "non_diagnostic_acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "screening_consent_given" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "brightness_score" DECIMAL(10,2),
    "shade_value" TEXT,
    "ideal_shade" TEXT,
    "status" TEXT DEFAULT 'pending',
    "simplified_status" TEXT,
    "clinic_recommended" BOOLEAN NOT NULL DEFAULT false,
    "care_priority_score" TEXT,
    "original_json" JSONB,
    "result_json" JSONB,

    CONSTRAINT "charity_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "Name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "category" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employer_scans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "short_code" VARCHAR(32) NOT NULL,
    "business_id" UUID,
    "patient_name" TEXT NOT NULL,
    "patient_email" TEXT,
    "patient_phone" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "status" TEXT DEFAULT 'pending',
    "simplified_status" TEXT,
    "original_json" JSONB,
    "result_json" JSONB,

    CONSTRAINT "employer_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gym_scans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "short_code" VARCHAR(32) NOT NULL,
    "business_id" UUID,
    "patient_name" TEXT NOT NULL,
    "patient_email" TEXT,
    "patient_phone" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "brightness_score" DECIMAL(10,2),
    "shade_value" TEXT,
    "ideal_shade" TEXT,
    "status" TEXT DEFAULT 'pending',
    "simplified_status" TEXT,
    "clinic_recommended" BOOLEAN NOT NULL DEFAULT false,
    "original_json" JSONB,
    "result_json" JSONB,

    CONSTRAINT "gym_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_ai" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event" TEXT NOT NULL,
    "message_sid" TEXT,
    "from_phone" TEXT,
    "to_phone" TEXT,
    "text" TEXT,
    "source" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_ai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multiuse_business" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "public_code" VARCHAR(32) NOT NULL,
    "name" TEXT NOT NULL,
    "organization_type" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "street_address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "password" TEXT,

    CONSTRAINT "multiuse_business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "n2_business" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "twilio_phone" TEXT NOT NULL,
    "calendar_link" TEXT,
    "business_phone" TEXT,
    "business_hours" TEXT,
    "business_address" TEXT,
    "pricing_link" TEXT,
    "service_list" TEXT,
    "wait_time" TEXT,
    "locale" TEXT DEFAULT 'en-US',
    "quiet_hours_start" TIME(6),
    "quiet_hours_end" TIME(6),
    "enable_followups" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "timezone" TEXT DEFAULT 'America/New_York',

    CONSTRAINT "n2_business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "n2_contacts_state" (
    "business_id" UUID NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'new',
    "last_outbound_at" TIMESTAMPTZ(6),
    "last_inbound_at" TIMESTAMPTZ(6),
    "last_template_key" TEXT,

    CONSTRAINT "n2_contacts_state_pkey" PRIMARY KEY ("business_id","contact_phone")
);

-- CreateTable
CREATE TABLE "n2_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "business_id" UUID,
    "contact_phone" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "text" TEXT,
    "applied_rule_id" UUID,
    "template_key" TEXT,
    "llm_fallback_used" BOOLEAN DEFAULT false,
    "idempotency_key" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "n2_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "n2_opt_outs" (
    "business_id" UUID NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "n2_opt_outs_pkey" PRIMARY KEY ("business_id","contact_phone")
);

-- CreateTable
CREATE TABLE "n2_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "business_id" UUID,
    "priority" INTEGER NOT NULL,
    "match_type" TEXT NOT NULL,
    "match_payload" JSONB,
    "action_type" TEXT NOT NULL,
    "action_payload" JSONB,
    "active" BOOLEAN DEFAULT true,

    CONSTRAINT "n2_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "n2_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "business_id" UUID,
    "key" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "version" INTEGER DEFAULT 1,

    CONSTRAINT "n2_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_applications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessName" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "businessNumber" TEXT,
    "contactFirstName" TEXT NOT NULL,
    "contactLastName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "ctaOption" TEXT,
    "ctaLink" TEXT,
    "ctaScreenshotsCount" INTEGER,
    "ctaScreenshotsUrls" TEXT[],
    "sampleMessage" TEXT,
    "selectedTemplateLabel" TEXT,
    "monthlyVolume" TEXT NOT NULL,
    "useCases" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "submittedData" JSONB,

    CONSTRAINT "onboarding_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_numbers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phoneNumber" VARCHAR(20) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "phone_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_verifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "destination" TEXT NOT NULL,
    "codeHash" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "phone_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_external_payment_links" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_external_payment_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_payment_settings" (
    "businessId" TEXT NOT NULL,
    "externalPaymentUrl" TEXT,
    "stripeAccountId" TEXT,
    "stripeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "allowPartial" BOOLEAN NOT NULL DEFAULT false,
    "allowInstallments" BOOLEAN NOT NULL DEFAULT false,
    "taxEnabled" BOOLEAN NOT NULL DEFAULT false,
    "defaultTaxRate" DECIMAL(5,2),

    CONSTRAINT "practice_payment_settings_pkey" PRIMARY KEY ("businessId")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'stripe',
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "stripePriceId" TEXT,
    "status" TEXT NOT NULL,
    "plan" TEXT,
    "currency" TEXT,
    "unitAmount" INTEGER,
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threads" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "us_zip_code" (
    "objectid" VARCHAR(50) NOT NULL,
    "createdat" TEXT,
    "updatedat" TEXT,
    "acl" TEXT,
    "area_codes" TEXT,
    "us_zip_code" INTEGER,
    "country" VARCHAR(5),
    "acceptable_cities" TEXT,
    "type" VARCHAR(50),
    "longitude" DOUBLE PRECISION,
    "primary_city" VARCHAR(100),
    "latitude" DOUBLE PRECISION,
    "county" VARCHAR(100),
    "unacceptable_cities" TEXT,
    "estimated_population" BIGINT,
    "state" VARCHAR(10),
    "timezone" VARCHAR(50),
    "remarks" TEXT,

    CONSTRAINT "us_zip_code_pkey" PRIMARY KEY ("objectid")
);

-- CreateTable
CREATE TABLE "user_phone_numbers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phoneNumberId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "user_phone_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "assigned" BOOLEAN NOT NULL DEFAULT false,
    "assigned_number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "avatar_url" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "phone_agent_enabled" BOOLEAN NOT NULL DEFAULT false,
    "billingMode" TEXT,
    "initialPlanId" TEXT,
    "phoneVerifiedAt" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "tosAcceptedAt" TIMESTAMP(3),
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastOtpSentAt" TIMESTAMP(3),
    "otpCode" TEXT,
    "otpExpiry" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "A2PBrand_brandSid_key" ON "A2PBrand"("brandSid");

-- CreateIndex
CREATE INDEX "A2PBrand_userId_idx" ON "A2PBrand"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "A2PCampaign_campaignSid_key" ON "A2PCampaign"("campaignSid");

-- CreateIndex
CREATE INDEX "A2PCampaign_brandSid_idx" ON "A2PCampaign"("brandSid");

-- CreateIndex
CREATE INDEX "A2PCampaign_userId_idx" ON "A2PCampaign"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "A2PNumberRegistration_numberSid_key" ON "A2PNumberRegistration"("numberSid");

-- CreateIndex
CREATE INDEX "A2PNumberRegistration_campaignSid_idx" ON "A2PNumberRegistration"("campaignSid");

-- CreateIndex
CREATE INDEX "A2PNumberRegistration_phoneNumberId_idx" ON "A2PNumberRegistration"("phoneNumberId");

-- CreateIndex
CREATE INDEX "A2PNumberRegistration_userId_idx" ON "A2PNumberRegistration"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_businessId_entityType_idx" ON "AuditLog"("businessId", "entityType");

-- CreateIndex
CREATE INDEX "AuditLog_businessId_eventType_idx" ON "AuditLog"("businessId", "eventType");

-- CreateIndex
CREATE INDEX "AuditLog_businessId_timestamp_idx" ON "AuditLog"("businessId", "timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_businessId_userId_idx" ON "AuditLog"("businessId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_userId_key" ON "Business"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Call_callSid_key" ON "Call"("callSid");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentTemplate_businessId_key_key" ON "ConsentTemplate"("businessId", "key");

-- CreateIndex
CREATE INDEX "ConsentTemplateVersion_templateId_idx" ON "ConsentTemplateVersion"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentTemplateVersion_templateId_version_key" ON "ConsentTemplateVersion"("templateId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "FollowUpTemplate_name_key" ON "FollowUpTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleToken_userId_key" ON "GoogleToken"("userId");

-- CreateIndex
CREATE INDEX "ImportJobRow_jobId_status_rowNumber_idx" ON "ImportJobRow"("jobId", "status", "rowNumber");

-- CreateIndex
CREATE INDEX "Insurance_businessId_memberId_hash_idx" ON "Insurance"("businessId", "memberId_hash");

-- CreateIndex
CREATE INDEX "Insurance_businessId_payerName_idx" ON "Insurance"("businessId", "payerName");

-- CreateIndex
CREATE INDEX "Insurance_patientId_isActive_idx" ON "Insurance"("patientId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Insurance_businessId_patientId_memberId_hash_key" ON "Insurance"("businessId", "patientId", "memberId_hash");

-- CreateIndex
CREATE INDEX "Invoice_businessId_idx" ON "Invoice"("businessId");

-- CreateIndex
CREATE INDEX "Invoice_patientId_idx" ON "Invoice"("patientId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_scanLinkId_type_key" ON "Invoice"("scanLinkId", "type");

-- CreateIndex
CREATE INDEX "InvoiceLine_invoiceId_idx" ON "InvoiceLine"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoicePayment_invoiceId_idx" ON "InvoicePayment"("invoiceId");

-- CreateIndex
CREATE INDEX "JurisdictionAgreement_businessId_status_idx" ON "JurisdictionAgreement"("businessId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "JurisdictionAgreement_businessId_templateId_key" ON "JurisdictionAgreement"("businessId", "templateId");

-- CreateIndex
CREATE UNIQUE INDEX "JurisdictionTemplate_key_version_key" ON "JurisdictionTemplate"("key", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ListContact_listId_contactId_key" ON "ListContact"("listId", "contactId");

-- CreateIndex
CREATE INDEX "Patient_businessId_idx" ON "Patient"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_businessId_email_key" ON "Patient"("businessId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_businessId_phone_key" ON "Patient"("businessId", "phone");

-- CreateIndex
CREATE INDEX "PatientConsent_businessId_patientId_idx" ON "PatientConsent"("businessId", "patientId");

-- CreateIndex
CREATE INDEX "PatientConsent_patientId_status_idx" ON "PatientConsent"("patientId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_userId_key" ON "Provider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderConfig_businessId_key" ON "ProviderConfig"("businessId");

-- CreateIndex
CREATE INDEX "Scan_businessId_patientId_createdAt_idx" ON "Scan"("businessId", "patientId", "createdAt");

-- CreateIndex
CREATE INDEX "Scan_status_idx" ON "Scan"("status");

-- CreateIndex
CREATE INDEX "ScanJob_businessId_scheduledSendAt_status_idx" ON "ScanJob"("businessId", "scheduledSendAt", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ScanLink_tokenHash_key" ON "ScanLink"("tokenHash");

-- CreateIndex
CREATE INDEX "ScanLink_businessId_idx" ON "ScanLink"("businessId");

-- CreateIndex
CREATE INDEX "ScanLink_expiresAt_idx" ON "ScanLink"("expiresAt");

-- CreateIndex
CREATE INDEX "ScanLink_isRevoked_idx" ON "ScanLink"("isRevoked");

-- CreateIndex
CREATE INDEX "ScanRequest_businessId_idx" ON "ScanRequest"("businessId");

-- CreateIndex
CREATE INDEX "ScanRequest_patientId_createdAt_idx" ON "ScanRequest"("patientId", "createdAt");

-- CreateIndex
CREATE INDEX "ScanRequest_status_dueBy_idx" ON "ScanRequest"("status", "dueBy");

-- CreateIndex
CREATE UNIQUE INDEX "ScanResult_scanId_key" ON "ScanResult"("scanId");

-- CreateIndex
CREATE UNIQUE INDEX "ScanShortLink_code_key" ON "ScanShortLink"("code");

-- CreateIndex
CREATE INDEX "ScanSubscription_businessId_idx" ON "ScanSubscription"("businessId");

-- CreateIndex
CREATE INDEX "ScanSubscription_lastRetryAt_retryAttempts_idx" ON "ScanSubscription"("lastRetryAt", "retryAttempts");

-- CreateIndex
CREATE INDEX "ScanSubscription_nextSendAt_isActive_idx" ON "ScanSubscription"("nextSendAt", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ScanSubscription_businessId_patientId_key" ON "ScanSubscription"("businessId", "patientId");

-- CreateIndex
CREATE UNIQUE INDEX "TextCampaignContactFollowUp_textCampaignContactId_textCampa_key" ON "TextCampaignContactFollowUp"("textCampaignContactId", "textCampaignFollowUpId");

-- CreateIndex
CREATE UNIQUE INDEX "TextCampaignTemplate_name_key" ON "TextCampaignTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TrialKey_valueHash_key" ON "TrialKey"("valueHash");

-- CreateIndex
CREATE INDEX "TrialKey_kind_idx" ON "TrialKey"("kind");

-- CreateIndex
CREATE INDEX "TrialKey_valueHash_idx" ON "TrialKey"("valueHash");

-- CreateIndex
CREATE INDEX "TwilioA2PEventLog_brandSid_idx" ON "TwilioA2PEventLog"("brandSid");

-- CreateIndex
CREATE INDEX "TwilioA2PEventLog_campaignSid_idx" ON "TwilioA2PEventLog"("campaignSid");

-- CreateIndex
CREATE INDEX "TwilioA2PEventLog_eventType_idx" ON "TwilioA2PEventLog"("eventType");

-- CreateIndex
CREATE INDEX "TwilioA2PEventLog_numberSid_idx" ON "TwilioA2PEventLog"("numberSid");

-- CreateIndex
CREATE UNIQUE INDEX "UserCredential_userId_key" ON "UserCredential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "agents_agentId_key" ON "agents"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "agents_llmId_key" ON "agents"("llmId");

-- CreateIndex
CREATE UNIQUE INDEX "agents_name_key" ON "agents"("name");

-- CreateIndex
CREATE UNIQUE INDEX "business_messaging_services_businessId_key" ON "business_messaging_services"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "business_phone_numbers_phoneNumber_key" ON "business_phone_numbers"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "business_phone_numbers_twilioSid_key" ON "business_phone_numbers"("twilioSid");

-- CreateIndex
CREATE INDEX "business_phone_numbers_businessId_idx" ON "business_phone_numbers"("businessId");

-- CreateIndex
CREATE INDEX "business_phone_numbers_provider_idx" ON "business_phone_numbers"("provider");

-- CreateIndex
CREATE INDEX "campaign_contacts_campaignId_idx" ON "campaign_contacts"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_contacts_contactId_idx" ON "campaign_contacts"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_contacts_campaignId_contactId_key" ON "campaign_contacts"("campaignId", "contactId");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_name_key" ON "campaigns"("name");

-- CreateIndex
CREATE INDEX "campaigns_userId_idx" ON "campaigns"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "charity_scans_short_code_key" ON "charity_scans"("short_code");

-- CreateIndex
CREATE INDEX "charity_scans_business_id_idx" ON "charity_scans"("business_id");

-- CreateIndex
CREATE INDEX "charity_scans_created_at_idx" ON "charity_scans"("created_at");

-- CreateIndex
CREATE INDEX "charity_scans_guardian_consent_idx" ON "charity_scans"("guardian_consent_given");

-- CreateIndex
CREATE INDEX "charity_scans_is_minor_idx" ON "charity_scans"("is_minor");

-- CreateIndex
CREATE INDEX "charity_scans_phone_idx" ON "charity_scans"("patient_phone");

-- CreateIndex
CREATE INDEX "charity_scans_status_idx" ON "charity_scans"("status");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_email_key" ON "contacts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_phone_key" ON "contacts"("phone");

-- CreateIndex
CREATE INDEX "contacts_userId_idx" ON "contacts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "employer_scans_short_code_key" ON "employer_scans"("short_code");

-- CreateIndex
CREATE INDEX "employer_scans_business_id_idx" ON "employer_scans"("business_id");

-- CreateIndex
CREATE INDEX "employer_scans_created_at_idx" ON "employer_scans"("created_at");

-- CreateIndex
CREATE INDEX "employer_scans_phone_idx" ON "employer_scans"("patient_phone");

-- CreateIndex
CREATE INDEX "employer_scans_status_idx" ON "employer_scans"("status");

-- CreateIndex
CREATE UNIQUE INDEX "gym_scans_short_code_key" ON "gym_scans"("short_code");

-- CreateIndex
CREATE INDEX "gym_scans_business_id_idx" ON "gym_scans"("business_id");

-- CreateIndex
CREATE INDEX "gym_scans_created_at_idx" ON "gym_scans"("created_at");

-- CreateIndex
CREATE INDEX "gym_scans_phone_idx" ON "gym_scans"("patient_phone");

-- CreateIndex
CREATE INDEX "gym_scans_status_idx" ON "gym_scans"("status");

-- CreateIndex
CREATE INDEX "messages_threadId_idx" ON "messages"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "multiuse_business_public_code_key" ON "multiuse_business"("public_code");

-- CreateIndex
CREATE INDEX "multiuse_business_type_idx" ON "multiuse_business"("organization_type");

-- CreateIndex
CREATE UNIQUE INDEX "n2_business_twilio_phone_key" ON "n2_business"("twilio_phone");

-- CreateIndex
CREATE INDEX "idx_n2_logs_idem" ON "n2_logs"("business_id", "contact_phone", "idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "n2_rules_business_id_priority_key" ON "n2_rules"("business_id", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "n2_templates_business_id_key_key" ON "n2_templates"("business_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "phone_numbers_phoneNumber_key" ON "phone_numbers"("phoneNumber");

-- CreateIndex
CREATE INDEX "phone_verifications_userId_idx" ON "phone_verifications"("userId");

-- CreateIndex
CREATE INDEX "practice_external_payment_links_businessId_sortOrder_idx" ON "practice_external_payment_links"("businessId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "threads_contactId_idx" ON "threads"("contactId");

-- CreateIndex
CREATE INDEX "threads_userId_idx" ON "threads"("userId");

-- CreateIndex
CREATE INDEX "user_phone_numbers_phoneNumberId_idx" ON "user_phone_numbers"("phoneNumberId");

-- CreateIndex
CREATE INDEX "user_phone_numbers_userId_idx" ON "user_phone_numbers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "charity_program" ADD CONSTRAINT "charity_program_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "multiuse_business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "A2PBrand" ADD CONSTRAINT "A2PBrand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "A2PCampaign" ADD CONSTRAINT "A2PCampaign_brandRefId_fkey" FOREIGN KEY ("brandRefId") REFERENCES "A2PBrand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "A2PCampaign" ADD CONSTRAINT "A2PCampaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "A2PNumberRegistration" ADD CONSTRAINT "A2PNumberRegistration_campaignRefId_fkey" FOREIGN KEY ("campaignRefId") REFERENCES "A2PCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "A2PNumberRegistration" ADD CONSTRAINT "A2PNumberRegistration_phoneNumberId_fkey" FOREIGN KEY ("phoneNumberId") REFERENCES "phone_numbers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "A2PNumberRegistration" ADD CONSTRAINT "A2PNumberRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDraft" ADD CONSTRAINT "AgentDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_textCampaignId_fkey" FOREIGN KEY ("textCampaignId") REFERENCES "TextCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentTemplate" ADD CONSTRAINT "ConsentTemplate_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentTemplateVersion" ADD CONSTRAINT "ConsentTemplateVersion_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentTemplateVersion" ADD CONSTRAINT "ConsentTemplateVersion_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ConsentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataExportRequest" ADD CONSTRAINT "DataExportRequest_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataExportRequest" ADD CONSTRAINT "DataExportRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrequentlySentContact" ADD CONSTRAINT "FrequentlySentContact_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "FrequentlySentGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrequentlySentGroup" ADD CONSTRAINT "FrequentlySentGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleToken" ADD CONSTRAINT "GoogleToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJobRow" ADD CONSTRAINT "ImportJobRow_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_scanLinkId_fkey" FOREIGN KEY ("scanLinkId") REFERENCES "ScanLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoicePayment" ADD CONSTRAINT "InvoicePayment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceTemplateSetting" ADD CONSTRAINT "InvoiceTemplateSetting_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurisdictionAgreement" ADD CONSTRAINT "JurisdictionAgreement_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurisdictionAgreement" ADD CONSTRAINT "JurisdictionAgreement_signedByUserId_fkey" FOREIGN KEY ("signedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurisdictionAgreement" ADD CONSTRAINT "JurisdictionAgreement_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "JurisdictionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListContact" ADD CONSTRAINT "ListContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListContact" ADD CONSTRAINT "ListContact_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientConsent" ADD CONSTRAINT "PatientConsent_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientConsent" ADD CONSTRAINT "PatientConsent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientConsent" ADD CONSTRAINT "PatientConsent_signedByUserId_fkey" FOREIGN KEY ("signedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientConsent" ADD CONSTRAINT "PatientConsent_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ConsentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientConsent" ADD CONSTRAINT "PatientConsent_templateVersionId_fkey" FOREIGN KEY ("templateVersionId") REFERENCES "ConsentTemplateVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderConfig" ADD CONSTRAINT "ProviderConfig_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_scanLinkId_fkey" FOREIGN KEY ("scanLinkId") REFERENCES "ScanLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanJob" ADD CONSTRAINT "ScanJob_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanJob" ADD CONSTRAINT "ScanJob_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanJob" ADD CONSTRAINT "ScanJob_scanLinkId_fkey" FOREIGN KEY ("scanLinkId") REFERENCES "ScanLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanLink" ADD CONSTRAINT "ScanLink_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanLink" ADD CONSTRAINT "ScanLink_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanLink" ADD CONSTRAINT "ScanLink_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanRequest" ADD CONSTRAINT "ScanRequest_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanRequest" ADD CONSTRAINT "ScanRequest_completedScanId_fkey" FOREIGN KEY ("completedScanId") REFERENCES "Scan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanRequest" ADD CONSTRAINT "ScanRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanRequest" ADD CONSTRAINT "ScanRequest_scanLinkId_fkey" FOREIGN KEY ("scanLinkId") REFERENCES "ScanLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanResult" ADD CONSTRAINT "ScanResult_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanShortLink" ADD CONSTRAINT "ScanShortLink_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanSubscription" ADD CONSTRAINT "ScanSubscription_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanSubscription" ADD CONSTRAINT "ScanSubscription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextCampaign" ADD CONSTRAINT "TextCampaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextCampaignContact" ADD CONSTRAINT "TextCampaignContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextCampaignContact" ADD CONSTRAINT "TextCampaignContact_textCampaignId_fkey" FOREIGN KEY ("textCampaignId") REFERENCES "TextCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextCampaignContactFollowUp" ADD CONSTRAINT "TextCampaignContactFollowUp_textCampaignContactId_fkey" FOREIGN KEY ("textCampaignContactId") REFERENCES "TextCampaignContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextCampaignContactFollowUp" ADD CONSTRAINT "TextCampaignContactFollowUp_textCampaignFollowUpId_fkey" FOREIGN KEY ("textCampaignFollowUpId") REFERENCES "TextCampaignFollowUp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextCampaignFollowUp" ADD CONSTRAINT "TextCampaignFollowUp_textCampaignId_fkey" FOREIGN KEY ("textCampaignId") REFERENCES "TextCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCredential" ADD CONSTRAINT "UserCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_messaging_services" ADD CONSTRAINT "business_messaging_services_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_phone_numbers" ADD CONSTRAINT "business_phone_numbers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_contacts" ADD CONSTRAINT "campaign_contacts_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_contacts" ADD CONSTRAINT "campaign_contacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "n2_contacts_state" ADD CONSTRAINT "n2_contacts_state_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "n2_business"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "n2_logs" ADD CONSTRAINT "n2_logs_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "n2_business"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "n2_opt_outs" ADD CONSTRAINT "n2_opt_outs_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "n2_business"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "n2_rules" ADD CONSTRAINT "n2_rules_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "n2_business"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "n2_templates" ADD CONSTRAINT "n2_templates_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "n2_business"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "phone_verifications" ADD CONSTRAINT "phone_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_external_payment_links" ADD CONSTRAINT "practice_external_payment_links_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_payment_settings" ADD CONSTRAINT "practice_payment_settings_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_phone_numbers" ADD CONSTRAINT "user_phone_numbers_phoneNumberId_fkey" FOREIGN KEY ("phoneNumberId") REFERENCES "phone_numbers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_phone_numbers" ADD CONSTRAINT "user_phone_numbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
