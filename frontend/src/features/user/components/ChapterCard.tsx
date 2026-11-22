import { useNavigate } from "react-router-dom";
import { ArrowRight } from "./ui/Icons";
import { tintFor } from "./ui/tints";

type ChapterCardProps = {
  id: string;
  name: string;
  price: number;
  icon?: string;
  subjectName: string;
  syllabusId?: string;
  classId?: string;
  syllabusName?: string;
  className?: string;
};

/** "Quadratic Equations" → "QE" style glyph when the chapter has no icon */
const glyph = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w, i) => (i === 0 ? w[0].toUpperCase() : w[0].toLowerCase()))
    .join("") || "Ch";

const ChapterCard: React.FC<ChapterCardProps> = ({
  id,
  name,
  price,
  icon,
  subjectName,
  syllabusId,
  classId,
  syllabusName,
  className,
}) => {
  const navigate = useNavigate();
  const tint = tintFor(subjectName || name);
  const iconUrl = icon ? (typeof icon === "string" ? icon : (icon as any)?.url) : "";

  const handleClick = () => {
    navigate("/chapter-faculty", {
      state: { chapterId: id, chapterName: name, syllabusId, classId, syllabusName, className },
    });
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      role="link"
      tabIndex={0}
      className="group h-full bg-white rounded-[26px] overflow-hidden cursor-pointer flex flex-col shadow-[0_1px_0_rgba(42,22,80,.04),0_16px_36px_-22px_rgba(42,22,80,.35)] transition-transform duration-300 hover:-translate-y-1.5 hover:-rotate-[0.6deg] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ml-violet/30"
    >
      {/* Icon / glyph area */}
      <div className="relative h-[130px] flex items-center justify-center overflow-hidden" style={{ background: tint.bg }}>
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div aria-hidden="true" className="absolute -left-6 -top-6 w-[90px] h-[90px] rounded-3xl rotate-[20deg] bg-white/40" />
            <span className="relative font-display font-extrabold text-[56px] tracking-[-0.04em]" style={{ color: tint.ink }}>
              {glyph(name)}
            </span>
          </>
        )}
        {subjectName && (
          <span className="absolute right-3 top-3 px-2.5 py-[5px] rounded-full bg-white text-[11px] font-extrabold" style={{ color: tint.ink }}>
            {subjectName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-[18px] pb-5 flex flex-col gap-3 flex-1">
        <h3 className="m-0 font-display font-bold text-[19px] leading-[1.2] text-ml-ink tracking-[-0.02em]">{name}</h3>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <span className="font-display font-extrabold text-[21px] text-ml-deep">₹{price}</span>
          <span className="inline-flex items-center gap-1.5 font-extrabold text-sm text-ml-violet">
            Find Tutors
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;
