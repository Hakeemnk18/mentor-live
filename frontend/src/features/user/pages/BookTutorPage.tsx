import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSyllabus } from "../../../api/syllabus.api";
import { getClasses } from "../../../api/class.api";

const BookTutorPage: React.FC = () => {
  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const navigate = useNavigate();

  /* ── Fetch syllabus list ── */
  const { data: syllabusData, isLoading: syllabusLoading } = useQuery({
    queryKey: ["user-syllabus"],
    queryFn: () => getSyllabus({ page: 1, limit: 100, isDeleted: false }),
  });

  /* ── Fetch classes (enabled after syllabus) ── */
  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["user-classes", syllabusId],
    queryFn: () => getClasses({ page: 1, limit: 100, isDeleted: false }),
    enabled: !!syllabusId,
  });

  const syllabuses = syllabusData?.rows ?? [];
  const classes = classData?.rows ?? [];

  const handleSyllabusChange = (val: string) => {
    setSyllabusId(val);
    setClassId("");
  };

  const handleFindFaculty = () => {
    const syllabusName = syllabuses.find((s) => s._id === syllabusId)?.name ?? "";
    const className = classes.find((c) => c._id === classId)?.name ?? "";
    navigate("/faculty", { state: { syllabusId, classId, syllabusName, className } });
  };

  const handleFindChapters = () => {
    const syllabusName = syllabuses.find((s) => s._id === syllabusId)?.name ?? "";
    const className = classes.find((c) => c._id === classId)?.name ?? "";
    navigate("/chapters", { state: { syllabusId, classId, syllabusName, className } });
  };

  return (
    <div className="min-h-[85vh] flex flex-col">
      {/* Form card */}
      <div className="flex-1 bg-[#F5F5F5] py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <div className="relative bg-white border-2 border-black shadow-[8px_8px_0px_0px_#111111] px-8 md:px-14 pt-12 pb-10">

            {/* Step badge */}
            <div className="flex justify-center mb-6">
              <span className="bg-[#DB313E] text-white text-xs font-bold uppercase tracking-widest px-5 py-1.5 rounded-full">
                Step 1: Discover
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-center text-3xl md:text-[38px] font-extrabold leading-tight text-gray-900 mb-3">
              Find Your Perfect
              <br />
              <span className="text-[#DB313E] italic">Learning Match</span>
            </h1>

            {/* Subtext */}
            <p className="text-center text-gray-500 text-sm md:text-[15px] max-w-md mx-auto mb-10 leading-relaxed">
              Tell us what you're studying, and we'll pair you with the best
              specialized faculty in the field
            </p>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Syllabus */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-800 mb-2">
                  Syllabus
                </label>
                <select
                  value={syllabusId}
                  onChange={(e) => handleSyllabusChange(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#DB313E] transition appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="">
                    {syllabusLoading ? "Loading..." : "Select Syllabus"}
                  </option>
                  {syllabuses.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-800 mb-2">
                  Class / Grade
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  disabled={!syllabusId}
                  className={`w-full border-2 rounded-none px-4 py-3 text-sm focus:outline-none transition appearance-none ${
                    !syllabusId
                      ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                      : "bg-white border-black text-gray-700 focus:border-[#DB313E] cursor-pointer"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="">
                    {!syllabusId
                      ? "Select syllabus first"
                      : classLoading
                        ? "Loading..."
                        : "Select Class"}
                  </option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleFindFaculty}
                disabled={!syllabusId || !classId}
                className={`w-full py-3.5 text-sm font-bold uppercase tracking-wider rounded-none transition ${
                  syllabusId && classId
                    ? "bg-[#DB313E] text-white hover:bg-[#c12a36] cursor-pointer"
                    : "bg-[#DB313E]/40 text-white/70 cursor-not-allowed"
                }`}
              >
                Find Faculty
              </button>
              <button
                onClick={handleFindChapters}
                disabled={!syllabusId || !classId}
                className={`w-full py-3.5 text-sm font-bold uppercase tracking-wider rounded-none transition ${
                  syllabusId && classId
                    ? "bg-[#DB313E] text-white hover:bg-[#c12a36] cursor-pointer"
                    : "bg-[#DB313E]/40 text-white/70 cursor-not-allowed"
                }`}
              >
                Find Chapters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTutorPage;
