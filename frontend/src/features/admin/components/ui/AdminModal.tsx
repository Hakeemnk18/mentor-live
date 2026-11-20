import { useEffect, useId } from "react";
import type { ReactNode } from "react";

type Size = "sm" | "md" | "lg" | "xl";

type Props = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Sticky footer, usually AdminButtons. */
  footer?: ReactNode;
  size?: Size;
  /** Set false while a nested dialog (e.g. cropper) is open. */
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  /** Stacking level; default 100. */
  zIndex?: number;
};

const SIZES: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/** Dialog shell: header, scrollable body, sticky footer. Phone friendly. */
export default function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnEsc = true,
  closeOnBackdrop = true,
  zIndex = 100,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4" style={{ zIndex }}>
      <div
        className="absolute inset-0 bg-black/40 ml-modal-fade"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full ${SIZES[size]} max-h-[92dvh] flex flex-col rounded-2xl bg-white shadow-[0_30px_60px_-24px_rgba(42,22,80,0.45)] ml-modal-pop`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#EFE9FA] px-4 sm:px-6 py-4 shrink-0">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold text-[#2A1650]">
              {title}
            </h2>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 -mr-2 -mt-1 shrink-0 rounded-full flex items-center justify-center text-gray-400 hover:text-[#6D35D9] hover:bg-[#F4F1FA] cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-[#EFE9FA] px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-end gap-3 bg-white rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes mlModalPop { from { opacity: 0; transform: translateY(8px) scale(.985); } to { opacity: 1; transform: none; } }
        @keyframes mlModalFade { from { opacity: 0; } to { opacity: 1; } }
        .ml-modal-pop  { animation: mlModalPop .2s cubic-bezier(.22,1,.36,1); }
        .ml-modal-fade { animation: mlModalFade .18s ease-out; }
        @media (prefers-reduced-motion: reduce) { .ml-modal-pop, .ml-modal-fade { animation: none; } }
      `}</style>
    </div>
  );
}
