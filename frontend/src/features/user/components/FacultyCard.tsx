import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "./ui/Icons";
import { initials, tintFor } from "./ui/tints";

type FacultyCardProps = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  image?: { url: string; publicId: string } | string;
  chapterId?: string;
  syllabusId?: string;
  classId?: string;
  /** SubjectVariant _id selected on the listing page — needed for slot queries */
  variantId?: string;
};

const FacultyCard: React.FC<FacultyCardProps> = ({
  id,
  name,
  qualifications,
  description,
  image,
  chapterId,
  syllabusId,
  classId,
  variantId,
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const imgUrl =
    typeof image === "string"
      ? image
      : image?.url ?? "";
  const tint = tintFor(name);

  const handleClick = () => {
    navigate("/faculty-details", {
      state: {
        facultyId: id,
        ...(chapterId ? { chapterId } : {}),
        syllabusId,
        classId,
        variantId,   // ← pass the selected subject variant so details page can scope slots
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      role="link"
      tabIndex={0}
      className="group h-full rounded-[28px] cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ml-violet/30"
    >
      {/* The outer box never moves (stable hover area); only this inner card lifts, so the hover can't flicker */}
      <div className="h-full bg-white rounded-[28px] overflow-hidden flex flex-col shadow-[0_1px_0_rgba(42,22,80,.04),0_16px_36px_-20px_rgba(42,22,80,.35)] transform-gpu [backface-visibility:hidden] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_44px_-24px_rgba(42,22,80,.45)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
      {/* Photo / initials */}
      <div className="relative aspect-[7/5] flex items-center justify-center overflow-hidden" style={{ background: tint.bg }}>
        {imgUrl && !imgError ? (
          <img
            src={imgUrl}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transform-gpu [backface-visibility:hidden] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <>
            <div aria-hidden="true" className="absolute -right-[30px] -bottom-[30px] w-[130px] h-[130px] rounded-full bg-white/45" />
            <span className="relative font-display font-extrabold text-[84px] tracking-[-0.06em]" style={{ color: tint.ink }}>
              {initials(name)}
            </span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="px-[22px] pt-5 pb-[22px] flex flex-col gap-1.5 flex-1">
        <h3 className="m-0 font-display font-bold text-[21px] text-ml-ink tracking-[-0.02em]">{name}</h3>
        {qualifications.length > 0 && (
          <p className="m-0 text-[13px] font-extrabold text-ml-coral">{qualifications.join(" · ")}</p>
        )}
        <p className="mt-1 mb-0 text-sm leading-[1.55] text-ml-muted line-clamp-3">{description}</p>
        <span className="mt-auto pt-3 inline-flex items-center gap-1.5 font-extrabold text-sm text-ml-violet">
          View Profile
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      </div>
    </div>
  );
};

export default FacultyCard;
