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
    "transition-[border-color,box-shadow] focus:outline-none focus:border-[#6D35D9] focus:ring-[3px] focus:ring-[#6D35D9]/15",
    error ? "border-red-400" : "border-[#E4DDF2] hover:border-[#CBB9F0]",
  ].join(" ");
