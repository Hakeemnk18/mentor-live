import { useEffect, useRef, useState } from "react";

type SubjectPillsProps = {
  items: { _id: string; subjectName: string }[];
  activeId?: string;
  onSelect: (id: string | undefined) => void;
};

const SubjectPills: React.FC<SubjectPillsProps> = ({
  items,
  activeId,
  onSelect,
}) => {
 
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* Deduplicate by subjectName — keep first occurrence */
  const unique = items.filter(
    (item, idx, arr) =>
      arr.findIndex((x) => x.subjectName === item.subjectName) === idx,
  );

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    if (el) ro.observe(el);
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [unique.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const pillBase =
    "whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-150 border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB313E]/40";
  const pillActive = "bg-[#DB313E] text-white border-[#DB313E] shadow-sm";
  const pillIdle =
    "bg-white text-gray-600 border-gray-200 hover:border-[#DB313E] hover:text-[#DB313E] hover:shadow-sm";

  return (
    <div className="relative flex items-center gap-1">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[#DB313E] hover:border-[#DB313E] transition-all duration-150 ${
          canScrollLeft
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable pill strip */}
      <div className="relative flex-1 overflow-hidden">
        {/* Left fade */}
        <div
          className={`pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-[#F5F5F5] to-transparent z-10 transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-1 pt-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* All pill */}
          <button
            onClick={() => onSelect(undefined)}
            className={`${pillBase} ${!activeId ? pillActive : pillIdle}`}
          >
            All
          </button>

          {unique.map((item) => (
            <button
              key={item._id}
              onClick={() => onSelect(item._id)}
              className={`${pillBase} ${activeId === item._id ? pillActive : pillIdle}`}
            >
              {item.subjectName}
            </button>
          ))}
        </div>

        {/* Right fade */}
        <div
          className={`pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-[#F5F5F5] to-transparent z-10 transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[#DB313E] hover:border-[#DB313E] transition-all duration-150 ${
          canScrollRight
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default SubjectPills;
