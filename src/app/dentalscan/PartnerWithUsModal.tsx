/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dentalscan/PartnerWithUsModal.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";

import GymPartnerForm, { type GymForm } from "./_components/GymPartnerForm";
import CharityPartnerForm, {
  type CharityForm,
} from "./_components/CharityPartnerForm";
import EmployerPartnerForm, {
  type EmployerForm,
} from "./_components/EmployerPartnerForm";

type Program = "gym" | "charity" | "employer";

interface PartnerWithUsModalProps {
  open: boolean;
  onClose: () => void;
  program: Program;
}

type AnyForm = GymForm | CharityForm | EmployerForm;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function PartnerWithUsModal({
  open,
  onClose,
  program,
}: PartnerWithUsModalProps) {
  const titleId = "partner-with-us-title";
  const panelRef = useRef<HTMLDivElement | null>(null);

  const initialForm: AnyForm = useMemo(() => {
    if (program === "gym") {
      return {
        program: "gym",
        gymName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        password: "",
        agreeNonMedical: false,
        agreeAuthority: false,
      };
    }

    if (program === "charity") {
      return {
        program: "charity",
        organizationName: "",
        einOrRegistration: "",
        contactPersonName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        populationServed: "",
        expectedMonthlyScans: "",
        programType: "",
        targetLaunchDate: "",
        operationType: "",
        additionalNotes: "",
        agreeAuthority: false,
        c1AuthorizedToOperate: false,
        c2HasMinorConsents: false,
        c3NonDiagnosticOnly: false,
        c4AcceptComplianceResponsibility: false,
        c5RQNotResponsibleForConsent: false,
      };
    }

    return {
      program: "employer",
      companyName: "",
      contactName: "",
      workEmail: "",
      phone: "",
      website: "",
      employeeCount: "",
      industry: "",
      message: "",
      agreeContact: false,
    };
  }, [program]);

  const [form, setForm] = useState<AnyForm>(() => initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset state when opened / program changes
  useEffect(() => {
    if (!open) return;
    setForm(initialForm);
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  }, [open, initialForm]);

  // Prevent background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on ESC + focus panel
  useEffect(() => {
    if (!open) return;

    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const canSubmit = useMemo(() => {
    if (form.program === "gym")
      return form.agreeNonMedical && form.agreeAuthority;

    if (form.program === "charity") {
      return (
        form.agreeAuthority &&
        form.c1AuthorizedToOperate &&
        form.c2HasMinorConsents &&
        form.c3NonDiagnosticOnly &&
        form.c4AcceptComplianceResponsibility &&
        form.c5RQNotResponsibleForConsent
      );
    }

    return form.agreeContact;
  }, [form]);

  const header = useMemo(() => {
    if (program === "gym") {
      return {
        title: "Partner With Us — Gym Program",
        subtitle:
          "Register your gym to offer preventive, AI-powered dental screenings to members.",
      };
    }
    if (program === "charity") {
      return {
        title: "Partner With Us — Charity Program",
        subtitle:
          "Apply to run community dental screening programs for underserved populations.",
      };
    }
    return {
      title: "Partner With Us — Employer Program",
      subtitle:
        "Let’s explore a workplace rollout for preventive screenings and engagement.",
    };
  }, [program]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;

    setForm((prev) => {
      const next: any = { ...prev };
      next[name] = type === "checkbox" ? checked : value;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/partner-with-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send. Please try again.");

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      setSubmitError(err?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden={!open}>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn(
            "relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl outline-none",
            "max-h-[90vh] overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <h2
                  id={titleId}
                  className="text-xl sm:text-2xl font-bold text-gray-900"
                >
                  {header.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{header.subtitle}</p>
              </div>

              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
            {submitSuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-9 h-9 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Submitted</h3>
                <p className="mt-1 text-sm text-gray-600">
                  We received your application. Our team will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {form.program === "gym" && (
                  <GymPartnerForm form={form} onChange={handleChange} />
                )}

                {form.program === "charity" && (
                  <CharityPartnerForm form={form} onChange={handleChange} />
                )}

                {form.program === "employer" && (
                  <EmployerPartnerForm form={form} onChange={handleChange} />
                )}

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {submitError}
                  </div>
                )}

                {/* Footer actions */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <p className="text-xs text-gray-500">
                    By submitting, you agree that we may contact you about this
                    program.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting || !canSubmit}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4ebff7] px-6 py-3 text-white font-bold hover:bg-[#3da5d9] transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
