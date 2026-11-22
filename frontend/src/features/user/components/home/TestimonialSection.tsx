import { useQuery } from "@tanstack/react-query";
import { getTestimonialsForUser } from "../../../../api/testimonial.api";
import TestimonialCard from "../TestimonialCard";
import Reveal from "../ui/Reveal";
import AutoScroller from "../ui/AutoScroller";
import SectionHeader from "./SectionHeader";

const TestimonialSection: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["landing-testimonials"],
    queryFn: getTestimonialsForUser,
  });

  const testimonials = (data ?? []).filter((t) => !t.isDeleted);
  const CARD = "basis-[clamp(280px,36vw,380px)]";

  return (
    <section className="mt-[clamp(56px,7vw,96px)] bg-ml-lilac relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(109,53,217,.12) 1.5px,transparent 1.6px)", backgroundSize: "26px 26px" }}
      />
      <div className="relative max-w-[1200px] mx-auto px-5 py-[clamp(72px,9vw,120px)]">
        <SectionHeader eyebrow="REAL STORIES" title="See What Our Students & Parents Are Saying" />

        {isLoading ? (
          <div className="flex gap-[18px] overflow-hidden pt-2 px-1 pb-3 -mx-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`shrink-0 ${CARD} bg-white rounded-[28px] p-7 animate-pulse space-y-3`}>
                <div className="h-6 bg-ml-lav rounded w-1/4" />
                <div className="h-3 bg-ml-lav rounded w-full" />
                <div className="h-3 bg-ml-lav rounded w-3/4" />
                <div className="h-10 bg-ml-lav rounded w-1/2 mt-6" />
              </div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-sm text-ml-muted py-10 text-center">No testimonials to show right now.</p>
        ) : (
          <AutoScroller label="Student and parent testimonials" itemClassName={CARD} interval={5500} trackClassName="pt-2 px-1 pb-3 -mx-1">
            {testimonials.map((t, i) => (
              <Reveal key={t.id ?? i} delay={(i % 3) * 100} className="h-full">
                <TestimonialCard author={t.author} designation={t.designation} comment={t.comment} index={i} />
              </Reveal>
            ))}
          </AutoScroller>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;
