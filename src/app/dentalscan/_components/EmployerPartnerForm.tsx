/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dentalscan/_components/EmployerPartnerForm.tsx
"use client";

import React from "react";

export type EmployerForm = {
  program: "employer";
  companyName: string;
  contactName: string;
  workEmail: string;
  phone: string;
  website: string;
  employeeCount: string;
  industry: string;
  message: string;
  agreeContact: boolean;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const inputCls =
  "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition";

export default function EmployerPartnerForm({
  form,
  onChange,
}: {
  form: EmployerForm;
  onChange: (e: any) => void;
}) {
  return (
    <div className="space-y-6">
      <Section
        title="Company"
        subtitle="We’ll reach out to schedule a quick call."
      >
        <Field label="Company name" required>
          <input
            name="companyName"
            value={form.companyName}
            onChange={onChange}
            required
            className={inputCls}
            placeholder="Acme Inc."
            autoComplete="organization"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Contact name" required>
            <input
              name="contactName"
              value={form.contactName}
              onChange={onChange}
              required
              className={inputCls}
              placeholder="John Doe"
              autoComplete="name"
            />
          </Field>

          <Field label="Work email" required>
            <input
              type="email"
              name="workEmail"
              value={form.workEmail}
              onChange={onChange}
              required
              className={inputCls}
              placeholder="john@company.com"
              autoComplete="email"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <Field label="Website" help="Optional">
            <input
              name="website"
              value={form.website}
              onChange={onChange}
              className={inputCls}
              placeholder="https://company.com"
              autoComplete="url"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Employee count" required>
            <select
              name="employeeCount"
              value={form.employeeCount}
              onChange={onChange}
              required
              className={cn(inputCls, "py-3.5")}
            >
              <option value="">Select</option>
              <option value="1-50">1–50</option>
              <option value="51-200">51–200</option>
              <option value="201-1000">201–1000</option>
              <option value="1000+">1000+</option>
            </select>
          </Field>

          <Field label="Industry" required>
            <input
              name="industry"
              value={form.industry}
              onChange={onChange}
              required
              className={inputCls}
              placeholder="Healthcare / Tech / Manufacturing"
            />
          </Field>
        </div>

        <Field label="What are you looking for?" help="Optional">
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            className={cn(inputCls, "min-h-[110px]")}
            placeholder="Onsite screening, pilot program, benefits rollout, pricing request, etc."
          />
        </Field>

        <CheckLine
          name="agreeContact"
          checked={form.agreeContact}
          onChange={onChange}
          label="I agree to be contacted about an employer partnership."
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
