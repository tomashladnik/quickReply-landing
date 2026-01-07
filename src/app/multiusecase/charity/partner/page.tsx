// src/app/multiusecase/charity/partner/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  HandHeart,
} from "lucide-react";
import { any } from "zod";

type PartnerClinic = {
  id: string;
  clinic_name: string;
  address_line: string;
  phone_number: string;
  created_at?: string;
  source?: "A" | "B"; // "A" = charity partner, "B" = ReplyQuick network
};

function isNonEmptyString(v: any) {
  return typeof v === "string" && v.trim().length > 0;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CharityPartnerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <Content />
    </Suspense>
  );
}

function Content() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("orgId") || "";

  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);

  const [partners, setPartners] = useState<PartnerClinic[]>([]);
  const [clinicName, setClinicName] = useState("");

  // ✅ structured address fields (more professional + routing friendly)
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("US");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const canAdd = useMemo(() => {
    return (
      isNonEmptyString(businessId) &&
      isNonEmptyString(clinicName) &&
      isNonEmptyString(street) &&
      isNonEmptyString(city) &&
      isNonEmptyString(stateVal) &&
      isNonEmptyString(zip) &&
      isNonEmptyString(phoneNumber)
    );
  }, [businessId, clinicName, street, city, stateVal, zip, phoneNumber]);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      setError("Missing orgId in URL. Open this page from the sidebar.");
      return;
    }
    loadPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const loadPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      setToast(null);

      const res = await fetch(
        `/api/multiusecase/charity/partner?businessId=${encodeURIComponent(
          businessId
        )}`,
        { cache: "no-store" }
      );
      const data = await res.json().catch(() => any);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to load partner clinics.");
      }

      const rawPartners = Array.isArray(data.partners) ? data.partners : [];

      // ❗ Only show charity-owned partners (Option A) in this UI
      const onlyCharityPartners = rawPartners.filter(
        (p: any) => p.source === "A" || !p.source
      );

      setPartners(onlyCharityPartners);
    } catch (e: any) {
      setError(e?.message || "Failed to load partner clinics.");
    } finally {
      setLoading(false);
    }
  };

  const addPartner = async () => {
    if (!canAdd) return;
    try {
      setMutating(true);
      setToast(null);
      setError(null);

      const res = await fetch(`/api/multiusecase/charity/partner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          clinic: {
            clinic_name: clinicName.trim(),
            phone_number: phoneNumber.trim(),
            street_address: street.trim(),
            city: city.trim(),
            state: stateVal.trim(),
            zip_code: zip.trim(),
            country: country.trim(),
          },
        }),
      });

      const data = await res.json().catch(() => any);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to add partner clinic.");
      }

      setClinicName("");
      setStreet("");
      setCity("");
      setStateVal("");
      setZip("");
      setCountry("US");
      setPhoneNumber("");

      setToast({ type: "success", message: "Partner clinic added." });
      await loadPartners();
    } catch (e: any) {
      setToast({
        type: "error",
        message: e?.message || "Failed to add partner clinic.",
      });
    } finally {
      setMutating(false);
    }
  };

  const deletePartner = async (clinicId: string) => {
    try {
      setMutating(true);
      setToast(null);
      setError(null);

      const res = await fetch(
        `/api/multiusecase/charity/partner?businessId=${encodeURIComponent(
          businessId
        )}&clinicId=${encodeURIComponent(clinicId)}`,
        { method: "DELETE" }
      );

      const data = await res.json().catch(() => any);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to delete partner clinic.");
      }

      setToast({ type: "success", message: "Partner clinic removed." });
      await loadPartners();
    } catch (e: any) {
      setToast({
        type: "error",
        message: e?.message || "Failed to delete partner clinic.",
      });
    } finally {
      setMutating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-0px)] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-[#4EBFF7] mx-auto mb-4" />
          <p className="text-gray-700 font-medium">
            Loading partner settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-3xl bg-linear-to-r from-[#4EBFF7] to-[#22c3ee] text-white shadow-xl px-6 py-6 md:px-8 md:py-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-sm">
                <HandHeart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Set Your Partner
                </h1>
                <p className="text-white/90 mt-1">
                  Add one or more partner clinics. These are your charity’s own
                  partners and will be used for routing results.
                </p>
              </div>
            </div>

            <button
              onClick={loadPartners}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">
                  Something went wrong
                </p>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div
            className={cn(
              "bg-white rounded-2xl border p-5 shadow-sm",
              toast.type === "success" ? "border-emerald-200" : "border-red-200"
            )}
          >
            <div className="flex items-start gap-3">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {toast.type === "success" ? "Saved" : "Error"}
                </p>
                <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Add form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-200/70 p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Add Partner Clinic
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              This will be used for patient routing and shown on results.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Clinic Name
                </label>
                <div className="mt-2 relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="e.g., SmileCare Dental Clinic"
                    className="w-full rounded-xl border border-slate-200 px-10 py-3 outline-none focus:ring-2 focus:ring-[#4EBFF7]/40"
                  />
                </div>
              </div>

              {/* ✅ Professional address inputs */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Address
                </label>

                <div className="mt-2 space-y-3">
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Street address (e.g., 123 Main St, Suite 200)"
                      className="w-full rounded-xl border border-slate-200 px-10 py-3 outline-none focus:ring-2 focus:ring-[#4EBFF7]/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City (e.g., Arlington)"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#4EBFF7]/40"
                    />

                    <input
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      placeholder="State (e.g., TX)"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#4EBFF7]/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="ZIP code (e.g., 76010)"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#4EBFF7]/40"
                    />

                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-[#4EBFF7]/40"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="MX">Mexico</option>
                    </select>
                  </div>

                  <p className="text-xs text-gray-500">
                    Tip: This structure helps us route patients to the
                    nearest/most relevant partner by state/zip.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <div className="mt-2 relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., (682) 597-8114"
                    className="w-full rounded-xl border border-slate-200 px-10 py-3 outline-none focus:ring-2 focus:ring-[#4EBFF7]/40"
                  />
                </div>
              </div>

              <button
                onClick={addPartner}
                disabled={!canAdd || mutating}
                className={cn(
                  "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition shadow-sm",
                  !canAdd || mutating
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-[#4EBFF7] hover:bg-[#3da8d9] text-white"
                )}
              >
                <Plus className="w-4 h-4" />
                {mutating ? "Saving..." : "Add Partner"}
              </button>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-lg border border-slate-200/70 p-6">
            <h2 className="text-lg font-bold text-gray-900">Your Partners</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage the partner clinics that belong to your charity.
              ReplyQuick’s own network partners are managed separately by
              ReplyQuick admin.
            </p>

            <div className="mt-5 space-y-3">
              {partners.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-gray-700">
                  No partner clinics yet. Add your first partner on the left.
                </div>
              ) : (
                partners.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-slate-200 p-5 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {p.clinic_name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {p.address_line}
                      </p>
                      <p className="text-sm text-gray-700 font-semibold mt-2">
                        {p.phone_number}
                      </p>
                    </div>

                    <button
                      onClick={() => deletePartner(p.id)}
                      disabled={mutating}
                      className={cn(
                        "shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold transition",
                        mutating
                          ? "border-slate-200 text-slate-400 cursor-not-allowed"
                          : "border-red-200 text-red-600 hover:bg-red-50"
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm text-blue-900 font-semibold mb-1">
                How routing will work
              </p>
              <p className="text-sm text-blue-800">
                Patients will first be routed to your own partner clinics here.
                If no suitable match is found, the system can optionally fall
                back to ReplyQuick’s wider network (managed by ReplyQuick
                admin).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
