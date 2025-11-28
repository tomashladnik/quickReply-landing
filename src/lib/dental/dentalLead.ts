// src/lib/dental/dentalLead.ts
import { prisma } from "@/lib/prisma";

type LeadSource = "contact_sales" | "learn_more";

export async function createDentalLead(params: {
  source: LeadSource;
  phone?: string | null;
  email?: string | null;
  pagePath?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  notes?: string | null;
}) {
  const {
    source,
    phone,
    email,
    pagePath,
    utmSource,
    utmMedium,
    utmCampaign,
    notes,
  } = params;

  return prisma.dentalLead.create({
    data: {
      source,
      phone: phone ?? null,
      email: email ?? null,
      pagePath: pagePath ?? null,
      utmSource: utmSource ?? null,
      utmMedium: utmMedium ?? null,
      utmCampaign: utmCampaign ?? null,
      notes: notes ?? null,
    },
  });
}
