import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type DropdownPos = {
  top: number;
  left: number;
  width: number;
  openUp: boolean;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
};

const DROPDOWN_MAX_H = 220; // px — matches max-h-55 (55 × 4 = 220px) below

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className = "",
  hasError = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState<DropdownPos>({
    top: 0,
    left: 0,
    width: 0,
    openUp: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  /** Recalculate the fixed dropdown position from the trigger button rect */
  const calcPos = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < DROPDOWN_MAX_H + 8 && rect.top > DROPDOWN_MAX_H;
    setPos({
      top: openUp ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      openUp,
    });
  };

  // Measure position as soon as the dropdown is toggled open
  useLayoutEffect(() => {
    if (open) calcPos();
  }, [open]);

  // Keep position in sync while the dropdown is open (scroll / resize)
  useEffect(() => {
    if (!open) return;
    const update = () => calcPos();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setOpen(false);
    setSearch("");
  };

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    if (open) setSearch("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm text-left border rounded flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#6D35D9]/30 ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : hasError
            ? "border-red-400 bg-white"
            : open
            ? "border-[#6D35D9]/50 ring-1 ring-[#6D35D9]/20 bg-white"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      >
        <span
          className={
            selected ? "text-gray-800 truncate pr-2" : "text-gray-400"
          }
        >
          {selected
            ? selected.label
            : disabled && !options.length
            ? "—"
            : placeholder}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform text-gray-400 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown — rendered at a fixed position so it escapes overflow containers */}
      {open && !disabled && (
        <div
          style={{
            position: "fixed",
            top: pos.openUp ? undefined : pos.top,
            bottom: pos.openUp ? window.innerHeight - pos.top : undefined,
            left: pos.left,
            width: pos.width,
            zIndex: 99999,
          }}
          className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#6D35D9]/50 focus:ring-1 focus:ring-[#6D35D9]/20"
            />
          </div>
          <ul className="max-h-55 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 text-center">
                No results
              </li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  onMouseDown={() => handleSelect(opt.value)}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    opt.value === value
                      ? "bg-[#6D35D9]/5 text-[#6D35D9] font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && (
                    <svg
                      className="w-3.5 h-3.5 text-[#6D35D9] shrink-0 ml-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
