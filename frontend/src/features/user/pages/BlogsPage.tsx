import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBlogs } from "../../../api/blog.api";
import BlogCard from "../components/BlogCard";

import type { Blog } from "../../../shared/types/blog.types";
const LIMIT = 9; // 3x3 grid

const BlogsPage: React.FC = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ── Fetch Blogs with Infinite Scroll ── */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["all-blogs"],
    queryFn: ({ pageParam = 1 }) => getBlogs({ page: pageParam, limit: LIMIT, isDeleted: false }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPageParam >= lastPage.totalPage) return undefined;
      return lastPageParam + 1;
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
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const blogs = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero Section */}
      <div className="bg-[#111] py-20 text-center px-4">
        <h1 className="text-3xl md:text-[42px] font-extrabold text-white mb-4">
          All Blog Posts
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">
          Choose from the industry's most dedicated educators across a wide spectrum of academic disciplines
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-md border border-gray-100 p-6 min-h-[300px]">
                <div className="h-40 bg-gray-200 rounded-sm mb-4" />
                <div className="h-6 bg-gray-200 rounded-sm mb-3 w-3/4" />
                <div className="h-4 bg-gray-200 rounded-sm mb-2 w-full" />
                <div className="h-4 bg-gray-200 rounded-sm mb-2 w-full" />
                <div className="h-4 bg-gray-200 rounded-sm mb-2 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-24">
            <p className="text-[#DB313E] text-lg font-bold">Failed to load blogs</p>
            <p className="text-gray-500 mt-2 text-sm">Please check your connection and try again.</p>
          </div>
        )}

        {!isLoading && !isError && blogs.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-gray-900 text-lg font-bold">No blogs found</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for new articles.</p>
          </div>
        )}

        {blogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {blogs.map((b) => (
                <BlogCard
                  key={b.id}
                  id={b.id}
                  heading={b.heading}
                  description={b.description}
                  author={b.author}
                />
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={observerRef} className="h-10 mt-10 flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading more...
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
