/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dentalscan/_components/CharityPartnerForm.tsx
"use client";

import React from "react";
import { Scale } from "lucide-react";

export type CharityForm = {
  program: "charity";
  organizationName: string;
  einOrRegistration: string;
  contactPersonName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;

  populationServed: string;
  expectedMonthlyScans: string;
  programType: string;
  targetLaunchDate: string;
  operationType: string;
  additionalNotes: string;

  agreeAuthority: boolean;

  c1AuthorizedToOperate: boolean;
  c2HasMinorConsents: boolean;
  c3NonDiagnosticOnly: boolean;
  c4AcceptComplianceResponsibility: boolean;
  c5RQNotResponsibleForConsent: boolean;
};

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const POPULATION_SERVED = [
  "Children",
  "Families",
  "Low-income Adults",
  "Seniors",
  "Mixed / Community-wide",
  "Other",
];

const EXPECTED_MONTHLY_SCANS = ["1–50", "51–150", "151–300", "301–500", "500+"];

const CHARITY_PROGRAM_TYPES = [
  "Community Care",
  "School Outreach",
  "Mobile Screening",
  "Event-based Screening",
  "Other",
];

const OPERATION_TYPES = [
  "On-site (fixed location)",
  "Mobile / outreach",
  "Events / pop-ups",
  "Hybrid",
  "Other",
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const inputCls =
  "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition";

export default function CharityPartnerForm({
  form,
  onChange,
}: {
  form: CharityForm;
  onChange: (e: any) => void;
}) {
  return (
    <div className="space-y-6">
      <Section
        title="Organization"
        subtitle="Basic information about your charity or nonprofit."
      >
        <Field label="Organization name" required>
          <input
            name="organizationName"
            value={form.organizationName}
            onChange={onChange}
            required
            className={inputCls}
            placeholder="Community Health Foundation"
            autoComplete="organization"
          />
        </Field>

        <Field label="EIN / registration number" required>
          <input
            name="einOrRegistration"
            value={form.einOrRegistration}
            onChange={onChange}
            required
            className={inputCls}
            placeholder="12-3456789"
          />
        </Field>

        <Field label="Primary contact name" required>
          <input
            name="contactPersonName"
            value={form.contactPersonName}
            onChange={onChange}
            required
            className={inputCls}
            placeholder="Jane Smith"
            autoComplete="name"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Email" required>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              className={inputCls}
              placeholder="contact@organization.org"
              autoComplete="email"
            />
          </Field>

          <Field label="Phone" required>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              required
              className={inputCls}
              placeholder="(555) 123-4567"
              autoComplete="tel"
            />
          </Field>
        </div>
      </Section>

      <Section title="Location" subtitle="Where is your organization based?">
        <Field label="Address" required>
          <input
            name="address"
            value={form.address}
            onChange={onChange}
            required
            className={inputCls}
            placeholder="123 Community Drive"
            autoComplete="street-address"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="City" required>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              required
              className={inputCls}
              placeholder="Dallas"
              autoComplete="address-level2"
            />
          </Field>

          <Field label="State" required>
            <select
              name="state"
              value={form.state}
              onChange={onChange}
              required
              className={cn(inputCls, "py-3.5")}
              autoComplete="address-level1"
            >
              <option value="">Select state</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="ZIP code" required>
          <input
            name="zip"
            value={form.zip}
            onChange={onChange}
            required
            className={inputCls}
            placeholder="12345"
            autoComplete="postal-code"
          />
        </Field>
      </Section>

      <Section
        title="Program details"
        subtitle="Help us understand the scope of the screening program."
      >
        <Field label="Population served" required>
          <select
            name="populationServed"
            value={form.populationServed}
            onChange={onChange}
            required
            className={cn(inputCls, "py-3.5")}
          >
            <option value="">Select</option>
            {POPULATION_SERVED.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Expected monthly scans" required>
            <select
              name="expectedMonthlyScans"
              value={form.expectedMonthlyScans}
              onChange={onChange}
              required
              className={cn(inputCls, "py-3.5")}
            >
              <option value="">Select</option>
              {EXPECTED_MONTHLY_SCANS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Program type" required>
            <select
              name="programType"
              value={form.programType}
              onChange={onChange}
              required
              className={cn(inputCls, "py-3.5")}
            >
              <option value="">Select</option>
              {CHARITY_PROGRAM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Target launch date" help="Optional">
            <input
              type="date"
              name="targetLaunchDate"
              value={form.targetLaunchDate}
              onChange={onChange}
              className={inputCls}
            />
          </Field>

          <Field label="Operation type" required>
            <select
              name="operationType"
              value={form.operationType}
              onChange={onChange}
              required
              className={cn(inputCls, "py-3.5")}
            >
              <option value="">Select</option>
              {OPERATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Additional notes" help="Optional">
          <textarea
            name="additionalNotes"
            value={form.additionalNotes}
            onChange={onChange}
            className={cn(inputCls, "min-h-[110px]")}
            placeholder="Anything else we should know (locations, staffing, languages, event schedule, etc.)"
          />
        </Field>
      </Section>

      <Section title="Agreement" subtitle="Required to continue.">
        <CheckLine
          name="agreeAuthority"
          checked={form.agreeAuthority}
          onChange={onChange}
          label="I agree to the Terms of Service and Privacy Policy and confirm I’m authorized to submit this application."
        />
      </Section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-amber-700">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-900">
              Charity authorization & responsibility
            </h3>
            <p className="mt-1 text-sm text-amber-800">
              Please confirm the following (required):
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <CheckLine
            name="c1AuthorizedToOperate"
            checked={form.c1AuthorizedToOperate}
            onChange={onChange}
            label="Our organization is legally authorized to operate charitable programs involving minors (if applicable)."
          />
          <CheckLine
            name="c2HasMinorConsents"
            checked={form.c2HasMinorConsents}
            onChange={onChange}
            label="We obtain and retain all required parent/guardian consents where minors participate."
          />
          <CheckLine
            name="c3NonDiagnosticOnly"
            checked={form.c3NonDiagnosticOnly}
            onChange={onChange}
            label="We understand this is non-diagnostic, informational screening only (no medical advice, diagnosis, or treatment)."
          />
          <CheckLine
            name="c4AcceptComplianceResponsibility"
            checked={form.c4AcceptComplianceResponsibility}
            onChange={onChange}
            label="We are responsible for program-level compliance with laws on minors, consent, and participant privacy."
          />
          <CheckLine
            name="c5RQNotResponsibleForConsent"
            checked={form.c5RQNotResponsibleForConsent}
            onChange={onChange}
            label="We acknowledge ReplyQuick provides the technology only and is not responsible for program operations or participant consent."
          />
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  help,
  children,
}: {
  label: string;
  required?: boolean;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {help && <p className="mt-1 text-xs text-gray-500">{help}</p>}
    </div>
  );
}

function CheckLine(props: {
  name: string;
  checked: boolean;
  onChange: (e: any) => void;
  label: string;
}) {
  return (
    <label className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
      <input
        type="checkbox"
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-[#4ebff7] focus:ring-[#4ebff7]"
      />
      <span>{props.label}</span>
    </label>
  );
}
