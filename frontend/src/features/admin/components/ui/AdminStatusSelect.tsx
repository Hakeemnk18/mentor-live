import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";

export type StatusTone = "info" | "success" | "warning" | "danger" | "neutral";

export type StatusOption<V extends string> = {
  value: V;
  label: string;
  tone: StatusTone;
  /** can't be chosen (still shown, greyed, with the hint) */
  disabled?: boolean;
  /** small grey text under the label */
  hint?: string;
};

export type StatusConfirm = { title: string; message: string; confirmLabel: string };

type Props<V extends string> = {
  value: V;
  options: StatusOption<V>[];
  /** may return a promise — the badge shows a spinner until it settles */
  onChange: (next: V) => Promise<void> | void;
  /** names the control for screen readers / phone sheet title, e.g. "Booking status" */
  label: string;
  /** show a plain badge (no dropdown) */
  readOnly?: boolean;
  /** return a confirm message to ask "Are you sure?" before applying a change (or null to apply at once) */
  confirm?: (next: V) => StatusConfirm | null;
};

const TONES: Record<StatusTone, { pill: string; dot: string }> = {
  info: { pill: "bg-[#EAF1FF] text-[#2F5BD8] border-[#D3E1FF]", dot: "bg-[#3B6FF0]" },
  success: { pill: "bg-[#DDF3E6] text-[#1E7A4B] border-[#C3EAD3]", dot: "bg-[#22A060]" },
  warning: { pill: "bg-[#FFF1D6] text-[#8A5A00] border-[#FBE2AE]", dot: "bg-[#E0A100]" },
  danger: { pill: "bg-[#FFE3DF] text-[#C8372D] border-[#FFCBC4]", dot: "bg-[#FF6B5E]" },
  neutral: { pill: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
};

const SHEET_QUERY = "(max-width: 639px)";
type Pos = { left: number; top?: number; bottom?: number };

/**
 * Status badge that opens a small themed menu to change the status.
 * Laptop: popover under the badge · Phone: bottom sheet. Optional "Are you sure?" step.
 */
export default function AdminStatusSelect<V extends string>({
  value,
  options,
  onChange,
  label,
  readOnly = false,
  confirm,
}: Props<V>) {
  const uid = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState<V | null>(null); // waiting for "Are you sure?"
  const [busy, setBusy] = useState(false);

  const current = options.find((o) => o.value === value) ?? { value, label: value, tone: "neutral" as StatusTone };
  const choices = options.filter((o) => o.value !== value);
  const canChange = !readOnly && choices.some((o) => !o.disabled);
  const tone = TONES[current.tone];

  const computePos = (): Pos | null => {
    const el = triggerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const width = 240;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
    const below = window.innerHeight - r.bottom;
    return below > 240 ? { left, top: r.bottom + 6 } : { left, bottom: window.innerHeight - r.top + 6 };
  };

  const openMenu = () => {
    if (!canChange || busy) return;
    const isSheet = window.matchMedia(SHEET_QUERY).matches;
    setSheet(isSheet);
    setPos(isSheet ? null : computePos());
    setPending(null);
    setActive(Math.max(0, options.findIndex((o) => o.value !== value && !o.disabled)));
    setOpen(true);
  };

  const closeMenu = (refocus = true) => {
    setOpen(false);
    setPending(null);
    if (refocus) triggerRef.current?.focus();
  };

  const apply = async (next: V) => {
    setBusy(true);
    closeMenu(false);
    try {
      await onChange(next);
    } finally {
      setBusy(false);
    }
  };

  const choose = (opt: StatusOption<V> | undefined) => {
    if (!opt || opt.disabled || opt.value === value) return;
    if (confirm?.(opt.value)) setPending(opt.value);
    else void apply(opt.value);
  };

  /* outside click / reposition */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
      setPending(null);
    };
    const onMove = () => {
      if (!window.matchMedia(SHEET_QUERY).matches) setPos(computePos());
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [open]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (pending) setPending(null);
      else closeMenu();
      return;
    }
    if (pending) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === "Tab") {
      closeMenu(false);
    }
  };

  const pill = (
    <span
      className={`inline-flex items-center gap-1.5 h-7 pl-2.5 ${canChange ? "pr-1.5" : "pr-2.5"} rounded-full border text-xs font-semibold whitespace-nowrap ${tone.pill}`}
    >
      {busy ? (
        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} aria-hidden />
      )}
      {current.label}
      {canChange && (
        <svg className={`w-3.5 h-3.5 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5.5 7.75 10 12.25l4.5-4.5" />
        </svg>
      )}
    </span>
  );

  if (!canChange && !busy) return pill;

  const confirmCfg = pending ? confirm?.(pending) : null;

  const body = confirmCfg ? (
    <div className="p-3.5">
      <p className="text-sm font-semibold text-[#2A1650]">{confirmCfg.title}</p>
      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{confirmCfg.message}</p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setPending(null);
            triggerRef.current?.focus(); // keep keyboard focus so Esc / arrows keep working
          }}
          className="h-9 px-3.5 rounded-full border border-[#E4DDF2] bg-white text-xs font-semibold text-gray-700 hover:bg-[#F4F1FA] cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          autoFocus
          onClick={() => pending && void apply(pending)}
          className="h-9 px-3.5 rounded-full bg-[#6D35D9] text-xs font-semibold text-white hover:bg-[#5B2BC0] cursor-pointer"
        >
          {confirmCfg.confirmLabel}
        </button>
      </div>
    </div>
  ) : (
    <ul role="listbox" aria-label={label} className="p-1.5 space-y-0.5">
      {options.map((o, i) => {
        const isCurrent = o.value === value;
        const t = TONES[o.tone];
        return (
          <li
            key={o.value}
            id={`${uid}-opt-${i}`}
            role="option"
            aria-selected={isCurrent}
            aria-disabled={o.disabled || isCurrent || undefined}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActive(i)}
            onClick={() => choose(o)}
            className={[
              "flex items-center gap-2.5 rounded-[10px] px-3 select-none transition-colors",
              sheet ? "min-h-[52px]" : "min-h-[42px]",
              o.disabled ? "opacity-50 cursor-not-allowed" : isCurrent ? "cursor-default" : "cursor-pointer",
              i === active && !o.disabled && !isCurrent ? "bg-[#F4F1FA]" : "",
            ].join(" ")}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${t.dot}`} aria-hidden />
            <span className="flex-1 min-w-0">
              <span className={`block text-sm ${isCurrent ? "font-semibold text-[#2A1650]" : "text-[#2A1650]"}`}>{o.label}</span>
              {o.hint && <span className="block text-[11px] text-[#8A80A3] leading-snug">{o.hint}</span>}
            </span>
            {isCurrent && (
              <span className="shrink-0 text-[11px] font-semibold text-[#8A80A3]">Current</span>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${current.label}. Change`}
        disabled={busy}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onKeyDown}
        className="rounded-full cursor-pointer transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/25 disabled:cursor-wait"
      >
        {pill}
      </button>

      {open &&
        createPortal(
          sheet ? (
            <div className="fixed inset-0 z-[1200]" onKeyDown={onKeyDown}>
              <div className="absolute inset-0 bg-black/40 ml-ss-fade" onClick={() => closeMenu()} />
              <div
                ref={menuRef}
                className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white shadow-[0_-18px_40px_-16px_rgba(42,22,80,0.35)] ml-ss-sheet"
                style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
              >
                <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-[#E4DDF2]" />
                <p className="px-5 pt-3 pb-1 text-base font-semibold text-[#2A1650]">{label}</p>
                <div className="px-3 pb-2">{body}</div>
              </div>
            </div>
          ) : (
            pos && (
              <div
                ref={menuRef}
                onKeyDown={onKeyDown}
                className="fixed z-[1200] w-[240px] rounded-2xl border border-[#E4DDF2] bg-white shadow-[0_18px_40px_-16px_rgba(42,22,80,0.35)] ml-ss-pop"
                style={{ left: pos.left, top: pos.top, bottom: pos.bottom }}
              >
                {body}
              </div>
            )
          ),
          document.body,
        )}

      {open && (
        <style>{`
          @keyframes mlSsPop { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
          @keyframes mlSsUp { from { transform: translateY(100%); } to { transform: none; } }
          @keyframes mlSsFade { from { opacity: 0; } to { opacity: 1; } }
          .ml-ss-pop { animation: mlSsPop .14s ease-out; }
          .ml-ss-sheet { animation: mlSsUp .24s cubic-bezier(.22,1,.36,1); }
          .ml-ss-fade { animation: mlSsFade .2s ease-out; }
          @media (prefers-reduced-motion: reduce) { .ml-ss-pop, .ml-ss-sheet, .ml-ss-fade { animation: none; } }
        `}</style>
      )}
    </>
  );
}
