import { useState } from "react";
import { handleApiError } from "../utils/handle.api.error";

type Props = {
  /** Performs the export request and triggers the file download */
  onExport: () => Promise<void>;
  label?: string;
  className?: string;
};

/** Reusable "Export" button with a built-in loading state — works for any module/format. */
export default function ExportButton({ onExport, label = "Export CSV", className = "" }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onExport();
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 h-11 sm:h-10 px-4 whitespace-nowrap text-sm font-semibold bg-white border border-[#E4DDF2] rounded-full text-[#2A1650] cursor-pointer hover:bg-[#F4F1FA] hover:border-[#CBB9F0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
      )}
      {loading ? "Exporting…" : label}
    </button>
  );
}
