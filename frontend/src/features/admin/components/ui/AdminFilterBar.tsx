import type { ReactNode } from "react";
import AdminSelect from "./AdminSelect";
import { adminInputCls } from "./styles";

/**
 * Lavender bar above a table that holds search + filters.
 * Phone: 2 columns (search and wide items take the full row). Tablet: wrapping row.
 * Laptop (lg+): one line — dropdowns share the space and shrink a little; only wraps if even the smallest sizes cannot fit.
 */
export function AdminFilterBar({
  children,
  onClear,
  canClear = false,
}: {
  children: ReactNode;
  /** resets search + filters (the page decides what that means) */
  onClear?: () => void;
  /** show the "Clear filters" button only when something is set */
  canClear?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end lg:gap-2.5 rounded-2xl border border-[#E4DDF2] bg-[#FAF8FE] p-3.5 sm:p-4 mb-4">
      {children}
      {onClear && canClear && (
        <button
          type="button"
          onClick={onClear}
          className="col-span-2 sm:col-span-1 shrink-0 whitespace-nowrap h-11 sm:h-10 px-4 lg:px-3.5 inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-[#6D35D9] bg-white border border-[#E4DDF2] cursor-pointer transition-colors hover:bg-[#F4F1FA] hover:border-[#CBB9F0] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/25"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
          Clear filters
        </button>
      )}
    </div>
  );
}

/**
 * One labelled control inside AdminFilterBar.
 * - `wide`: takes the full row on phones, a fixed 288px on laptops (use for search)
 * - `width`: laptop width of a normal filter (phones: half the row)
 * - `end`: pushed to the right end of the bar on laptops (e.g. Export)
 * - `fixed`: keeps its natural width on one-line laptops (e.g. a row of buttons)
 */
export function AdminFilter({
  label,
  wide,
  end,
  fixed,
  width = "sm:w-40",
  className = "",
  children,
}: {
  label?: string;
  wide?: boolean;
  end?: boolean;
  fixed?: boolean;
  width?: string;
  className?: string;
  children: ReactNode;
}) {
  const size = wide
    ? "col-span-2 sm:w-72 lg:w-auto lg:flex-[1.6_1_0%] lg:min-w-[136px] lg:max-w-[288px]"
    : end || fixed
      ? `${width} lg:w-auto lg:flex-none lg:shrink-0`
      : `min-w-0 ${width} lg:w-auto lg:flex-[1_1_0%] lg:min-w-[84px] lg:max-w-[200px]`;
  return (
    <div className={`flex flex-col gap-1.5 ${size} ${end ? "col-span-2 sm:col-span-1 sm:ml-auto order-last" : ""} ${className}`}>
      {label && <span className="text-xs font-semibold text-[#2A1650]/80">{label}</span>}
      {children}
    </div>
  );
}

/** Search box with a magnifier icon. */
export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** names the box for screen readers */
  label?: string;
}) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A80A3]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={`${adminInputCls()} pl-9 !py-0 h-11 sm:h-10`}
      />
    </div>
  );
}

/**
 * Labelled filter dropdown with an "All" choice built in ("" = All).
 * Lists longer than 8 get a search box automatically.
 */
export function AdminFilterSelect<V extends string>({
  label,
  value,
  onChange,
  options,
  allLabel = "All",
  width,
  searchable,
}: {
  label: string;
  value: V | "";
  onChange: (value: V | "") => void;
  options: { value: V; label: string }[];
  allLabel?: string;
  width?: string;
  searchable?: boolean;
}) {
  return (
    <AdminFilter label={label} width={width}>
      <AdminSelect<V | "">
        value={value}
        onChange={onChange}
        label={label}
        searchable={searchable ?? options.length > 8}
        options={[{ value: "" as const, label: allLabel }, ...options]}
      />
    </AdminFilter>
  );
}

const PAGE_SIZES = [5, 10, 20, 50];

/** "Rows per page" picker used on every admin table. */
export function AdminPageSize({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <AdminSelect<number>
      value={value}
      onChange={onChange}
      label="Rows per page"
      options={PAGE_SIZES.map((n) => ({ value: n, label: String(n) }))}
    />
  );
}
