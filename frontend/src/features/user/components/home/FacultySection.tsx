import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedFaculty } from "../../../../api/faculty.api";
import FacultyCard from "../FacultyCard";
import Reveal from "../ui/Reveal";
import SectionHeader from "./SectionHeader";

const FacultySection: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["landing-faculties-featured"],
    queryFn: getFeaturedFaculty,
  });

  const faculties = data ?? [];
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const showArrows = faculties.length > 1;

  return (
    <section className="max-w-[1200px] mx-auto px-5 pt-[clamp(72px,9vw,120px)]">
      <SectionHeader
        eyebrow="EXPERT TEACHERS"
        title="Meet Our Top Faculty"
        onPrev={showArrows ? () => scrollByCard("left") : undefined}
        onNext={showArrows ? () => scrollByCard("right") : undefined}
      />

      <div
        ref={scrollerRef}
        className="flex gap-[18px] overflow-x-auto snap-x snap-mandatory scroll-smooth pt-2 px-1 pb-7 -mx-1 no-scrollbar"
      >
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="snap-start flex-[0_0_clamp(250px,26vw,282px)] bg-white rounded-[28px] overflow-hidden animate-pulse">
              <div className="h-[200px] bg-ml-lav" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-ml-lav rounded w-3/4" />
                <div className="h-3 bg-ml-lav rounded w-1/2" />
                <div className="h-3 bg-ml-lav rounded w-full" />
              </div>
            </div>
          ))
        ) : faculties.length === 0 ? (
          <p className="text-sm text-ml-muted py-10 mx-auto">No featured faculty to show right now.</p>
        ) : (
          faculties.map((f, i) => (
            <Reveal key={f.id} delay={(i % 4) * 90} className="snap-start flex-[0_0_clamp(250px,26vw,282px)]">
              <FacultyCard
                id={f.id}
                name={f.name}
                qualifications={f.qualifications}
                description={f.description}
                image={f.image}
              />
            </Reveal>
          ))
        )}
      </div>
    </section>
  );
};

export default FacultySection;
