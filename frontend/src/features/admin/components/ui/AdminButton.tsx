import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "soft" | "outline" | "danger" | "success";
type Size = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-[#6D35D9] text-white hover:bg-[#5B2BC0] shadow-[0_8px_18px_-10px_rgba(109,53,217,0.8)]",
  soft: "bg-[#F4F1FA] text-[#6D35D9] hover:bg-[#EDE6FB]",
  outline: "bg-white text-gray-700 border border-[#E4DDF2] hover:bg-[#F4F1FA] hover:border-[#CBB9F0]",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-green-600 text-white hover:bg-green-700",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 sm:h-10 px-5 text-sm gap-2",
};

/** Brand button: pill shape, violet primary. Defaults to type="button". */
export default function AdminButton({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  type = "button",
  disabled,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        "inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap cursor-pointer",
        "transition-[background-color,border-color,opacity,transform] active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/25",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
