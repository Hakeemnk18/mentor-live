import { useLayoutEffect, useRef, useState } from "react";

type Tab<V extends string> = { value: V; label: string };

/**
 * Segmented switch (e.g. One-on-One / Pool / All) with a pill that slides to the active tab.
 * Scrolls sideways on narrow phones instead of squashing.
 */
export default function AdminTabs<V extends string>({
  tabs,
  value,
  onChange,
  label,
  className = "",
}: {
  tabs: Tab<V>[];
  value: V;
  onChange: (value: V) => void;
  /** names the group for screen readers */
  label: string;
  className?: string;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const scroller = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[value];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();

    // if the bar is scrollable (very narrow phones), keep the chosen tab fully on screen, centred
    const box = scroller.current;
    const el = refs.current[value];
    if (box && el && box.scrollWidth > box.clientWidth) {
      const left = el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      box.scrollTo({ left, behavior: first.current || reduce ? "auto" : "smooth" });
    }
    first.current = false;

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value, tabs.length]);

  return (
    <div
      ref={scroller}
      className={`max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {/* phone: tabs share the full width; laptop: compact */}
      <div
        role="tablist"
        aria-label={label}
        className="relative flex w-max min-w-full sm:inline-flex sm:min-w-0 p-1 rounded-full bg-[#F4F1FA] border border-[#E4DDF2]"
      >
        {pill && (
          <span
            aria-hidden
            className="absolute top-1 bottom-1 rounded-full bg-white shadow-[0_4px_12px_-6px_rgba(42,22,80,0.35)] transition-[left,width] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
            style={{ left: pill.left, width: pill.width }}
          />
        )}
        {tabs.map((t) => {
          const on = t.value === value;
          return (
            <button
              key={t.value}
              ref={(el) => {
                refs.current[t.value] = el;
              }}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(t.value)}
              className={`relative z-[1] flex-1 sm:flex-none h-9 px-3 sm:px-5 rounded-full text-[13px] sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/25 ${
                on ? "text-[#6D35D9]" : "text-[#655B7E] hover:text-[#2A1650]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
