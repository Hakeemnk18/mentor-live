import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getChaptersList } from "../../../api/chapter.api";
import ChapterCard from "../components/ChapterCard";
import SubjectPills from "../components/SubjectPills";
import SearchInput from "../components/SearchInput";
import LeadFormModal from "../components/LeadFormModal";
import { getSubjectsForUser } from "../../../api/subject.api";
import PageHero from "../components/ui/PageHero";
import ListingToolbar from "../components/ui/ListingToolbar";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import CardSkeletons from "../components/ui/CardSkeletons";
import Reveal from "../components/ui/Reveal";

const GRID = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-[18px]";

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

  const context = [syllabusName, className].filter(Boolean).join(" · ");

  return (
    <div className="min-h-[80vh]">
      <PageHero
        eyebrow="Pick a chapter"
        title="Available Chapters"
        sub="Browse chapters and pick what you'd like to learn from our curated collection"
        context={context || undefined}
      >
        <ListingToolbar
          filters={
            subjects.length > 0 ? (
              <SubjectPills items={subjects} activeId={subjectId} onSelect={setSubjectId} />
            ) : undefined
          }
          search={<SearchInput value={search} onChange={setSearch} placeholder="Search chapters..." />}
          resultLabel={
            !isLoading && !isError && chapters.length > 0
              ? `Showing ${chapters.length} chapter${chapters.length === 1 ? "" : "s"}`
              : undefined
          }
        />
      </PageHero>

      <section className="max-w-[1200px] mx-auto px-5 pt-4 pb-[clamp(64px,8vw,110px)]">
        {/* Loading skeleton */}
        {isLoading && <CardSkeletons gridCls={`${GRID} mt-6`} imageHeight="h-[130px]" />}

        {/* Error */}
        {!isLoading && isError && <ErrorState sub="We couldn't load chapters right now." />}

        {/* Empty state */}
        {!isLoading && !isError && chapters.length === 0 && (
          <div className="pt-10">
            <EmptyState
              title="No chapters found"
              sub={
                classId && syllabusId
                  ? `No chapters available for ${className || "this class"}${syllabusName ? ` (${syllabusName})` : ""} yet.`
                  : "Try adjusting your filters or search term."
              }
              action={classId && syllabusId ? { label: "+ Request a Chapter", onClick: () => setRequestOpen(true) } : undefined}
            />
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
          <div className={GRID}>
            {chapters.map((c, i) => (
              <Reveal key={c._id} delay={(i % 4) * 80}>
                <ChapterCard
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
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChapterListingPage;
