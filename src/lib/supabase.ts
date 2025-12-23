// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY; // accept either

if (!url) throw new Error("SUPABASE_URL is required.");
if (!serviceKey)
  throw new Error("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY is required.");

export const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Legacy env for dental scan bucket (patient images)
// Usually set to "dental-preventive-scans"
export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET;

// Explicit named buckets (recommended to use these going forward)

// Patient images (dental preventive scans)
export const SUPABASE_DENTAL_SCANS_BUCKET =
  process.env.SUPABASE_DENTAL_SCANS_BUCKET ||
  SUPABASE_BUCKET ||
  "dental-preventive-scans";

// Dentist assets (logos, branding, etc.)
export const SUPABASE_DENTIST_BUCKET =
  process.env.SUPABASE_DENTIST_BUCKET || "Dentist";

// NEW: Demo bucket for live patient demo images
export const SUPABASE_DEMO_BUCKET =
  process.env.SUPABASE_DEMO_BUCKET || "dental-demo";

// Student Portal bucket (minor scans)
export const SUPABASE_SCHOOL_BUCKET =
  process.env.SUPABASE_SCHOOL_BUCKET || "School";

// If you keep a separate admin, use the same key:
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
