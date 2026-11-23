import { useMemo, useState } from "react";
import { initials, tintFor } from "./ui/tints";
import { Check, Search } from "./ui/Icons";

export type SubjectPickerItem = {
  variantId: string;
  subjectName: string;
  className: string;
  syllabusName: string;
  classId?: string;
  syllabusId?: string;
  price: number;
};

type Props = {
  offerings: SubjectPickerItem[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
};

/** Show a search box when one class has more subjects than this. */
const SEARCH_THRESHOLD = 8;
/** Rows shown before "Show all" (keeps long lists short, esp. on phones). */
const COLLAPSED_ROWS = 6;

const groupKey = (o: SubjectPickerItem) => `${o.syllabusId || o.syllabusName}__${o.classId || o.className}`;

/**
 * Subjects grouped by class & syllabus.
 * - more than one class → class tabs, then that class's subjects
 * - one class (e.g. student came from Book Tutor) → no tabs, just the subjects
 * Compact rows keep the card short even with many subjects.
 */
export default function SubjectPicker({ offerings, activeVariantId, onSelect }: Props) {
  const groups = useMemo(() => {
    const map = new Map<string, { key: string; label: string; items: SubjectPickerItem[] }>();
    for (const o of offerings) {
      const key = groupKey(o);
      if (!map.has(key)) map.set(key, { key, label: `${o.className} · ${o.syllabusName}`, items: [] });
      map.get(key)!.items.push(o);
    }
    return [...map.values()];
  }, [offerings]);

  // open the class of the already-selected subject, else the first class
  const [tabKey, setTabKey] = useState<string>(() => {
    const sel = offerings.find((o) => o.variantId === activeVariantId);
    return sel ? groupKey(sel) : groups[0]?.key ?? "";
  });
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const current = groups.find((g) => g.key === tabKey) ?? groups[0];
  if (!current) return null;

  const selectedKey = (() => {
    const sel = offerings.find((o) => o.variantId === activeVariantId);
    return sel ? groupKey(sel) : null;
  })();

  const showTabs = groups.length > 1;
  const showSearch = current.items.length > SEARCH_THRESHOLD;
  const q = query.trim().toLowerCase();
  const matches = showSearch && q ? current.items.filter((o) => o.subjectName.toLowerCase().includes(q)) : current.items;
  // keep the selected subject visible even when the list is collapsed
  const collapsible = !q && matches.length > COLLAPSED_ROWS;
  const items =
    collapsible && !expanded
      ? matches.filter((o, i) => i < COLLAPSED_ROWS || o.variantId === activeVariantId)
      : matches;

  return (
    <div className="flex flex-col gap-3.5">
      {/* Class tabs */}
      {showTabs ? (
        <div role="tablist" aria-label="Class" className="-mx-1 px-1 flex gap-2 overflow-x-auto no-scrollbar snap-x">
          {groups.map((g) => {
            const on = g.key === current.key;
            return (
              <button
                key={g.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setTabKey(g.key);
                  setQuery("");
                  setExpanded(false);
                }}
                className={`snap-start shrink-0 inline-flex items-center gap-2 h-10 pl-4 pr-2 rounded-full border-2 text-[13px] font-extrabold whitespace-nowrap cursor-pointer transition-colors ${
                  on
                    ? "bg-ml-deep border-ml-deep text-white"
                    : "bg-white border-ml-line text-ml-ink hover:border-ml-violet"
                }`}
              >
                {g.label}
                {/* dot = the selected subject is in this class */}
                {selectedKey === g.key && !on && <span className="w-1.5 h-1.5 rounded-full bg-ml-coral" aria-label="selected subject" />}
                <span
                  className={`min-w-6 h-6 px-1.5 rounded-full text-[11px] inline-flex items-center justify-center ${
                    on ? "bg-white/15 text-white" : "bg-ml-page text-ml-muted"
                  }`}
                >
                  {g.items.length}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <span className="text-xs font-extrabold tracking-[0.12em] uppercase text-ml-muted">{current.label}</span>
      )}

      {/* Search — only for long lists */}
      {showSearch && (
        <label className="relative">
          <span className="sr-only">Search subjects</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ml-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${current.items.length} subjects…`}
            className="w-full h-11 rounded-2xl border-2 border-ml-line bg-white pl-10 pr-4 text-sm text-ml-ink outline-none placeholder:text-[#A39CB5] focus:border-ml-violet"
          />
        </label>
      )}

      {/* Subjects */}
      <div role="tabpanel" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((o) => {
          const on = o.variantId === activeVariantId;
          const tint = tintFor(o.subjectName);
          return (
            <button
              key={o.variantId}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(o.variantId)}
              className={`group flex items-center gap-3 min-h-[60px] pl-2.5 pr-3.5 py-2 rounded-2xl border-2 text-left cursor-pointer transition-colors ${
                on ? "border-ml-violet bg-[#F4F1FA]" : "border-ml-line bg-white hover:border-[#CBB9F0] hover:bg-[#FAF8FE]"
              }`}
            >
              <span
                aria-hidden
                className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-display font-extrabold text-[15px]"
                style={{ background: tint.bg, color: tint.ink }}
              >
                {initials(o.subjectName, 1)}
              </span>
              <span className="flex-1 min-w-0 font-extrabold text-[15px] leading-tight text-ml-ink truncate">{o.subjectName}</span>
              <span className={`shrink-0 text-sm font-extrabold ${on ? "text-ml-violet" : "text-ml-ink"}`}>
                ₹{o.price}
                <span className="text-[11px] font-bold text-ml-muted">/hr</span>
              </span>
              <span
                aria-hidden
                className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  on ? "bg-ml-violet border-ml-violet text-white" : "border-ml-line text-transparent group-hover:border-[#CBB9F0]"
                }`}
              >
                <Check className="w-3 h-3" />
              </span>
            </button>
          );
        })}
        {collapsible && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="sm:col-span-2 h-10 rounded-2xl border-2 border-dashed border-ml-line text-[13px] font-extrabold text-ml-violet hover:border-ml-violet hover:bg-[#FAF8FE] cursor-pointer transition-colors"
          >
            {expanded ? "Show fewer" : `Show all ${matches.length} subjects`}
          </button>
        )}
        {items.length === 0 && (
          <p className="sm:col-span-2 m-0 py-4 text-center text-sm text-ml-muted">No subject matches “{query}”</p>
        )}
      </div>
    </div>
  );
}
