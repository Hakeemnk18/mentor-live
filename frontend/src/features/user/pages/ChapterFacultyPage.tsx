import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFacultiesByChapter } from "../../../api/faculty.api";
import FacultyCard from "../components/FacultyCard";
import SearchInput from "../components/SearchInput";

const LIMIT = 8;

const ChapterFacultyPage: React.FC = () => {
  const location = useLocation();
  const { chapterId = "", chapterName = "", syllabusId = "", classId = "" } = (location.state ?? {}) as {
    chapterId?: string;
    chapterName?: string;
    syllabusId?: string;
    classId?: string;
  };

  const [search, setSearch] = useState("");
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

  return (
    <div className="min-h-[80vh] bg-[#F5F5F5]">
      {/* Page header */}
      <div className="bg-[#111] py-12 text-center">
        <p className="text-[#DB313E] text-xs font-bold uppercase tracking-wider mb-2">
          Tutors for Chapter
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
          {chapterName || "Chapter Faculty"}
        </h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Browse tutors who specialize in teaching this chapter
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* Search */}
        <div className="flex justify-end mb-8">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search tutors..."
          />
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                <div className="h-56 bg-gray-200 rounded-t-xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-medium">Something went wrong</p>
            <p className="text-gray-400 text-sm mt-1">We couldn't load tutors right now.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && faculties.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No tutors found</p>
            <p className="text-gray-400 text-sm mt-1">No faculty available for this chapter yet.</p>
          </div>
        )}

        {/* Faculty grid */}
        {faculties.length > 0 && !isError && !isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {faculties.map((f) => (
                <FacultyCard
                  key={f.id}
                  id={f.id}
                  name={f.name}
                  qualifications={f.qualifications}
                  description={f.description}
                  image={f.image}
                  chapterId={chapterId}
                  syllabusId={syllabusId}
                  classId={classId}
                />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className="h-10 mt-8" />

            {isFetchingNextPage && (
              <p className="text-center text-gray-400 text-sm mt-4">
                Loading more tutors...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterFacultyPage;
