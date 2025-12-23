// src/app/dentalscan/PartnerWithUsModal.tsx

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

interface PartnerWithUsModalProps {
  open: boolean;
  onClose: () => void;
}

const types = [
  "Gym/Wellness Center",
  "School/Education Program",
  "Charity/Nonprofit",
  "Other"
];

export default function PartnerWithUsModal({ open, onClose }: PartnerWithUsModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    type: types[0],
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/partner-with-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to send. Please try again.");
      setSubmitSuccess(true);
      setForm({ name: "", email: "", organization: "", type: types[0], message: "" });
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.");
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
          <h3 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Partner With Us
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Fill out the form and our team will reach out to you soon.
          </p>
          {!submitSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="Organization name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition-all"
                  required
                >
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How would you like to partner with us?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ebff7] focus:border-transparent outline-none transition-all min-h-[80px]"
                />
              </div>
              {/* Checkbox at the bottom */}
              <div className="flex items-start gap-2">
                <input
                  id="partner-checkbox"
                  type="checkbox"
                  checked={checked}
                  onChange={e => setChecked(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#4ebff7] focus:ring-[#4ebff7]"
                />
                <label htmlFor="partner-checkbox" className="text-xs text-gray-600 leading-relaxed">
                  I agree to be contacted regarding partnership opportunities.
                </label>
              </div>
              {submitError && (
                <p className="text-sm text-red-600 text-center">
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !checked}
                className="w-full px-6 py-4 bg-[#4ebff7] text-white rounded-lg font-bold text-lg hover:bg-[#3da5d9] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending request...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                Thank you!
              </h4>
              <p className="text-gray-600">
                Your request has been received. Our team will contact you soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
