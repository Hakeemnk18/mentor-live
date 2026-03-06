import { useNavigate } from "react-router-dom";

type FacultyCardProps = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  image?: { url: string; publicId: string } | string;
};

const FacultyCard: React.FC<FacultyCardProps> = ({
  id,
  name,
  qualifications,
  description,
  image,
}) => {
  const navigate = useNavigate();
  const imgUrl =
    typeof image === "string"
      ? image
      : image?.url ?? "";

  const handleClick = () => {
    navigate("/faculty-details", { state: { facultyId: id } });
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-56 bg-gray-100 overflow-hidden flex">
        {/* Red accent bar */}
        <div className="w-1.5 bg-[#DB313E] flex-shrink-0 z-10" />

        <div className="flex-1 overflow-hidden">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-bold text-gray-900 mb-0.5">{name}</h3>
        <p className="text-[#DB313E] text-xs font-semibold mb-2">
          {qualifications.join(" · ")}
        </p>
        <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>

        <span className="inline-flex items-center gap-1.5 text-[#DB313E] text-sm font-semibold group-hover:underline mt-3">
          View Profile
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default FacultyCard;
