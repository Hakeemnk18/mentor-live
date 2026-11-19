import { useState } from "react";
import { createLead } from "../../../api/lead.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import type { CreateLeadPayload, LeadType } from "../../../shared/types/lead.types";
import ModalShell from "./ui/ModalShell";
import { errorTextCls, fieldCls, labelCls } from "./ui/formStyles";
import Bear from "./ui/Bear";
import { Spinner } from "./ui/Icons";

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

  const title = type === "inquiry" ? "Get In Touch" : "Request a Faculty";
  const subtitle =
    type === "inquiry"
      ? "Fill in your details and we'll reach out to you soon."
      : `No tutor found for ${className ?? "this class"}${syllabusName ? ` (${syllabusName})` : ""}. Leave your details and we'll arrange one for you.`;

  const errorText = (msg?: string) => (msg ? <p className={errorTextCls}>{msg}</p> : null);

  return (
    <ModalShell onClose={onClose} locked={submitting}>
      {submitted ? (
        /* ── Success state ── */
        <div className="px-[26px] pt-[34px] pb-7 flex flex-col items-center text-center gap-3">
          <div className="w-[120px] animate-ml-bob" style={{ animationDuration: "2.4s" }}>
            <Bear pose="phone" eager />
          </div>
          <h3 className="m-0 font-display font-extrabold text-[30px] text-ml-deep tracking-[-0.03em]">
            We've Got Your Request!
          </h3>
          <p className="m-0 text-[15px] leading-relaxed text-ml-muted max-w-[22em]">
            Our team will get in touch with you shortly.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="self-stretch mt-2 h-[54px] rounded-[18px] bg-ml-coral text-ml-deep font-extrabold text-base cursor-pointer hover:brightness-105 transition"
          >
            Close
          </button>
        </div>
      ) : (
        /* ── Form ── */
        <>
          <div className="bg-ml-coral text-ml-deep px-[26px] pt-[26px] pb-[22px] pr-16 flex flex-col gap-2">
            <span className="text-xs font-extrabold tracking-[0.16em] uppercase">{title}</span>
            <h2 className="m-0 font-display font-extrabold text-[26px] leading-tight tracking-[-0.03em]">
              {type === "inquiry" ? "Tell us what you need. We'll call you back." : "We'll find the right teacher for you."}
            </h2>
            <p className="m-0 text-sm font-semibold leading-snug text-ml-deep/80">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="px-[26px] pt-[22px] pb-[26px] flex flex-col gap-3.5" noValidate>
            {/* Name */}
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Full Name *</span>
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Arjun Kumar"
                maxLength={100}
                className={fieldCls(form.errors.name)}
              />
              {errorText(form.errors.name)}
            </label>

            {/* Phone */}
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Phone Number *</span>
              <input
                value={form.phone}
                onChange={set("phone")}
                placeholder="+91 98765 43210"
                type="tel"
                inputMode="tel"
                maxLength={15}
                className={fieldCls(form.errors.phone)}
              />
              {errorText(form.errors.phone)}
            </label>

            {/* Email */}
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>
                Email <span className="font-semibold tracking-normal normal-case text-ml-muted">(optional)</span>
              </span>
              <input
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                type="email"
                className={fieldCls(form.errors.email)}
              />
              {errorText(form.errors.email)}
            </label>

            {/* Message */}
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>
                Message <span className="font-semibold tracking-normal normal-case text-ml-muted">(optional)</span>
              </span>
              <textarea
                value={form.message}
                onChange={setMessage}
                placeholder="Any specific requirements, preferred timings, or additional details…"
                rows={3}
                maxLength={500}
                className="w-full rounded-2xl border-2 border-ml-line focus:border-ml-violet px-4 py-3 text-[15px] text-ml-ink outline-none resize-none transition-colors placeholder:text-[#A39CB5]"
              />
              <span className={`text-right text-[11px] font-semibold ${form.message.length > 460 ? "text-amber-600" : "text-ml-muted"}`}>
                {form.message.length}/500
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="h-14 rounded-[18px] bg-ml-violet text-white font-extrabold text-base cursor-pointer inline-flex items-center justify-center gap-2 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (<><Spinner /> Submitting…</>) : "Submit Request"}
            </button>

            <p className="m-0 text-center text-xs font-semibold text-ml-muted">We'll contact you within 24 hours</p>
          </form>
        </>
      )}
    </ModalShell>
  );
}
