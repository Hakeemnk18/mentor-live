import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBlogs } from "../../../api/blog.api";
import BlogCard from "../components/BlogCard";
import SearchInput from "../components/SearchInput";
import PageHero from "../components/ui/PageHero";
import ListingToolbar from "../components/ui/ListingToolbar";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import CardSkeletons from "../components/ui/CardSkeletons";
import Reveal from "../components/ui/Reveal";
import { Spinner } from "../components/ui/Icons";

const LIMIT = 9; // 3×3 grid
const GRID = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-[18px]";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

const BlogsPage: React.FC = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  /* Debounced search so we don't fire on every keystroke */
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  /* ── Infinite query — re-runs when search or sort changes ── */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["all-blogs", debouncedSearch, sort],
    queryFn: ({ pageParam = 1 }) =>
      getBlogs({
        page: pageParam as number,
        limit: LIMIT,
        search: debouncedSearch || undefined,
        sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if ((lastPageParam as number) >= lastPage.totalPages) return undefined;
      return (lastPageParam as number) + 1;
    },
  });

  /* ── Intersection Observer ── */
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const blogs = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Study smarter"
        title="All Blog Posts"
        sub="Choose from the industry's most dedicated educators across a wide spectrum of academic disciplines"
      >
        <ListingToolbar
          filters={
            <div className="flex gap-2" role="radiogroup" aria-label="Sort order">
              {SORTS.map((s) => {
                const on = sort === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setSort(s.value)}
                    className={`h-[42px] px-4 rounded-full border-2 font-extrabold text-sm cursor-pointer transition-all duration-200 ${
                      on ? "bg-ml-deep border-ml-deep text-white" : "bg-white border-ml-line text-ml-ink hover:border-ml-violet"
                    }`}
                  >
                    {s.label} first
                  </button>
                );
              })}
            </div>
          }
          search={<SearchInput value={search} onChange={setSearch} placeholder="Search articles…" />}
        />
      </PageHero>

      <section className="max-w-[1200px] mx-auto px-5 pt-10 pb-[clamp(64px,8vw,110px)]">
        {/* Loading skeleton */}
        {isLoading && <CardSkeletons count={6} gridCls={GRID} imageHeight="h-[180px]" />}

        {/* Error */}
        {isError && !isLoading && <ErrorState title="Failed to load blogs" />}

        {/* Empty */}
        {!isLoading && !isError && blogs.length === 0 && (
          <EmptyState
            pose="read"
            title={debouncedSearch ? `No results for "${debouncedSearch}"` : "No blogs found"}
            sub={debouncedSearch ? "Try a different search term." : "Check back later for new articles."}
          />
        )}

        {/* Grid */}
        {blogs.length > 0 && (
          <>
            <div className={GRID}>
              {blogs.map((b, i) => (
                <Reveal key={b.id} delay={(i % 3) * 100}>
                  <BlogCard
                    id={b.id}
                    heading={b.heading}
                    description={b.description}
                    author={b.author}
                    image={b.image}
                    topic={b.topic}
                  />
                </Reveal>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={observerRef} className="h-10 mt-10 flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-ml-muted text-sm font-semibold">
                  <Spinner /> Loading more...
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default BlogsPage;
