import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedBlogs } from "../../../../api/blog.api";
import BlogCard from "../BlogCard";
import Reveal from "../ui/Reveal";
import AutoScroller from "../ui/AutoScroller";
import { ChevronRight } from "../ui/Icons";
import SectionHeader from "./SectionHeader";

/* 1 card (+ a peek) on phones, 2 on tablets, 3 on laptops — 18px gaps */
const CARD = "basis-[86%] sm:basis-[calc((100%-18px)/2)] lg:basis-[calc((100%-36px)/3)]";

const BlogSection: React.FC = () => {
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ["landing-blogs-featured"],
    queryFn: getFeaturedBlogs,
  });

  const blogs = featuredData ?? [];

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
        <AutoScroller label="Featured blog posts" itemClassName={CARD} trackClassName="pt-2 px-1 pb-7 -mx-1">
          {blogs.map((b, i) => (
            <Reveal key={b.id} delay={(i % 3) * 100} className="h-full">
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
        </AutoScroller>
      )}
    </section>
  );
};

export default BlogSection;
