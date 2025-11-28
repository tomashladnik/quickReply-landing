// src/app/(public)/Dentalscandemo/DemoModal.tsx
import { useEffect, useState } from "react";
import type React from "react";
import { X, CheckCircle2 } from "lucide-react";

type DemoModalProps = {
  open: boolean;
  onClose: () => void;
};

type TrackingData = {
  pagePath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [acceptsSmsTerms, setAcceptsSmsTerms] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData>({
    pagePath: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { pathname, search } = window.location;
    const params = new URLSearchParams(search);
    setTrackingData({
      pagePath: `${pathname}${search}`,
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
    });
  }, []);

  if (!open) return null;

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const normalizedPhone = phone.replace(/\D/g, "");
    if (!normalizedPhone) {
      setSubmitError("Please enter a valid phone number.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        phone: normalizedPhone,
        email: email.trim() || undefined,
        acceptsSmsTerms,
        pagePath:
          trackingData.pagePath ||
          (typeof window !== "undefined"
            ? window.location.pathname
            : undefined),
        utmSource: trackingData.utmSource || undefined,
        utmMedium: trackingData.utmMedium || undefined,
        utmCampaign: trackingData.utmCampaign || undefined,
        notes:
          [name && `Name: ${name}`, companyName && `Company: ${companyName}`]
            .filter(Boolean)
            .join(" | ") || undefined,
      };

      const res = await fetch("/api/dentalscan/contact-sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let data: { error?: string } | null = null;
        try {
          data = (await res.json()) as { error?: string } | null;
        } catch {
          data = null;
        }
        throw new Error(data?.error ?? "Failed to submit request.");
      }

      setSubmitSuccess(true);
      setName("");
      setCompanyName("");
      setPhone("");
      setEmail("");
      setAcceptsSmsTerms(false);

      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative animate-slideIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Get Started with DentalScan
          </h3>
          <p className="text-gray-600 mb-6">
            We&apos;ll send you a text with a link to try our live demo
          </p>

          {!submitSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(555) 123-4567"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* SMS consent checkbox + text */}
              <div className="flex items-start gap-2">
                <input
                  id="sms-consent"
                  type="checkbox"
                  checked={acceptsSmsTerms}
                  onChange={(e) => setAcceptsSmsTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#4ebff7] focus:ring-[#4ebff7]"
                />
                <label
                  htmlFor="sms-consent"
                  className="text-xs text-gray-600 leading-relaxed"
                >
                  By signing up via text, you agree to receive recurring{" "}
                  <span className="font-semibold">DentalScan</span> messages from <span className="font-semibold">ReplyQuick</span> at the phone number provided. Consent is not a condition of purchase.
                  Reply <span className="font-semibold">STOP</span> to
                  unsubscribe. Reply <span className="font-semibold">HELP</span>{" "}
                  for help. Message frequency varies. Msg &amp; data rates may
                  apply. View our{" "}
                  <a href="/privacy" className="underline hover:text-gray-800">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms" className="underline hover:text-gray-800">
                    Terms of Service
                  </a>
                  .
                </label>
              </div>

              {submitError && (
                <p className="text-sm text-red-600 text-center">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-[#4ebff7] text-white rounded-lg font-bold text-lg hover:bg-[#3da5d9] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending request...
                  </span>
                ) : (
                  "Contact Sales"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                Request Received!
              </h4>
              <p className="text-gray-600">
                Thanks for reaching out. Our team will contact you shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
