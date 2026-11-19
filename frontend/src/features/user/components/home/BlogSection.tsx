import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedBlogs } from "../../../../api/blog.api";
import BlogCard from "../BlogCard";
import Reveal from "../ui/Reveal";
import { ChevronRight } from "../ui/Icons";
import SectionHeader from "./SectionHeader";

const BLOGS_PER_PAGE = 3;

const BlogSection: React.FC = () => {
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ["landing-blogs-featured"],
    queryFn: getFeaturedBlogs,
  });

  const blogs = featuredData ?? [];
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(blogs.length / BLOGS_PER_PAGE));
  const visible = blogs.slice(
    page * BLOGS_PER_PAGE,
    page * BLOGS_PER_PAGE + BLOGS_PER_PAGE
  );

  const prev = () => setPage((p) => (p > 0 ? p - 1 : totalPages - 1));
  const next = () => setPage((p) => (p < totalPages - 1 ? p + 1 : 0));
  const paged = blogs.length > BLOGS_PER_PAGE;

  return (
    <section className="max-w-[1200px] mx-auto px-5 pt-[clamp(72px,9vw,120px)]">
      <SectionHeader
        eyebrow="STUDY SMARTER"
        title="From Our Blog"
        aside={
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 font-extrabold text-[15px] text-ml-violet hover:text-ml-plum mr-1.5"
          >
            View All Posts
            <ChevronRight />
          </Link>
        }
        onPrev={paged ? prev : undefined}
        onNext={paged ? next : undefined}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-[28px] overflow-hidden animate-pulse">
              <div className="h-[190px] bg-ml-lav" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-ml-lav rounded w-3/4" />
                <div className="h-3 bg-ml-lav rounded w-full" />
                <div className="h-3 bg-ml-lav rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {visible.map((b, i) => (
            <Reveal key={b.id} delay={i * 100}>
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
      )}

      {/* Page dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className="h-2 rounded-lg cursor-pointer transition-all duration-300"
              style={{ width: i === page ? 26 : 8, background: i === page ? "#6D35D9" : "#D9CFEE" }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogSection;
