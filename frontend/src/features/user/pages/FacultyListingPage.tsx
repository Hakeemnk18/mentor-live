import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFacultiesList } from "../../../api/faculty.api";
import { getSubjectVariants } from "../../../api/chapter.api";
import FacultyCard from "../components/FacultyCard";
import SubjectPills from "../components/SubjectPills";
import SearchInput from "../components/SearchInput";
import LeadFormModal from "../components/LeadFormModal";
import PageHero from "../components/ui/PageHero";
import ListingToolbar from "../components/ui/ListingToolbar";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import CardSkeletons from "../components/ui/CardSkeletons";
import Reveal from "../components/ui/Reveal";
import { Spinner } from "../components/ui/Icons";

const LIMIT = 8;
const GRID = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-[18px]";

const FacultyListingPage: React.FC = () => {
  const location = useLocation();
  const { syllabusId = "", classId = "", syllabusName = "", className = "" } =
    (location.state ?? {}) as {
      syllabusId?: string;
      classId?: string;
      syllabusName?: string;
      className?: string;
    };

  const [requestOpen, setRequestOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ── Fetch subject variants for filter pills ── */
  const { data: subjectData } = useQuery({
    queryKey: ["subject-variants", syllabusId, classId],
    queryFn: () => getSubjectVariants({ syllabusId, classId }),
    enabled: !!syllabusId && !!classId,
  });

  const subjects = (subjectData ?? []) as unknown as { _id: string; subjectName: string }[];

  /* ── Infinite query for faculties ── */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["faculty-listing", syllabusId, classId, subjectId, search],
    queryFn: ({ pageParam = 1 }) =>
      getFacultiesList({
        syllabusId,
        classId,
        subjectId: subjectId || undefined,
        page: pageParam,
        limit: LIMIT,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // If the API returned fewer items than the limit, there are no more pages
      if ((lastPage.data ?? []).length < LIMIT) return undefined;
      return lastPageParam + 1;
    },
  });

  /* ── Intersection Observer for infinite scroll ── */
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const faculties = data?.pages.flatMap((page) => page.data ?? []) ?? [];
  const context = [syllabusName, className].filter(Boolean).join(" · ");

  return (
    <div className="min-h-[80vh]">
      <PageHero
        eyebrow="Expert faculty"
        title="Our Elite Faculty"
        sub="Choose from the industry's most dedicated educators across a wide spectrum of academic disciplines"
        context={context || undefined}
      >
        <ListingToolbar
          filters={
            subjects.length > 0 ? (
              <SubjectPills items={subjects} activeId={subjectId} onSelect={setSubjectId} />
            ) : undefined
          }
          search={<SearchInput value={search} onChange={setSearch} placeholder="Search tutors..." />}
          resultLabel={
            !isLoading && !isError && faculties.length > 0
              ? `Showing ${faculties.length} tutor${faculties.length === 1 ? "" : "s"}${hasNextPage ? "+" : ""}`
              : undefined
          }
        />
      </PageHero>

      <section className="max-w-[1200px] mx-auto px-5 pt-4 pb-[clamp(64px,8vw,110px)]">
        {/* Loading skeleton */}
        {isLoading && <CardSkeletons gridCls={`${GRID} mt-6`} imageHeight="h-[200px]" />}

        {/* Error */}
        {!isLoading && isError && <ErrorState sub="We couldn't load tutors right now." />}

        {/* Empty state */}
        {!isLoading && !isError && faculties.length === 0 && (
          <div className="pt-10">
            <EmptyState
              title="No tutors found"
              sub={
                classId && syllabusId
                  ? `No faculty available for ${className || "this class"}${syllabusName ? ` (${syllabusName})` : ""} yet.`
                  : "Try adjusting your filters or search term."
              }
              /* Show request button only when class+syllabus filter is active */
              action={classId && syllabusId ? { label: "+ Request a Faculty", onClick: () => setRequestOpen(true) } : undefined}
            />
          </div>
        )}

        {/* Faculty request modal */}
        <LeadFormModal
          open={requestOpen}
          onClose={() => setRequestOpen(false)}
          type="request"
          purpose={
            className && syllabusName
              ? `I'm looking for a ${className} class ${syllabusName} teacher`
              : className
              ? `I'm looking for a ${className} class teacher`
              : syllabusName
              ? `I'm looking for a ${syllabusName} teacher`
              : "I'm looking for a teacher"
          }
          classId={classId || null}
          syllabusId={syllabusId || null}
          className={className || null}
          syllabusName={syllabusName || null}
        />

        {/* Faculty grid */}
        {faculties.length > 0 && !isError && !isLoading && (
          <>
            <div className={GRID}>
              {faculties.map((f, i) => (
                <Reveal key={f.id} delay={(i % 4) * 90}>
                  <FacultyCard
                    id={f.id}
                    name={f.name}
                    qualifications={f.qualifications}
                    description={f.description}
                    image={f.image}
                    syllabusId={syllabusId}
                    classId={classId}
                    variantId={subjectId}   // subjectId pill value IS the SubjectVariant _id
                  />
                </Reveal>
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className="h-10 mt-8" />

            {isFetchingNextPage && (
              <p className="flex items-center justify-center gap-2 text-ml-muted text-sm font-semibold mt-4">
                <Spinner /> Loading more tutors...
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default FacultyListingPage;
