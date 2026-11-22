import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";

export type AsyncOption = {
  value: string;
  label: string;
  /** small grey text on the right, e.g. "Physics · Class 11 · CBSE" */
  hint?: string;
};

type Props = {
  /** names the control (screen readers, phone sheet title) */
  label: string;
  placeholder?: string;
  /** chosen options (controlled) — kept as full objects so chips keep their labels */
  selected: AsyncOption[];
  onChange: (next: AsyncOption[]) => void;
  /** fetches matching options for the typed text ("" = first page) */
  loadOptions: (query: string) => Promise<AsyncOption[]>;
  /** values that can't be picked (e.g. already added) */
  disabledValues?: string[];
  disabledHint?: string;
  /** how many results loadOptions returns at most — shows a "type to narrow" note when reached */
  pageSize?: number;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
};

type Pos = { left: number; width: number; top?: number; bottom?: number; maxHeight: number };

const SHEET_QUERY = "(max-width: 639px)";
const DEBOUNCE_MS = 300;

/**
 * Searchable multi-select that loads results from the server as you type.
 * - laptop/tablet: popover under the field · phone: bottom sheet
 * - ↑ ↓ to move, Enter to tick/untick, Esc to close
 */
export default function AdminAsyncMultiSelect({
  label,
  placeholder = "Search and select…",
  selected,
  onChange,
  loadOptions,
  disabledValues = [],
  disabledHint = "Added",
  pageSize,
  searchPlaceholder = "Type to search…",
  emptyText = "No matches",
  disabled,
}: Props) {
  const uid = useId();
  const listId = `${uid}-list`;
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AsyncOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);

  const selectedValues = new Set(selected.map((o) => o.value));
  const blocked = new Set(disabledValues);

  /* ── positioning (same rules as AdminSelect) ── */
  const computePos = (): Pos | null => {
    const el = triggerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const want = 380;
    const below = window.innerHeight - r.bottom - 12;
    const above = r.top - 12;
    const width = Math.max(r.width, 280);
    const left = Math.min(r.left, window.innerWidth - width - 8);
    if (below >= want || below >= above) return { left, width, top: r.bottom + 6, maxHeight: Math.min(want, below - 6) };
    return { left, width, bottom: window.innerHeight - r.top + 6, maxHeight: Math.min(want, above - 6) };
  };

  const openMenu = () => {
    if (disabled) return;
    const isSheet = window.matchMedia(SHEET_QUERY).matches;
    setSheet(isSheet);
    setPos(isSheet ? null : computePos());
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
    requestId.current++; // ignore any in-flight search
  };

  const toggle = (opt: AsyncOption | undefined) => {
    if (!opt || blocked.has(opt.value)) return;
    onChange(selectedValues.has(opt.value) ? selected.filter((o) => o.value !== opt.value) : [...selected, opt]);
  };

  /* ── debounced server search while open ── */
  useEffect(() => {
    if (!open) return;
    const id = ++requestId.current;
    const t = setTimeout(() => {
      setLoading(true);
      setFailed(false);
      loadOptions(query.trim())
        .then((opts) => {
          if (id !== requestId.current) return;
          setResults(opts);
          setActive(0);
        })
        .catch(() => {
          if (id === requestId.current) setFailed(true);
        })
        .finally(() => {
          if (id === requestId.current) setLoading(false);
        });
    }, query ? DEBOUNCE_MS : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, query]);

  /* ── outside click / reposition ── */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      closeMenu();
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

  useEffect(() => {
    if (open && !sheet) searchRef.current?.focus();
  }, [open, sheet]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  /* ── keyboard ── */
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation(); // don't close a parent modal
      closeMenu();
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      toggle(results[active]);
    } else if (e.key === "Tab") {
      closeMenu();
    }
  };

  /* ── pieces ── */
  const searchBox = (
    <div className="p-2 pb-1.5">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A80A3]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14l3.5 3.5" />
        </svg>
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={searchPlaceholder}
          aria-label={`Search ${label.toLowerCase()}`}
          aria-controls={listId}
          aria-activedescendant={results[active] ? `${uid}-opt-${active}` : undefined}
          className="w-full h-10 rounded-lg border border-[#E4DDF2] bg-[#FAF8FE] pl-9 pr-9 text-sm text-[#2A1650] placeholder:text-[#8A80A3] focus:outline-none focus:border-[#6D35D9]"
        />
        {loading && (
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#6D35D9]" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );

  const list = (
    <ul ref={listRef} id={listId} role="listbox" aria-multiselectable="true" aria-label={label} className="p-1.5 pt-0 space-y-0.5">
      {failed && <li className="px-3 py-3 text-sm text-red-500 text-center">Couldn&apos;t load results — try again</li>}
      {!failed && !loading && results.length === 0 && (
        <li className="px-3 py-3 text-sm text-[#8A80A3] text-center">{emptyText}</li>
      )}
      {results.map((o, i) => {
        const isBlocked = blocked.has(o.value);
        const isSel = selectedValues.has(o.value);
        return (
          <li
            key={o.value}
            id={`${uid}-opt-${i}`}
            data-idx={i}
            role="option"
            aria-selected={isSel}
            aria-disabled={isBlocked || undefined}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActive(i)}
            onClick={() => toggle(o)}
            className={[
              "flex items-center gap-2.5 rounded-[10px] px-2.5 select-none transition-colors",
              sheet ? "min-h-[52px]" : "min-h-[44px]",
              isBlocked ? "opacity-55 cursor-not-allowed" : "cursor-pointer",
              i === active && !isBlocked ? "bg-[#F4F1FA]" : "",
            ].join(" ")}
          >
            <span
              aria-hidden
              className={`w-[18px] h-[18px] shrink-0 rounded-[5px] border-2 flex items-center justify-center transition-colors ${
                isBlocked
                  ? "border-[#7FE0A8] bg-[#DDF3E6]"
                  : isSel
                  ? "border-[#6D35D9] bg-[#6D35D9]"
                  : "border-[#D2C6EC] bg-white"
              }`}
            >
              {(isSel || isBlocked) && (
                <svg className={`w-3 h-3 ${isBlocked ? "text-[#1E7A4B]" : "text-white"}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                </svg>
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block truncate text-sm ${isSel ? "font-semibold text-[#6D35D9]" : "text-[#2A1650]"}`}>{o.label}</span>
              {o.hint && <span className="block truncate text-[11px] text-[#8A80A3]">{o.hint}</span>}
            </span>
            {isBlocked && <span className="shrink-0 text-[11px] font-semibold text-[#1E7A4B]">✓ {disabledHint}</span>}
          </li>
        );
      })}
    </ul>
  );

  const footer = (
    <div className="flex items-center justify-between gap-3 border-t border-[#EFE9FA] px-3 py-2.5">
      <span className="text-[11px] text-[#8A80A3]">
        {pageSize && results.length >= pageSize ? `Showing first ${pageSize} — type to narrow` : `${selected.length} selected`}
      </span>
      <button
        type="button"
        onClick={() => {
          closeMenu();
          triggerRef.current?.focus();
        }}
        className="h-8 px-4 rounded-full bg-[#6D35D9] text-white text-xs font-semibold hover:bg-[#5B2BC0] cursor-pointer"
      >
        Done{selected.length ? ` (${selected.length})` : ""}
      </button>
    </div>
  );

  return (
    <>
      {/* Trigger: shows picked items as removable chips */}
      <div
        ref={triggerRef}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label}
        aria-disabled={disabled || undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onKeyDown}
        className={[
          "w-full min-h-11 sm:min-h-10 flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-left text-sm transition-[border-color,box-shadow] focus:outline-none",
          disabled ? "opacity-55 cursor-not-allowed bg-[#FAF8FE]" : "cursor-pointer",
          open
            ? "border-[#6D35D9] ring-[3px] ring-[#6D35D9]/15"
            : "border-[#E4DDF2] hover:border-[#CBB9F0] focus-visible:border-[#6D35D9] focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/15",
        ].join(" ")}
      >
        <svg className="w-4 h-4 shrink-0 text-[#8A80A3]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14l3.5 3.5" />
        </svg>
        <div className="flex-1 min-w-0 flex flex-wrap gap-1.5">
          {selected.length === 0 && <span className="text-[#8A80A3] py-1">{placeholder}</span>}
          {selected.map((o) => (
            <span key={o.value} className="inline-flex items-center gap-1 max-w-full pl-2.5 pr-1 py-0.5 rounded-full bg-[#F4F1FA] border border-[#E4DDF2] text-xs font-medium text-[#6D35D9]">
              <span className="truncate">{o.label}</span>
              <button
                type="button"
                aria-label={`Remove ${o.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(selected.filter((s) => s.value !== o.value));
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[#8A80A3] hover:text-red-500 hover:bg-white cursor-pointer"
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden>
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <svg className={`w-[18px] h-[18px] shrink-0 text-[#6D35D9] transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5.5 7.75 10 12.25l4.5-4.5" />
        </svg>
      </div>

      {open &&
        createPortal(
          sheet ? (
            <div className="fixed inset-0 z-[1200]">
              <div className="absolute inset-0 bg-black/40 ml-ams-fade" onClick={closeMenu} />
              <div
                ref={menuRef}
                className="absolute inset-x-0 bottom-0 max-h-[80dvh] flex flex-col rounded-t-3xl bg-white shadow-[0_-18px_40px_-16px_rgba(42,22,80,0.35)] ml-ams-sheet"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
              >
                <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-[#E4DDF2]" />
                <p className="px-5 pt-3 pb-1 text-base font-semibold text-[#2A1650]">{label}</p>
                <div className="px-3">{searchBox}</div>
                <div className="flex-1 overflow-y-auto px-3">{list}</div>
                {footer}
              </div>
            </div>
          ) : (
            pos && (
              <div
                ref={menuRef}
                className="fixed z-[1200] flex flex-col rounded-2xl border border-[#E4DDF2] bg-white shadow-[0_18px_40px_-16px_rgba(42,22,80,0.35)] ml-ams-pop"
                style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight }}
              >
                {searchBox}
                <div className="flex-1 overflow-y-auto">{list}</div>
                {footer}
              </div>
            )
          ),
          document.body,
        )}

      {open && (
        <style>{`
          @keyframes mlAmsPop { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
          @keyframes mlAmsUp { from { transform: translateY(100%); } to { transform: none; } }
          @keyframes mlAmsFade { from { opacity: 0; } to { opacity: 1; } }
          .ml-ams-pop { animation: mlAmsPop .14s ease-out; }
          .ml-ams-sheet { animation: mlAmsUp .24s cubic-bezier(.22,1,.36,1); }
          .ml-ams-fade { animation: mlAmsFade .2s ease-out; }
          @media (prefers-reduced-motion: reduce) { .ml-ams-pop, .ml-ams-sheet, .ml-ams-fade { animation: none; } }
        `}</style>
      )}
    </>
  );
}
