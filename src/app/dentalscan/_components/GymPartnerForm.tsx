/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dentalscan/_components/GymPartnerForm.tsx
"use client";

import React from "react";

export type GymForm = {
  program: "gym";
  gymName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  password: string;
  agreeNonMedical: boolean;
  agreeAuthority: boolean;
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

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const inputCls =
  "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition";

export default function GymPartnerForm({
  form,
  onChange,
}: {
  form: GymForm;
  onChange: (e: any) => void;
}) {
  return (
    <div className="space-y-6">
      <Section
        title="Gym details"
        subtitle="Tell us about your gym and who we should contact."
      >
        <Field label="Gym name" required>
          <input
            name="gymName"
            value={form.gymName}
            onChange={onChange}
            required
            className={inputCls}
            placeholder="Sunshine Fitness Center"
            autoComplete="organization"
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
              placeholder="admin@yourgym.com"
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

      <Section title="Location" subtitle="Where is the gym located?">
        <Field label="Address" required>
          <input
            name="address"
            value={form.address}
            onChange={onChange}
            required
            className={inputCls}
            placeholder="123 Main Street"
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
              placeholder="Austin"
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

      <Section title="Agreements" subtitle="Required to continue.">
        <CheckLine
          name="agreeNonMedical"
          checked={form.agreeNonMedical}
          onChange={onChange}
          label="I understand this is a non-medical service. Reports are informational and preventive only and do not provide medical advice."
        />
        <CheckLine
          name="agreeAuthority"
          checked={form.agreeAuthority}
          onChange={onChange}
          label="I agree to the Terms of Service and Privacy Policy and confirm I’m authorized to create this account."
        />
      </Section>
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
