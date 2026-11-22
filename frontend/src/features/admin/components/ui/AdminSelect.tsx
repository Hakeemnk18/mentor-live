import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";

export type SelectOption<V extends string | number> = {
  value: V;
  label: string;
  disabled?: boolean;
  /** Small grey text on the right of the option. */
  hint?: string;
};

type Props<V extends string | number> = {
  value: V | "" | null | undefined;
  options: SelectOption<V>[];
  onChange: (value: V) => void;
  /** Shown when the value matches no option. */
  placeholder?: string;
  /** Visible label is rendered by the page; this names the control for screen readers and the phone sheet title. */
  label?: string;
  error?: string | boolean;
  disabled?: boolean;
  /** Adds a search box at the top of the list (good for long lists). */
  searchable?: boolean;
  emptyText?: string;
  id?: string;
  className?: string;
};

type Pos = { left: number; width: number; top?: number; bottom?: number; maxHeight: number };

const ROW_H = 40;
const SHEET_QUERY = "(max-width: 639px)";

/**
 * Brand-themed dropdown. Looks identical in every browser.
 * - laptop/tablet: popover under the field (flips up when there is no room)
 * - phone: bottom sheet with large tap targets
 * - keyboard: ↑ ↓ Home End Enter Space Esc Tab, ARIA select-only combobox
 */
export default function AdminSelect<V extends string | number>({
  value,
  options,
  onChange,
  placeholder = "Select…",
  label,
  error,
  disabled,
  searchable,
  emptyText = "No matches",
  id,
  className = "",
}: Props<V>) {
  const uid = useId();
  const listId = `${uid}-list`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [active, setActive] = useState(-1);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const rows = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  /* ── positioning ── */
  const computePos = (): Pos | null => {
    const el = triggerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const want = Math.min(options.length * ROW_H + 12 + (searchable ? 52 : 0), 320);
    const below = window.innerHeight - r.bottom - 12;
    const above = r.top - 12;
    const width = Math.max(r.width, 160);
    const left = Math.min(r.left, window.innerWidth - width - 8);
    if (below >= want || below >= above) {
      return { left, width, top: r.bottom + 6, maxHeight: Math.min(320, below - 6) };
    }
    return { left, width, bottom: window.innerHeight - r.top + 6, maxHeight: Math.min(320, above - 6) };
  };

  const firstEnabled = (list: SelectOption<V>[], from = 0, step = 1) => {
    for (let i = from; i >= 0 && i < list.length; i += step) if (!list[i].disabled) return i;
    return -1;
  };

  const openMenu = () => {
    if (disabled) return;
    const isSheet = window.matchMedia(SHEET_QUERY).matches;
    setSheet(isSheet);
    setPos(isSheet ? null : computePos());
    setQuery("");
    const idx = options.findIndex((o) => o.value === value);
    setActive(idx >= 0 && !options[idx].disabled ? idx : firstEnabled(options));
    setOpen(true);
  };

  const closeMenu = (refocus = true) => {
    setOpen(false);
    setQuery("");
    if (refocus) triggerRef.current?.focus();
  };

  const choose = (opt: SelectOption<V> | undefined) => {
    if (!opt || opt.disabled) return;
    if (opt.value !== value) onChange(opt.value);
    closeMenu();
  };

  /* ── effects: outside click, reposition, focus, keep active row visible ── */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
      setQuery("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open && searchable && !sheet) searchRef.current?.focus();
  }, [open, searchable, sheet]);

  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  /* ── keyboard ── */
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (disabled) return;
    const k = e.key;
    if (!open) {
      if (k === "ArrowDown" || k === "ArrowUp" || k === "Enter" || k === " ") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (k === "Escape") {
      e.preventDefault();
      e.stopPropagation(); // don't also close a parent modal
      closeMenu();
    } else if (k === "Tab") {
      closeMenu(false);
    } else if (k === "ArrowDown") {
      e.preventDefault();
      const n = firstEnabled(rows, active + 1);
      if (n >= 0) setActive(n);
    } else if (k === "ArrowUp") {
      e.preventDefault();
      const n = firstEnabled(rows, active - 1, -1);
      if (n >= 0) setActive(n);
    } else if (k === "Home") {
      e.preventDefault();
      setActive(firstEnabled(rows));
    } else if (k === "End") {
      e.preventDefault();
      setActive(firstEnabled(rows, rows.length - 1, -1));
    } else if (k === "Enter" || (k === " " && !(searchable && e.target === searchRef.current))) {
      e.preventDefault();
      choose(rows[active]);
    }
  };

  /* ── pieces ── */
  const triggerCls = [
    "group w-full inline-flex items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-left text-sm",
    "h-11 sm:h-10 transition-[border-color,box-shadow] focus:outline-none",
    disabled ? "cursor-not-allowed opacity-55 bg-[#FAF8FE]" : "cursor-pointer",
    error
      ? "border-red-400"
      : open
      ? "border-[#6D35D9] ring-[3px] ring-[#6D35D9]/15"
      : "border-[#E4DDF2] hover:border-[#CBB9F0] focus-visible:border-[#6D35D9] focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/15",
    className,
  ].join(" ");

  const searchBox = searchable && (
    <div className="p-1.5 pb-1">
      <input
        ref={searchRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        placeholder="Search…"
        aria-label="Search options"
        className="w-full h-10 rounded-lg border border-[#E4DDF2] bg-[#FAF8FE] px-3 text-sm text-[#2A1650] placeholder:text-[#8A80A3] focus:outline-none focus:border-[#6D35D9]"
      />
    </div>
  );

  const list = (
    <ul ref={listRef} id={listId} role="listbox" aria-label={label ?? placeholder} className="p-1.5 space-y-0.5">
      {rows.length === 0 && <li className="px-3 py-3 text-sm text-[#8A80A3] text-center">{emptyText}</li>}
      {rows.map((o, i) => {
        const isSel = o.value === value;
        const isActive = i === active;
        return (
          <li
            key={String(o.value)}
            id={`${uid}-opt-${i}`}
            data-idx={i}
            role="option"
            aria-selected={isSel}
            aria-disabled={o.disabled || undefined}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => !o.disabled && setActive(i)}
            onClick={() => choose(o)}
            className={[
              "flex items-center gap-2 rounded-[10px] px-3 select-none transition-colors",
              sheet ? "min-h-[48px] text-[15px]" : "min-h-[38px] text-sm",
              o.disabled
                ? "opacity-45 cursor-not-allowed text-[#2A1650]"
                : isSel
                ? "bg-[#EDE6FB] text-[#6D35D9] font-semibold cursor-pointer"
                : isActive
                ? "bg-[#F4F1FA] text-[#6D35D9] cursor-pointer"
                : "text-[#2A1650] cursor-pointer",
            ].join(" ")}
          >
            <span className="flex-1 truncate">{o.label}</span>
            {o.hint && <span className="text-xs text-[#8A80A3] font-normal">{o.hint}</span>}
            {isSel && (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4.5 10.5l3.5 3.5 7.5-8" />
              </svg>
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
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? `${uid}-opt-${active}` : undefined}
        aria-label={label}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onKeyDown}
        className={triggerCls}
      >
        <span className={`truncate ${selected ? "text-[#2A1650]" : "text-[#8A80A3]"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`w-[18px] h-[18px] shrink-0 text-[#6D35D9] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5.5 7.75 10 12.25l4.5-4.5" />
        </svg>
      </button>

      {open &&
        createPortal(
          sheet ? (
            <div className="fixed inset-0 z-[1200]">
              <div className="absolute inset-0 bg-black/40 ml-sel-fade" onClick={() => closeMenu()} />
              <div
                ref={menuRef}
                className="absolute inset-x-0 bottom-0 max-h-[75dvh] flex flex-col rounded-t-3xl bg-white shadow-[0_-18px_40px_-16px_rgba(42,22,80,0.35)] ml-sel-sheet"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
              >
                <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-[#E4DDF2]" />
                <div className="flex items-center justify-between px-5 pt-3 pb-2">
                  <p className="text-base font-semibold text-[#2A1650]">{label ?? placeholder}</p>
                  <button
                    type="button"
                    onClick={() => closeMenu()}
                    aria-label="Close"
                    className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-[#8A80A3] hover:bg-[#F4F1FA] cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                      <path d="M5 5l10 10M15 5L5 15" />
                    </svg>
                  </button>
                </div>
                <div className="px-3">{searchBox}</div>
                <div className="overflow-y-auto px-3 pb-4">{list}</div>
              </div>
            </div>
          ) : (
            pos && (
              <div
                ref={menuRef}
                className="fixed z-[1200] flex flex-col rounded-2xl border border-[#E4DDF2] bg-white shadow-[0_18px_40px_-16px_rgba(42,22,80,0.35)] ml-sel-pop"
                style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight }}
              >
                {searchBox}
                <div className="overflow-y-auto">{list}</div>
              </div>
            )
          ),
          document.body,
        )}

      {open && (
        <style>{`
          @keyframes mlSelPop { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
          @keyframes mlSelUp  { from { transform: translateY(100%); } to { transform: none; } }
          @keyframes mlSelFade { from { opacity: 0; } to { opacity: 1; } }
          .ml-sel-pop   { animation: mlSelPop .14s ease-out; }
          .ml-sel-sheet { animation: mlSelUp .24s cubic-bezier(.22,1,.36,1); }
          .ml-sel-fade  { animation: mlSelFade .2s ease-out; }
          @media (prefers-reduced-motion: reduce) { .ml-sel-pop, .ml-sel-sheet, .ml-sel-fade { animation: none; } }
        `}</style>
      )}
    </>
  );
}
