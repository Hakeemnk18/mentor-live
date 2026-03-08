import { Link } from "react-router-dom";

type BlogCardProps = {
  id: string;
  heading: string;
  description: string;
  author: string;
};

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  heading,
  description,
  author,
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden flex flex-col min-w-0 transition hover:shadow-md">
      {/* Thumbnail placeholder */}
      <div className="relative h-48 bg-slate-800 flex items-center justify-center">
        {/* Red Education Badge */}
        <div className="absolute top-4 left-4 bg-[#DB313E] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
          Education
        </div>
        <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 48 48">
          <rect x="6" y="8" width="36" height="32" rx="4" />
          <circle cx="18" cy="20" r="4" />
          <path d="M6 34l10-8 6 5 10-10 10 8" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Content */}
      <div className="px-6 py-5 flex flex-col flex-1">
        <Link to={`/blogs/${id}`} className="group outline-none">
          <h3 className="text-[17px] font-bold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-[#DB313E] transition-colors">
            {heading}
          </h3>
        </Link>

        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-6 flex-1">
          {description}
        </p>

        {/* Footer (Author & Read time) */}
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
    </div>
  );
};

export default BlogCard;
