import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getChaptersList } from "../../../api/chapter.api";
import ChapterCard from "../components/ChapterCard";
import SubjectPills from "../components/SubjectPills";
import SearchInput from "../components/SearchInput";
import LeadFormModal from "../components/LeadFormModal";
import { getSubjectsForUser } from "../../../api/subject.api";

const ChapterListingPage: React.FC = () => {
  const location = useLocation();
  const { syllabusId = "", classId = "", syllabusName = "", className = "" } =
    (location.state ?? {}) as {
      syllabusId?: string;
      classId?: string;
      syllabusName?: string;
      className?: string;
    };

  const [search, setSearch] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [subjectId, setSubjectId] = useState<string | undefined>();

  /* ── Fetch subjects for filter pills, scoped to this syllabus + class ── */
  const { data: subjectData } = useQuery({
    queryKey: ["subjects-for-user", syllabusId, classId],
    queryFn: () => getSubjectsForUser({ syllabusId, classId }),
    enabled: !!syllabusId && !!classId,
  });

  // SubjectPills expects { _id, subjectName } — `_id` here is the real Subject id,
  // which is what the chapter list `subjectId` filter expects.
  const subjects = (subjectData ?? []).map((s) => ({
    _id: s.id,
    subjectName: s.name,
  }));

  /* ── Fetch chapters list ── */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["chapter-listing", syllabusId, classId, subjectId],
    queryFn: () =>
      getChaptersList({
        syllabusId,
        classId,
        subjectId: subjectId || undefined,
      }),
    enabled: !!syllabusId && !!classId,
  });

  // Client-side search filter
  const allChapters = data ?? [];
  const chapters = search
    ? allChapters.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : allChapters;

  return (
    <div className="min-h-[80vh] bg-[#F5F5F5]">
      {/* Page header */}
      <div className="bg-[#111] py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
          Available Chapters
        </h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Browse chapters and pick what you'd like to learn from our curated collection
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col gap-5 mb-8">
          {/* Search */}
          <div className="flex justify-end">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search chapters..."
            />
          </div>

          {/* Subject filter pills */}
          {subjects.length > 0 && (
            <SubjectPills
              items={subjects}
              activeId={subjectId}
              onSelect={setSubjectId}
            />
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-medium">Something went wrong</p>
            <p className="text-gray-400 text-sm mt-1">We couldn't load chapters right now.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && chapters.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-gray-900 text-lg font-bold">No chapters found</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              {classId && syllabusId
                ? `No chapters available for ${className || "this class"}${syllabusName ? ` (${syllabusName})` : ""} yet.`
                : "Try adjusting your filters or search term."}
            </p>
            {classId && syllabusId && (
              <button
                onClick={() => setRequestOpen(true)}
                className="inline-flex items-center gap-2 bg-[#DB313E] text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:bg-[#c12a36] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Request a Chapter
              </button>
            )}
          </div>
        )}

        {/* Chapter request modal */}
        <LeadFormModal
          open={requestOpen}
          onClose={() => setRequestOpen(false)}
          type="request"
          purpose={
            className && syllabusName
              ? `I'm looking for ${className} class ${syllabusName} chapters`
              : className
              ? `I'm looking for ${className} class chapters`
              : syllabusName
              ? `I'm looking for ${syllabusName} chapters`
              : "I'm looking for chapters"
          }
          classId={classId || null}
          syllabusId={syllabusId || null}
          className={className || null}
          syllabusName={syllabusName || null}
        />

        {/* Chapter grid */}
        {chapters.length > 0 && !isError && !isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {chapters.map((c) => (
              <ChapterCard
                key={c._id}
                id={c._id}
                name={c.name}
                price={c.price}
                icon={c.icon}
                subjectName=""
                syllabusId={syllabusId}
                classId={classId}
                syllabusName={syllabusName}
                className={className}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterListingPage;
