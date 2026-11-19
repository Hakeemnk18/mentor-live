import { TINTS, initials } from "./ui/tints";

type TestimonialCardProps = {
  author: string;
  designation: string;
  comment: string;
  /** Index used to pick a deterministic avatar colour */
  index?: number;
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  author,
  designation,
  comment,
  index = 0,
}) => {
  const tint = TINTS[index % TINTS.length];

  return (
    <div className="h-full bg-white rounded-[28px] p-7 flex flex-col gap-[18px] shadow-[0_18px_40px_-26px_rgba(42,22,80,.45)] transition-transform duration-300 hover:-rotate-[1.2deg] hover:-translate-y-1">
      <div className="flex justify-between items-center">
        <span aria-hidden="true" className="font-display font-extrabold text-[64px] leading-[0.6] h-[30px] text-ml-coral">“</span>
        <span className="text-ml-star text-lg tracking-[2px]" aria-label="5 out of 5 stars">★★★★★</span>
      </div>

      <p className="m-0 text-[17px] leading-relaxed text-ml-ink font-medium text-pretty">{comment}</p>

      <div className="mt-auto flex items-center gap-3 pt-4 border-t-2 border-dashed border-ml-lilac">
        <div
          className="w-[46px] h-[46px] rounded-full flex items-center justify-center font-extrabold text-base flex-shrink-0"
          style={{ background: tint.bg, color: tint.ink }}
        >
          {initials(author)}
        </div>
        <div className="min-w-0">
          <p className="m-0 font-extrabold text-[15px] text-ml-ink truncate">{author}</p>
          <p className="m-0 text-[13px] text-ml-muted mt-0.5 truncate">{designation}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
