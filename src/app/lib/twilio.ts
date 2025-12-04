// src/lib/twilio.ts
import Twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || ""; // e.g. "+18445551234"

let twilioClient: Twilio.Twilio | null = null;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
} else {
  console.warn(
    "[Twilio] TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN not set – SMS sending disabled."
  );
}

export { twilioClient, TWILIO_FROM_NUMBER };