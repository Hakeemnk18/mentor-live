import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFacultiesByChapter } from "../../../api/faculty.api";
import FacultyCard from "../components/FacultyCard";
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

const ChapterFacultyPage: React.FC = () => {
  const location = useLocation();
  const { chapterId = "", chapterName = "", syllabusId = "", classId = "", syllabusName = "", className = "" } = (location.state ?? {}) as {
    chapterId?: string;
    chapterName?: string;
    syllabusId?: string;
    classId?: string;
    syllabusName?: string;
    className?: string;
  };

  const [search, setSearch] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ── Infinite query for faculties by chapter ── */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["chapter-faculty", chapterId, search],
    queryFn: ({ pageParam = 1 }) =>
      getFacultiesByChapter({
        chapterId,
        page: pageParam,
        limit: LIMIT,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if ((lastPage.data ?? []).length < LIMIT) return undefined;
      return lastPageParam + 1;
    },
    enabled: !!chapterId,
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
        eyebrow="Tutors for chapter"
        title={chapterName || "Chapter Faculty"}
        sub="Browse tutors who specialize in teaching this chapter"
        context={context || undefined}
      >
        <ListingToolbar
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
              sub="No faculty available for this chapter yet."
              action={{ label: "+ Request a Faculty", onClick: () => setRequestOpen(true) }}
            />
          </div>
        )}

        {/* Faculty request modal */}
        <LeadFormModal
          open={requestOpen}
          onClose={() => setRequestOpen(false)}
          type="request"
          purpose={
            chapterName && className && syllabusName
              ? `I'm looking for a faculty for the "${chapterName}" chapter in ${className} class ${syllabusName}`
              : chapterName && className
              ? `I'm looking for a faculty for the "${chapterName}" chapter in ${className} class`
              : chapterName && syllabusName
              ? `I'm looking for a faculty for the "${chapterName}" chapter in ${syllabusName}`
              : chapterName
              ? `I'm looking for a faculty for the "${chapterName}" chapter`
              : className && syllabusName
              ? `I'm looking for a faculty for ${className} class ${syllabusName}`
              : "I'm looking for a faculty for this chapter"
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
                    chapterId={chapterId}
                    syllabusId={syllabusId}
                    classId={classId}
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

export default ChapterFacultyPage;
