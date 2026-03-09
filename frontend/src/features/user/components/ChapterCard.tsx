import { useNavigate } from "react-router-dom";

type ChapterCardProps = {
  id: string;
  name: string;
  price: number;
  icon?: string;
  subjectName: string;
  syllabusId?: string;
  classId?: string;
};

const ChapterCard: React.FC<ChapterCardProps> = ({
  id,
  name,
  price,
  icon,
  subjectName,
  syllabusId,
  classId,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chapter-faculty", { state: { chapterId: id, chapterName: name, syllabusId, classId } });
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
    >
      {/* Image area */}
      <div className="relative h-56 bg-gray-100 overflow-hidden flex">
        {/* Red accent bar */}
        <div className="w-1.5 bg-[#DB313E] flex-shrink-0 z-10" />

        <div className="flex-1 overflow-hidden">
          {icon ? (
            <img
              src={typeof icon === "string" ? icon : (icon as any)?.url}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-bold text-gray-900 mb-0.5">{name}</h3>
        <p className="text-[#DB313E] text-xs font-semibold mb-2">
          {subjectName}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3">
          <p className="text-gray-900 font-extrabold text-lg">₹{price}</p>
          <span className="inline-flex items-center gap-1.5 text-[#DB313E] text-sm font-semibold group-hover:underline">
            Find Tutors
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;
