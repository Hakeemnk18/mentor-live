import { useState } from "react";
import { createLead } from "../../../api/lead.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import type { CreateLeadPayload, LeadType } from "../../../shared/types/lead.types";

interface Props {
  open: boolean;
  onClose: () => void;
  type: LeadType;
  purpose: string;
  classId?: string | null;
  syllabusId?: string | null;
  className?: string | null;
  syllabusName?: string | null;
}

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
  errors: Record<string, string>;
};

const emptyForm: FormState = { name: "", phone: "", email: "", message: "", errors: {} };

export default function LeadFormModal({
  open,
  onClose,
  type,
  purpose,
  classId,
  syllabusId,
  className,
  syllabusName,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* Reset on open */
  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setForm(emptyForm);
      setSubmitted(false);
    }
  }

  if (!open) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.phone.trim())
      e.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim()))
      e.phone = "Enter a valid phone number";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setForm((prev) => ({ ...prev, errors: errs }));
      return;
    }
    try {
      setSubmitting(true);
      const payload: CreateLeadPayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        message: form.message.trim() || null,
        purpose,
        type,
        classId: classId ?? null,
        syllabusId: syllabusId ?? null,
        className: className ?? null,
        syllabusName: syllabusName ?? null,
      };
      await createLead(payload);
      setSubmitted(true);
    } catch (err) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field: keyof Pick<FormState, "name" | "phone" | "email">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setForm((prev) => {
        const errors = { ...prev.errors };
        delete errors[field];
        return { ...prev, [field]: val, errors };
      });
    };

  const setMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, message: e.target.value }));

  const inp = (err?: string) =>
    `w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 transition-colors ${
      err ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-[#DB313E]"
    }`;

  const title = type === "inquiry" ? "Get In Touch" : "Request a Faculty";
  const subtitle =
    type === "inquiry"
      ? "Fill in your details and we'll reach out to you soon."
      : `No tutor found for ${className ?? "this class"}${syllabusName ? ` (${syllabusName})` : ""}. Leave your details and we'll arrange one for you.`;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!submitting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#DB313E] to-[#ff6b35]" />

        <div className="px-6 py-6">
          {submitted ? (
            /* ── Success state ── */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">We've Got Your Request!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Our team will get in touch with you shortly.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-lg bg-[#DB313E] text-white text-sm font-semibold hover:bg-[#c12a36] transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-xs">{subtitle}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-3 flex-shrink-0"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={set("name")}
                    placeholder="e.g. Arjun Kumar"
                    maxLength={100}
                    className={inp(form.errors.name)}
                  />
                  {form.errors.name && <p className="text-xs text-red-500 mt-1">{form.errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91 98765 43210"
                    type="tel"
                    maxLength={15}
                    className={inp(form.errors.phone)}
                  />
                  {form.errors.phone && <p className="text-xs text-red-500 mt-1">{form.errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Email <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    type="email"
                    className={inp(form.errors.email)}
                  />
                  {form.errors.email && <p className="text-xs text-red-500 mt-1">{form.errors.email}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Message <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={setMessage}
                    placeholder="Any specific requirements, preferred timings, or additional details…"
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 focus:border-[#DB313E] resize-none transition-colors"
                  />
                  <p className={`text-right text-[11px] mt-0.5 ${form.message.length > 460 ? "text-amber-500" : "text-gray-400"}`}>
                    {form.message.length}/500
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-[#DB313E] text-white text-sm font-semibold hover:bg-[#c12a36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>

                <p className="text-center text-[11px] text-gray-400 mt-1">
                  We'll contact you within 24 hours
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
