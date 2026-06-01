import { useEffect, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
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
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm text-left border rounded flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : hasError
            ? "border-red-400 bg-white"
            : open
            ? "border-[#DB313E]/50 ring-1 ring-[#DB313E]/20 bg-white"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      >
        <span className={selected ? "text-gray-800 truncate pr-2" : "text-gray-400"}>
          {selected ? selected.label : disabled && !options.length ? "—" : placeholder}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform text-gray-400 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && !disabled && (
        <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#DB313E]/50 focus:ring-1 focus:ring-[#DB313E]/20"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 text-center">No results</li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  onMouseDown={() => handleSelect(opt.value)}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    opt.value === value
                      ? "bg-[#DB313E]/5 text-[#DB313E] font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && (
                    <svg
                      className="w-3.5 h-3.5 text-[#DB313E] shrink-0 ml-2"
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
