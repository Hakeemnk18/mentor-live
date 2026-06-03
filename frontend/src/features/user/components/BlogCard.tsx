import { Link } from "react-router-dom";
import { useState } from "react";

type BlogCardProps = {
  id: string;
  heading: string;
  description: string;
  author: string;
  image?: { url: string; publicId: string } | null;
  topic?: string | null;
};

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  heading,
  description,
  author,
  image,
  topic,
}) => {
  const [imgError, setImgError] = useState(false);
  const badgeLabel = topic?.trim() || "Education";
  const initial = heading.trim().charAt(0).toUpperCase();
  const showImage = !!image?.url && !imgError;

  return (
    <Link
      to={`/blogs/${id}`}
      className="group bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden flex flex-col min-w-0 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-slate-800 flex items-center justify-center overflow-hidden">
        {/* Topic badge */}
        <div className="absolute top-4 left-4 z-10 bg-[#DB313E] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
          {badgeLabel}
        </div>

        {showImage ? (
          <img
            src={image!.url}
            alt={heading}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Heading-initial fallback */
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl font-extrabold text-slate-500/60 leading-none select-none">
              {initial}
            </span>
            <svg className="w-8 h-8 text-slate-600/40" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 48 48">
              <rect x="6" y="8" width="36" height="32" rx="4" />
              <circle cx="18" cy="20" r="4" />
              <path d="M6 34l10-8 6 5 10-10 10 8" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Hover overlay tint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-200" />
      </div>

      {/* Content */}
      <div className="px-6 py-5 flex flex-col flex-1">
        <h3 className="text-[17px] font-bold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-[#DB313E] transition-colors duration-150">
          {heading}
        </h3>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-6 flex-1">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
          <p className="text-[11px] font-bold text-gray-800 uppercase tracking-widest truncate">
            {author}
          </p>
          <span className="text-gray-300">•</span>
          <p className="text-[11px] font-medium text-gray-500 flex-shrink-0">
            5 min read
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
