import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getBlogById } from "../../../api/blog.api";

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
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 animate-pulse">
          <div className="w-32 h-8 bg-gray-200 rounded-sm mb-8" />
          <div className="h-12 bg-gray-200 rounded-sm mb-6 w-3/4" />
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded-sm w-48" />
              <div className="h-3 bg-gray-200 rounded-sm w-32" />
            </div>
          </div>
          <div className="w-full h-80 bg-gray-200 rounded-sm mb-12" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded-sm w-full" />
            <div className="h-4 bg-gray-200 rounded-sm w-full" />
            <div className="h-4 bg-gray-200 rounded-sm w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Blog not found</p>
          <p className="text-gray-500 text-sm">The article you are looking for does not exist or was removed.</p>
          <a href="/blogs" className="text-[#DB313E] font-medium text-sm hover:underline mt-4 inline-block">
            ← Back to blogs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <main className="max-w-[850px] mx-auto px-5 md:px-8 pt-16 md:pt-24">
        
        {/* Category Badge */}
        <div className="mb-6">
          <span className="bg-[#DB313E] text-white text-[13px] font-bold tracking-wide px-4 py-1.5 rounded-sm shadow-sm inline-block">
            Education
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[32px] md:text-[46px] font-extralight text-black leading-[1.15] mb-8 font-serif">
          {blog.heading}
        </h1>

        {/* Author info row */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
            {/* Simple author avatar placeholder */}
            <svg className="w-full h-full text-gray-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c-8-1.34-8-4-8-4z" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] text-black">
              <span className="font-semibold">By {blog.author}</span>{" "}
              <span className="text-gray-300 mx-2">|</span>{" "}
              <span className="text-gray-500">5 min read</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              April 10, 2024 {/* Mock date as it is not in API */}
            </p>
          </div>
        </div>

        {/* Hero Image Block */}
        <div className="w-full aspect-[16/9] md:aspect-[2/1] bg-slate-800 rounded-sm mb-12 flex items-center justify-center overflow-hidden">
          {blog.image?.url && !imgError ? (
            <img
              src={blog.image.url}
              alt={blog.heading}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Placeholder shown when the blog has no image or it fails to load */
            <svg className="w-20 h-20 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 48 48">
              <rect x="6" y="8" width="36" height="32" rx="4" />
              <circle cx="18" cy="20" r="4" />
              <path d="M6 34l10-8 6 5 10-10 10 8" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Content Body */}
        <article className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed font-serif">
          {/* Fallback to description if content is missing for any reason.
              whitespace-pre-wrap preserves the admin's line breaks and spacing. */}
          <p className="whitespace-pre-wrap">{blog.content || blog.description}</p>
        </article>

      </main>
    </div>
  );
};

export default BlogDetailsPage;
