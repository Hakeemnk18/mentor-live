import { Link } from "react-router-dom";
import { useState } from "react";
import { tintFor } from "./ui/tints";

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
  const tint = tintFor(badgeLabel);

  return (
    <Link
      to={`/blogs/${id}`}
      className="group h-full bg-white rounded-[28px] overflow-hidden flex flex-col min-w-0 shadow-[0_1px_0_rgba(42,22,80,.04),0_16px_36px_-22px_rgba(42,22,80,.35)] transition-transform duration-300 hover:-translate-y-1.5"
    >
      {/* Thumbnail */}
      <div className="relative h-[190px] overflow-hidden flex items-center justify-center" style={{ background: tint.bg }}>
        {showImage ? (
          <img
            src={image!.url}
            alt={heading}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Heading-initial fallback */
          <span
            aria-hidden="true"
            className="font-display font-extrabold text-[120px] leading-none tracking-[-0.06em] opacity-20 select-none"
            style={{ color: tint.ink }}
          >
            {initial}
          </span>
        )}

        {/* Topic badge */}
        <span
          className="absolute left-4 top-4 px-3 py-1.5 rounded-full bg-white text-[11px] font-extrabold tracking-[0.12em] uppercase whitespace-nowrap max-w-[calc(100%-32px)] truncate"
          style={{ color: tint.ink }}
        >
          {badgeLabel}
        </span>
      </div>

      {/* Content */}
      <div className="px-6 pt-[22px] pb-6 flex flex-col gap-2.5 flex-1">
        <h3 className="m-0 font-display font-bold text-[21px] leading-[1.2] text-ml-ink tracking-[-0.02em] line-clamp-2 group-hover:text-ml-violet transition-colors">
          {heading}
        </h3>
        <p className="m-0 text-sm leading-relaxed text-ml-muted line-clamp-3">{description}</p>

        {/* Footer */}
        <div className="mt-auto pt-3.5 flex items-center gap-2.5 text-xs text-ml-muted min-w-0">
          <span className="font-extrabold tracking-[0.1em] text-ml-ink uppercase truncate">{author}</span>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#C9BFDD] flex-shrink-0" />
          <span className="flex-shrink-0">5 min read</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
