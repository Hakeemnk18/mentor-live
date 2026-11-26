/**
 * Admin UI design tokens (Mentorlive brand).
 * violet = primary, coral = small accents only (required marks, highlights).
 */
export const ADMIN_COLORS = {
  violet: "#6D35D9",
  violetHover: "#5B2BC0",
  coral: "#FF6B5E",
  deep: "#2A1650",
  muted: "#8A80A3",
  line: "#E4DDF2",
  lineSoft: "#EFE9FA",
  lav: "#F4F1FA",
  lavSoft: "#FAF8FE",
} as const;

/** Text input / textarea classes that match AdminSelect. */
export const adminInputCls = (error?: string | boolean) =>
  [
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2A1650] placeholder:text-[#8A80A3]",
    "transition-[border-color,box-shadow] focus:outline-none focus:ring-[3px]",
    // an error stays red even while typing in the field
    error
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
      : "border-[#E4DDF2] hover:border-[#CBB9F0] focus:border-[#6D35D9] focus:ring-[#6D35D9]/15",
  ].join(" ");

export type StatusTone = "info" | "success" | "warning" | "danger" | "neutral";

/** Status colours shared by AdminBadge and AdminStatusSelect. */
export const STATUS_TONES: Record<StatusTone, { pill: string; dot: string }> = {
  info: { pill: "bg-[#EAF1FF] text-[#2F5BD8] border-[#D3E1FF]", dot: "bg-[#3B6FF0]" },
  success: { pill: "bg-[#DDF3E6] text-[#1E7A4B] border-[#C3EAD3]", dot: "bg-[#22A060]" },
  warning: { pill: "bg-[#FFF1D6] text-[#8A5A00] border-[#FBE2AE]", dot: "bg-[#E0A100]" },
  danger: { pill: "bg-[#FFE3DF] text-[#C8372D] border-[#FFCBC4]", dot: "bg-[#FF6B5E]" },
  neutral: { pill: "bg-[#F4F1FA] text-[#655B7E] border-[#E4DDF2]", dot: "bg-[#A39CB5]" },
};
