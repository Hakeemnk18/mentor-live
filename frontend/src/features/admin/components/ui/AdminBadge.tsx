import type { ReactNode } from "react";
import { STATUS_TONES } from "./styles";
import type { StatusTone } from "./styles";

type Props = {
  tone?: StatusTone;
  children: ReactNode;
  /** small coloured dot before the text (default on) */
  dot?: boolean;
  className?: string;
};

/** Read-only status pill (Active / Inactive, Shown / Hidden, …). Same colours as AdminStatusSelect. */
export default function AdminBadge({ tone = "neutral", children, dot = true, className = "" }: Props) {
  const t = STATUS_TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-xs font-semibold whitespace-nowrap ${t.pill} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} aria-hidden />}
      {children}
    </span>
  );
}
