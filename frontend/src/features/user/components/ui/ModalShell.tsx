import { useEffect } from "react";
import { Close } from "./Icons";

type ModalShellProps = {
  onClose: () => void;
  /** When true, backdrop click / Esc / close button do nothing (e.g. while submitting) */
  locked?: boolean;
  children: React.ReactNode;
  zIndex?: string;
};

/** Blurred backdrop + popping rounded card shared by the booking and lead modals. */
const ModalShell: React.FC<ModalShellProps> = ({ onClose, locked = false, children, zIndex = "z-[2000]" }) => {
  // Esc closes; lock page scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !locked) onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, locked]);

  return (
    <div className={`fixed inset-0 ${zIndex} overflow-y-auto`} role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-[rgba(26,12,52,.55)] backdrop-blur-[6px] animate-ml-fade"
        onClick={() => { if (!locked) onClose(); }}
      />
      <div className="relative min-h-full flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto relative w-full max-w-[470px] bg-white rounded-[32px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(10,0,40,.6)] animate-ml-pop font-jakarta text-ml-ink">
          <button
            type="button"
            onClick={() => { if (!locked) onClose(); }}
            aria-label="Close"
            className="absolute right-4 top-4 z-[3] w-10 h-10 rounded-full bg-white/90 text-ml-deep flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
          >
            <Close className="w-[18px] h-[18px]" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalShell;
