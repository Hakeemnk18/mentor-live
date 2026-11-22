import toast from "react-hot-toast";

export type ContactChannel = "call" | "whatsapp" | "copy";

type Props = {
  phone: string;
  /** used in the WhatsApp greeting */
  name?: string;
  /** pre-filled WhatsApp message (default: a short booking greeting) */
  whatsappText?: string;
  /** called after Call / WhatsApp (e.g. to offer "Mark as contacted") */
  onReachOut?: (channel: Exclude<ContactChannel, "copy">) => void;
  size?: "sm" | "md";
};

const digits = (p: string) => p.replace(/\D/g, "");

/** Call · WhatsApp · Copy buttons for a phone number (opens the phone dialer / WhatsApp on any device). */
export default function AdminContactActions({ phone, name, whatsappText, onReachOut, size = "sm" }: Props) {
  if (!phone) return null;
  const box = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const icon = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const text =
    whatsappText ?? `Hi${name ? ` ${name.split(" ")[0]}` : ""}, this is Mentorlive regarding your class booking.`;

  const base = `${box} rounded-full inline-flex items-center justify-center border transition-colors cursor-pointer focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/25`;

  return (
    <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        onClick={() => onReachOut?.("call")}
        title={`Call ${phone}`}
        aria-label={`Call ${name ?? phone}`}
        className={`${base} border-[#E4DDF2] bg-white text-[#6D35D9] hover:bg-[#F4F1FA]`}
      >
        <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
      <a
        href={`https://wa.me/${digits(phone)}?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onReachOut?.("whatsapp")}
        title="Message on WhatsApp"
        aria-label={`WhatsApp ${name ?? phone}`}
        className={`${base} border-[#C3EAD3] bg-[#EFFAF3] text-[#1E9E55] hover:bg-[#DDF3E6]`}
      >
        <svg className={icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.48-8.41z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard
            .writeText(phone)
            .then(() => toast.success("Phone number copied"))
            .catch(() => toast.error("Couldn't copy — select the number instead"))
        }
        title="Copy number"
        aria-label={`Copy ${phone}`}
        className={`${base} border-[#E4DDF2] bg-white text-gray-500 hover:text-[#6D35D9] hover:bg-[#F4F1FA]`}
      >
        <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
    </div>
  );
}
