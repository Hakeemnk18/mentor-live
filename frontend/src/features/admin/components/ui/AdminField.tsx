import type { ReactNode } from "react";

type Props = {
  label: ReactNode;
  required?: boolean;
  /** Grey note after the label. */
  hint?: ReactNode;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
};

/** Label + control + error. Required mark uses the coral accent. */
export default function AdminField({ label, required, hint, error, htmlFor, children }: Props) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#2A1650]/80 mb-1.5">
        {label}
        {required && <span className="text-[#FF6B5E] ml-0.5">*</span>}
        {hint && <span className="font-normal text-gray-400"> {hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
