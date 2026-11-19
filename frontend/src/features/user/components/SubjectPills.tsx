import { tintFor } from "./ui/tints";

type SubjectPillsProps = {
  items: { _id: string; subjectName: string }[];
  activeId?: string;
  onSelect: (id: string | undefined) => void;
};

/** Two-letter badge for a subject ("Mathematics" → "Ma") */
const short = (name: string) => (name.trim().slice(0, 2) || "?").replace(/^./, (c) => c.toUpperCase());

const SubjectPills: React.FC<SubjectPillsProps> = ({
  items,
  activeId,
  onSelect,
}) => {
  /* Deduplicate by subjectName — keep first occurrence */
  const unique = items.filter(
    (item, idx, arr) =>
      arr.findIndex((x) => x.subjectName === item.subjectName) === idx,
  );

  const pill = (active: boolean) =>
    `flex-shrink-0 h-[42px] pl-[7px] pr-4 rounded-full border-2 font-extrabold text-sm cursor-pointer inline-flex items-center gap-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-ml-violet/25 ${
      active
        ? "bg-ml-deep border-ml-deep text-white"
        : "bg-white border-ml-line text-ml-ink hover:border-ml-violet"
    }`;

  return (
    <div className="flex gap-2 min-w-0 overflow-x-auto no-scrollbar py-0.5">
      {/* All pill */}
      <button type="button" onClick={() => onSelect(undefined)} className={pill(!activeId)}>
        <span
          className={`min-w-[26px] h-[26px] px-[5px] rounded-full flex items-center justify-center font-display text-[11px] ${
            !activeId ? "bg-white/20" : "bg-ml-lav text-ml-plum"
          }`}
        >
          ✦
        </span>
        All
      </button>

      {unique.map((item) => {
        const active = activeId === item._id;
        const t = tintFor(item.subjectName);
        return (
          <button key={item._id} type="button" onClick={() => onSelect(item._id)} className={pill(active)}>
            <span
              className="min-w-[26px] h-[26px] px-[5px] rounded-full flex items-center justify-center font-display text-[11px]"
              style={active ? { background: "rgba(255,255,255,.2)" } : { background: t.bg, color: t.ink }}
            >
              {short(item.subjectName)}
            </span>
            {item.subjectName}
          </button>
        );
      })}
    </div>
  );
};

export default SubjectPills;
