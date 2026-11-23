import { useQuery } from "@tanstack/react-query";
import { getFeaturedFaculty } from "../../../../api/faculty.api";
import FacultyCard from "../FacultyCard";
import Reveal from "../ui/Reveal";
import AutoScroller from "../ui/AutoScroller";
import SectionHeader from "./SectionHeader";

const FacultySection: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["landing-faculties-featured"],
    queryFn: getFeaturedFaculty,
  });

  const faculties = data ?? [];
  const CARD = "basis-[clamp(250px,26vw,282px)]";

  return (
    <section className="max-w-[1200px] mx-auto px-5 pt-[clamp(72px,9vw,120px)]">
      <SectionHeader eyebrow="EXPERT TEACHERS" title="Meet Our Top Faculty" />

      {isLoading ? (
        <div className="flex gap-[18px] overflow-hidden pt-2 px-1 pb-7 -mx-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`shrink-0 ${CARD} bg-white rounded-[28px] overflow-hidden animate-pulse`}>
              <div className="h-[200px] bg-ml-lav" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-ml-lav rounded w-3/4" />
                <div className="h-3 bg-ml-lav rounded w-1/2" />
                <div className="h-3 bg-ml-lav rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : faculties.length === 0 ? (
        <p className="text-sm text-ml-muted py-10 text-center">No featured faculty to show right now.</p>
      ) : (
        <AutoScroller label="Top faculty" itemClassName={CARD} >
          {faculties.map((f, i) => (
            <Reveal key={f.id} delay={(i % 4) * 90} className="h-full">
              <FacultyCard
                id={f.id}
                name={f.name}
                qualifications={f.qualifications}
                description={f.description}
                image={f.image}
              />
            </Reveal>
          ))}
        </AutoScroller>
      )}
    </section>
  );
};

export default FacultySection;
