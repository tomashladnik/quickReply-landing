"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function GymDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId") || "";
  const flow = searchParams.get("flow") || "gym";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/multiuse/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanId,
          flow,
          fullName,
          phone,
          email,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save patient details");
      }

      // Go to existing Gym capture page
      router.push(
        `/multiusecase/gym/capture?scanId=${encodeURIComponent(
          scanId
        )}&flow=${encodeURIComponent(flow)}&userId=${encodeURIComponent(scanId)}
        &phone=${encodeURIComponent(phone)}`
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-6 space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Gym Scan – Patient Details
        </h1>
        <p className="text-sm text-slate-600">
          Scan ID: <span className="font-mono">{scanId}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number (for SMS)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !scanId}
          >
            {submitting ? "Saving..." : "Continue to Scan"}
          </Button>
        </form>
      </div>
    </main>
  );
}
