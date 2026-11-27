import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Column, TableAction } from "./types";

type AdminTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  getRowId?: (row: T, index: number) => string;
  /**
   * Phones (under 640px): show each row as a card instead of a sideways-scrolling table.
   * Set to false to go back to the scrolling table everywhere.
   */
  mobileCards?: boolean;
  /**
   * Data is being (re)loaded. The table stays on screen so it never jumps:
   * first load shows placeholder rows, later loads keep the current rows (slightly dimmed).
   */
  loading?: boolean;
};

const SKELETON_ROWS = 5;
const Bone = ({ w = "w-24" }: { w?: string }) => <span className={`block h-3.5 ${w} max-w-full rounded-full bg-[#EFE9FA]`} />;
const BONE_WIDTHS = ["w-32", "w-20", "w-28", "w-16", "w-24"];

/** Rounded pill shape shared by every row action; pages may still pass their own colour classes. */
const ACTION_SHAPE =
  "inline-flex items-center px-3 py-1.5 rounded-full transition-colors hover:bg-[#F4F1FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D35D9]/30";

export default function AdminTable<T>({
  data,
  columns,
  actions,
  getRowId,
  mobileCards = true,
  loading = false,
}: AdminTableProps<T>) {
  /* ── stable columns: remember each column's width and never let it shrink while filtering /
     changing statuses, so the table doesn't shift. Reset on resize or when the columns change. ── */
  const headRow = useRef<HTMLTableRowElement>(null);
  const [minWidths, setMinWidths] = useState<number[]>([]);
  const colsKey = columns.map((c) => c.key).join("|") + (actions ? "|actions" : "");
  const [lastColsKey, setLastColsKey] = useState(colsKey);
  if (colsKey !== lastColsKey) {
    setLastColsKey(colsKey);
    setMinWidths([]);
  }

  useEffect(() => {
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setMinWidths([]), 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, []);

  useLayoutEffect(() => {
    const row = headRow.current;
    if (!row || loading || data.length === 0 || row.offsetParent === null) return; // hidden on phones
    const now = Array.from(row.children).map((th) => Math.ceil((th as HTMLElement).getBoundingClientRect().width));
    setMinWidths((prev) => {
      const next = now.map((w, i) => Math.max(w, prev[i] ?? 0));
      return next.length === prev.length && next.every((w, i) => w === prev[i]) ? prev : next;
    });
  }, [data, loading, colsKey, minWidths.length]);

  /* ── wide tables: slim scrollbar + soft fade on the side that has hidden columns ── */
  const scroller = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ left: false, right: false });
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      const left = el.scrollLeft > 2;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
      setFade((f) => (f.left === left && f.right === right ? f : { left, right }));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [data, columns.length]);

  const showSkeleton = loading && data.length === 0;
  const refreshing = loading && data.length > 0;
  const dim = `transition-opacity duration-200 ${refreshing ? "opacity-55 pointer-events-none" : "opacity-100"}`;
  const colSpan = columns.length + (actions ? 1 : 0);
  const rowKey = (row: T, idx: number) => (getRowId ? getRowId(row, idx) : String(idx));

  const renderActions = (row: T) =>
    actions!.map((action) => {
      const label = typeof action.label === "function" ? action.label(row) : action.label;
      const customClass = typeof action.className === "function" ? action.className(row) : action.className;
      return (
        <button
          key={label}
          type="button"
          onClick={() => action.onClick(row)}
          className={`${ACTION_SHAPE} ${
            customClass ??
            `text-sm font-medium cursor-pointer ${
              action.variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-gray-600 hover:text-[#6D35D9]"
            }`
          }`}
        >
          {label}
        </button>
      );
    });

  const [titleCol, ...detailCols] = columns;

  return (
    <>
    {/* ── Phone: one card per row ── */}
    {mobileCards && (
      <div className="sm:hidden" aria-busy={loading || undefined}>
        {showSkeleton ? (
          <ul className="m-0 p-0 list-none flex flex-col gap-3" aria-hidden>
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="rounded-2xl border border-[#E4DDF2] bg-white p-4 space-y-3 animate-pulse">
                <Bone w="w-40" />
                <Bone w="w-28" />
                <Bone w="w-20" />
              </li>
            ))}
          </ul>
        ) : data.length === 0 ? (
          <div className="rounded-2xl border border-[#E4DDF2] bg-white px-4 py-10 text-center text-sm text-gray-500">
            No records found
          </div>
        ) : (
          <ul className={`m-0 p-0 list-none flex flex-col gap-3 ${dim}`}>
            {data.map((row, idx) => (
              <li
                key={rowKey(row, idx)}
                className="rounded-2xl border border-[#E4DDF2] bg-white p-4 shadow-[0_10px_24px_-20px_rgba(42,22,80,0.45)]"
              >
                {titleCol && (
                  <div className="text-[15px] font-semibold text-[#2A1650] min-w-0 break-words">{titleCol.render(row)}</div>
                )}
                {detailCols.length > 0 && (
                  <dl className="m-0 mt-3 grid grid-cols-[minmax(84px,auto)_1fr] gap-x-4 gap-y-2.5 text-sm">
                    {detailCols.map((col) => (
                      <div key={col.key} className="contents">
                        <dt className="pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A80A3]">{col.label}</dt>
                        <dd className="m-0 min-w-0 break-words text-gray-700">{col.render(row)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {actions && actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EFE9FA] flex flex-wrap justify-end gap-1">{renderActions(row)}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}

    {/* ── Laptop / tablet (and phones when mobileCards is off): the table ── */}
    <div
      aria-busy={loading || undefined}
      className={`${mobileCards ? "hidden sm:block" : ""} relative rounded-2xl border border-[#E4DDF2] bg-white shadow-[0_12px_32px_-22px_rgba(42,22,80,0.35)] overflow-hidden`}
    >
      {/* thin moving bar on the table's top edge while loading */}
      {loading && (
        <span aria-hidden className="absolute inset-x-0 top-0 z-[1] h-[3px] overflow-hidden">
          <span className="ml-table-bar block h-full w-1/3 rounded-full bg-gradient-to-r from-[#6D35D9] to-[#FF6B5E]" />
        </span>
      )}
      {/* fades hint that more columns are hidden to the side */}
      <span aria-hidden className={`pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-white to-transparent transition-opacity duration-200 ${fade.left ? "opacity-100" : "opacity-0"}`} />
      <span aria-hidden className={`pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${fade.right ? "opacity-100" : "opacity-0"}`} />
      <style>{`.ml-table-scroll{scrollbar-width:thin;scrollbar-color:#D9CCF5 transparent}.ml-table-scroll::-webkit-scrollbar{height:6px}.ml-table-scroll::-webkit-scrollbar-track{background:transparent}.ml-table-scroll::-webkit-scrollbar-thumb{background:#D9CCF5;border-radius:999px}.ml-table-scroll:hover::-webkit-scrollbar-thumb{background:#6D35D9}@keyframes mlTableBar{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}.ml-table-bar{animation:mlTableBar 1.1s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.ml-table-bar{animation:none;width:100%;opacity:.5}}`}</style>
      <div ref={scroller} className="overflow-x-auto ml-table-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F4F1FA] text-[#655B7E]">
            <tr ref={headRow}>
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  style={minWidths[i] ? { minWidth: minWidths[i] } : undefined}
                  className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th
                  style={minWidths[columns.length] ? { minWidth: minWidths[columns.length] } : undefined}
                  className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className={`text-gray-700 ${dim}`}>
            {showSkeleton ? (
              Array.from({ length: SKELETON_ROWS }, (_, r) => (
                <tr key={`sk${r}`} className="border-t border-[#EFE9FA] animate-pulse" aria-hidden>
                  {columns.map((col, c) => (
                    <td key={col.key} className="px-4 py-[18px]">
                      <Bone w={BONE_WIDTHS[(r + c) % BONE_WIDTHS.length]} />
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-[18px]">
                      <span className="ml-auto block w-16"><Bone w="w-16" /></span>
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={rowKey(row, idx)}
                  className="border-t border-[#EFE9FA] transition-colors hover:bg-[#FAF8FE]"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      {col.render(row)}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1">{renderActions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
