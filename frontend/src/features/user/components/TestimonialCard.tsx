type TestimonialCardProps = {
  author: string;
  designation: string;
  comment: string;
  /** Index used to pick a deterministic placeholder avatar */
  index?: number;
};

const PLACEHOLDER_COLORS = [
  "from-blue-400 to-blue-600",
  "from-rose-400 to-rose-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-purple-400 to-purple-600",
  "from-cyan-400 to-cyan-600",
];

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  author,
  designation,
  comment,
  index = 0,
}) => {
  const initials = author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colorClass = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  return (
    <div className="bg-white rounded-md shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Placeholder image area */}
      <div className={`h-52 bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
        <span className="text-white text-5xl font-bold tracking-wider opacity-90">
          {initials}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-5 flex flex-col flex-1">
        {/* Quote icon */}
        <span className="text-[#DB313E] text-3xl font-serif leading-none mb-2">"</span>

        <p className="text-gray-600 text-[13px] leading-relaxed flex-1 mb-4">
          "{comment}"
        </p>

        <div>
          <p className="text-[#DB313E] font-bold text-[15px]">{author}</p>
          <p className="text-gray-400 text-xs">{designation}</p>
        </div>

        {/* Stars */}
        <div className="flex gap-0.5 mt-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-[#DB313E]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
