type IconProps = { className?: string; strokeWidth?: number };

const base = (d: string, defaultStroke = 2.8) =>
  ({ className = "w-4 h-4", strokeWidth = defaultStroke }: IconProps) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );

export const ArrowRight = base("M5 12h14M13 6l6 6-6 6");
export const ChevronRight = base("M9 6l6 6-6 6");
export const ChevronLeft = base("M15 6l-6 6 6 6");
export const Check = base("M5 13l4 4L19 7", 3);
export const Close = base("M6 6l12 12M18 6L6 18");
export const Cross = base("M7 7l10 10M17 7L7 17", 3.4);

export const Search = ({ className = "w-[18px] h-[18px]" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

/** Filled student silhouette used in seat / pool visuals */
export const Person = ({ className = "w-1/2 h-1/2", fill = "currentColor" }: { className?: string; fill?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
    <circle cx="12" cy="8" r="4.2" />
    <path d="M4 20.5c0-4.2 3.6-7 8-7s8 2.8 8 7z" />
  </svg>
);

export const Spinner = ({ className = "w-4 h-4" }: IconProps) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* Feature icons (outline, 24px grid) */
export const Group = base(
  "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.3a3.5 3.5 0 0 1 0 6.4 M18 14.2a6.5 6.5 0 0 1 3.5 5.8",
  2,
);
export const RupeeCoin = base(
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8.5 7.5h7 M8.5 10.5h7 M11 7.5c2.2 0 3 1.1 3 1.5s-.8 1.5-3 1.5H9.5l4.5 6",
  2,
);
export const Award = base(
  "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.5 13.9 7 21l5-3 5 3-1.5-7.1 M9.6 9.1l1.6 1.6 3.2-3.2",
  2,
);
