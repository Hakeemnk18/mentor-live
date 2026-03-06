type SubjectPillsProps = {
  items: { _id: string; subjectName: string }[];
  activeId?: string;
  onSelect: (id: string | undefined) => void;
};

const SubjectPills: React.FC<SubjectPillsProps> = ({
  items,
  activeId,
  onSelect,
}) => {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {/* All pill */}
        <button
          onClick={() => onSelect(undefined)}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all border ${
            !activeId
              ? "bg-[#DB313E] text-white border-[#DB313E] shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#DB313E] hover:text-[#DB313E]"
          }`}
        >
          All
        </button>

        {items.map((item) => {
          const active = activeId === item._id;
          return (
            <button
              key={item._id}
              onClick={() => onSelect(item._id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                active
                  ? "bg-[#DB313E] text-white border-[#DB313E] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#DB313E] hover:text-[#DB313E]"
              }`}
            >
              {item.subjectName}
            </button>
          );
        })}
      </div>

      {/* Fade edge */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#F5F5F5] to-transparent" />
    </div>
  );
};

export default SubjectPills;
