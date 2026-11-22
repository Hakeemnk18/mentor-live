import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getBlogById } from "../../../api/blog.api";
import Reveal from "../components/ui/Reveal";
import Bear from "../components/ui/Bear";
import EmptyState from "../components/ui/EmptyState";
import { ChevronLeft } from "../components/ui/Icons";
import { initials, tintFor } from "../components/ui/tints";

const BlogDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [imgError, setImgError] = useState(false);

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog-detail", id],
    queryFn: () => getBlogById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-[820px] mx-auto px-5 py-14 animate-pulse">
          <div className="w-24 h-5 bg-ml-lav rounded mb-8" />
          <div className="w-28 h-7 bg-ml-lav rounded-full mb-5" />
          <div className="h-12 bg-ml-lav rounded mb-4 w-3/4" />
          <div className="h-12 bg-ml-lav rounded mb-8 w-1/2" />
          <div className="w-full h-[clamp(220px,34vw,380px)] bg-ml-lav rounded-[32px] mb-10" />
          <div className="space-y-4">
            <div className="h-4 bg-ml-lav rounded w-full" />
            <div className="h-4 bg-ml-lav rounded w-full" />
            <div className="h-4 bg-ml-lav rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-10">
        <EmptyState
          pose="lost"
          title="Blog not found"
          sub={
            <>
              The article you are looking for does not exist or was removed.{" "}
              <Link to="/blogs" className="font-extrabold text-ml-violet hover:underline">
                Back to blogs
              </Link>
            </>
          }
        />
      </div>
    );
  }

  const topic = (blog as { topic?: string | null }).topic?.trim() || "Education";
  const tint = tintFor(topic);

  return (
    <article className="max-w-[820px] mx-auto px-5 pt-[clamp(28px,5vw,56px)] pb-[clamp(64px,8vw,110px)]">
      <Link to="/blogs" className="inline-flex items-center gap-1.5 font-extrabold text-sm text-ml-violet mb-6 hover:text-ml-plum">
        <ChevronLeft /> All posts
      </Link>

      <Reveal className="flex flex-col gap-4">
        {/* Category Badge */}
        <span
          className="self-start px-3 py-1.5 rounded-full text-[11px] font-extrabold tracking-[0.12em] uppercase"
          style={{ background: tint.bg, color: tint.ink }}
        >
          {topic}
        </span>

        {/* Title */}
        <h1 className="m-0 font-display font-extrabold text-[clamp(34px,5vw,56px)] leading-[1.03] tracking-[-0.04em] text-ml-deep text-balance break-words">
          {blog.heading}
        </h1>

        {/* Author info row */}
        <div className="flex items-center gap-2.5 text-sm text-ml-muted">
          <div className="w-9 h-9 rounded-full bg-ml-lav text-ml-plum flex items-center justify-center font-extrabold text-[13px]">
            {initials(blog.author) || "ML"}
          </div>
          <span className="font-extrabold text-ml-ink">By {blog.author}</span>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#C9BFDD]" />
          5 min read
        </div>
      </Reveal>

      {/* Hero Image Block */}
      <Reveal delay={100} className="mt-7 mb-8">
        <div
          className="w-full h-[clamp(220px,34vw,380px)] rounded-[32px] overflow-hidden flex items-center justify-center"
          style={{ background: tint.bg }}
        >
          {blog.image?.url && !imgError ? (
            <img
              src={blog.image.url}
              alt={blog.heading}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Placeholder shown when the blog has no image or it fails to load */
            <span
              aria-hidden="true"
              className="font-display font-extrabold text-[clamp(140px,22vw,240px)] leading-none tracking-[-0.06em] opacity-20"
              style={{ color: tint.ink }}
            >
              {blog.heading.trim().charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </Reveal>

      {/* Content Body */}
      <Reveal>
        {/* Fallback to description if content is missing for any reason.
            whitespace-pre-wrap preserves the admin's line breaks and spacing. */}
        <p className="m-0 whitespace-pre-wrap text-lg leading-[1.75] text-[#3A3152] text-pretty break-words">
          {blog.content || blog.description}
        </p>
      </Reveal>

      {/* Help CTA */}
      <Reveal className="mt-11">
        <div className="rounded-[30px] bg-ml-hero text-white p-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-[18px]">
            <div className="flex-[0_0_84px] w-[84px] -my-[18px]">
              <Bear pose="read" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="font-display font-extrabold text-[26px] tracking-[-0.02em] leading-tight">Need help with this topic?</div>
              <div className="text-[15px] text-ml-soft">Book a live session with one of our faculty.</div>
            </div>
          </div>
          <Link
            to="/book-tutor"
            className="h-[52px] px-6 rounded-full bg-ml-coral text-ml-deep font-extrabold text-[15px] inline-flex items-center hover:text-ml-deep transition-transform hover:-translate-y-0.5"
          >
            Book a Tutor
          </Link>
        </div>
      </Reveal>
    </article>
  );
};

export default BlogDetailsPage;
