import Reveal from "../ui/Reveal";
import { ChevronLeft, ChevronRight } from "../ui/Icons";

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  /** Extra element shown before the arrows (e.g. "View All Posts" link) */
  aside?: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
};

/** Eyebrow + big heading on the left, optional link + prev/next arrows on the right. */
const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, aside, onPrev, onNext }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
    <Reveal stagger className="flex flex-col gap-3 max-w-[720px]">
      <span className="text-[13px] font-extrabold tracking-[0.16em] text-ml-rust">{eyebrow}</span>
      <h2 className="m-0 font-display font-extrabold text-[clamp(34px,4.6vw,56px)] leading-[1.02] tracking-[-0.04em] text-ml-deep">
        {title}
      </h2>
    </Reveal>
    {(aside || onPrev || onNext) && (
      <Reveal variant="fade" delay={250} className="flex gap-2.5 items-center">
        {aside}
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous"
            className="w-12 h-12 rounded-full border-2 border-ml-line bg-white text-ml-deep flex items-center justify-center cursor-pointer transition hover:border-ml-violet"
          >
            <ChevronLeft className="w-[18px] h-[18px]" />
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            aria-label="Next"
            className="w-12 h-12 rounded-full bg-ml-deep text-white flex items-center justify-center cursor-pointer transition hover:bg-ml-violet"
          >
            <ChevronRight className="w-[18px] h-[18px]" />
          </button>
        )}
      </Reveal>
    )}
  </div>
);

export default SectionHeader;
