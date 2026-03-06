type BlogCardProps = {
  slug: string;
  heading: string;
  description: string;
  author: string;
};

const BlogCard: React.FC<BlogCardProps> = ({
  slug,
  heading,
  description,
  author,
}) => {
  return (
    <div className="bg-white rounded-md shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col min-w-0">
      {/* Thumbnail placeholder – grey with icon */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 48 48">
          <rect x="6" y="8" width="36" height="32" rx="4" />
          <circle cx="18" cy="20" r="4" />
          <path d="M6 34l10-8 6 5 10-10 10 8" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[#DB313E] text-xs font-bold uppercase tracking-wider mb-2">
          {author}
        </p>

        <h3 className="text-base font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
          {heading}
        </h3>

        <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-3 mb-4 flex-1">
          {description}
        </p>

        <a
          href={`/blogs/${slug}`}
          className="inline-flex items-center gap-1 text-[#DB313E] text-sm font-semibold hover:underline mt-auto"
        >
          Read More
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default BlogCard;
