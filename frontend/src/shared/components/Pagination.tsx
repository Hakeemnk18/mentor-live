import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  description?: React.ReactNode;
  /** scroll back to the top of the list after changing page (default on) */
  scrollToTop?: boolean;
}

type Item = number | "start-gap" | "end-gap";

/**
 * Which buttons to show: only the first page, the last page and the pages right next to
 * the current one; everything else becomes "…". Short lists (up to 4 pages) show all.
 *   6 pages, on 1:  1 2 … 6
 *   6 pages, on 3:  1 2 3 4 … 6
 *   9 pages, on 5:  1 … 4 5 6 … 9
 *   9 pages, on 9:  1 … 8 9
 */
function pageItems(page: number, total: number): Item[] {
  if (total <= 4) return Array.from({ length: total }, (_, i) => i + 1);
  const show = [...new Set([1, page - 1, page, page + 1, total])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const items: Item[] = [];
  show.forEach((p, i) => {
    if (i > 0 && p - show[i - 1] > 1) items.push(p < page ? "start-gap" : "end-gap");
    items.push(p);
  });
  return items;
}

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

const base =
  "h-9 max-[379px]:h-[30px] inline-flex items-center justify-center rounded-full text-sm max-[379px]:text-[13px] font-semibold tabular-nums transition-colors focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/25";
const idle = "border border-[#E4DDF2] bg-white text-[#2A1650] cursor-pointer hover:bg-[#F4F1FA] hover:border-[#CBB9F0]";

/** Responsive page switcher used under every admin table. Hidden when there is only one page. */
export default function Pagination({ page, totalPages, onPageChange, description, scrollToTop = true }: PaginationProps) {
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
    if (scrollToTop) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  };

  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col-reverse items-center gap-2.5 pt-4 sm:flex-row sm:justify-between sm:gap-4"
    >
      <p className="m-0 text-xs sm:text-sm text-[#655B7E] text-center sm:text-left">
        Page <span className="font-semibold text-[#2A1650]">{page}</span> of {totalPages}
        {description && <span>&nbsp;&middot;&nbsp;{description}</span>}
      </p>

      <div className="flex items-center gap-1 max-[379px]:gap-0.5 sm:gap-1.5">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={atStart}
          aria-label="Previous page"
          className={`${base} ${idle} w-9 max-[379px]:w-[30px] sm:w-auto sm:px-3.5 sm:gap-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white`}
        >
          <Arrow dir="left" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {pageItems(page, totalPages).map((it) =>
          typeof it === "number" ? (
            <button
              key={it}
              type="button"
              onClick={() => go(it)}
              aria-label={`Page ${it}`}
              aria-current={it === page ? "page" : undefined}
              className={`${base} min-w-9 max-[379px]:min-w-[30px] px-2 max-[379px]:px-1 ${
                it === page
                  ? "bg-[#6D35D9] border border-[#6D35D9] text-white shadow-[0_6px_14px_-8px_rgba(109,53,217,0.8)] cursor-default"
                  : idle
              }`}
            >
              {it}
            </button>
          ) : (
            <span key={it} className="w-6 max-[379px]:w-4 sm:w-7 text-center text-sm text-[#8A80A3] select-none" aria-hidden>
              …
            </span>
          ),
        )}

        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={atEnd}
          aria-label="Next page"
          className={`${base} ${idle} w-9 max-[379px]:w-[30px] sm:w-auto sm:px-3.5 sm:gap-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white`}
        >
          <span className="hidden sm:inline">Next</span>
          <Arrow dir="right" />
        </button>
      </div>
    </nav>
  );
}
