import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSyllabusList } from "../../../api/syllabus.api";
import { getClassesList } from "../../../api/class.api";
import Bear from "../components/ui/Bear";
import Reveal from "../components/ui/Reveal";
import { ArrowRight } from "../components/ui/Icons";

const BookTutorPage: React.FC = () => {
  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const navigate = useNavigate();

  /* ── Fetch syllabus list ── */
  const { data: syllabusData, isLoading: syllabusLoading } = useQuery({
    queryKey: ["user-syllabus"],
    queryFn: () => getSyllabusList(),
  });

  /* ── Fetch classes (enabled after syllabus) ── */
  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["user-classes", syllabusId],
    queryFn: () => getClassesList(),
    enabled: !!syllabusId,
  });

  const syllabuses = syllabusData ?? [];
  const classes = classData ?? [];

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

  const ready = !!syllabusId && !!classId;
  const stepTag = !syllabusId ? "STEP 1 OF 3" : !classId ? "STEP 2 OF 3" : "STEP 3 OF 3";
  const bearSays = !syllabusId
    ? "Hi! Which syllabus are you studying? Pick one to get started."
    : !classId
      ? "Nice choice! Now tell me your class."
      : "Perfect! Find a faculty, or browse chapters for something specific.";

  const steps = [
    { label: "Syllabus", done: !!syllabusId, active: !syllabusId },
    { label: "Class", done: !!classId, active: !!syllabusId && !classId },
    { label: "Search", done: false, active: ready },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F1ECFA] px-5 pt-[clamp(28px,6vw,80px)] pb-[clamp(48px,7vw,96px)] min-h-[85vh]">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(109,53,217,.12) 1.5px,transparent 1.6px)", backgroundSize: "26px 26px" }}
      />
      <Reveal className="relative max-w-[1080px] mx-auto flex flex-wrap bg-white rounded-[38px] overflow-hidden shadow-[0_40px_80px_-40px_rgba(42,22,80,.5)]">
        {/* Bear panel */}
        <div className="flex-[1_1_320px] min-h-[340px] md:min-h-[380px] bg-ml-hero text-white pt-8 px-7 flex flex-col gap-5 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute w-[420px] h-[420px] -right-[160px] -top-[180px] rounded-full"
            style={{ background: "radial-gradient(circle,rgba(146,98,245,.6),rgba(146,98,245,0) 65%)" }}
          />
          <span className="relative self-start px-3.5 py-[7px] rounded-full bg-ml-coral text-ml-deep text-xs font-extrabold tracking-[0.14em] whitespace-nowrap">
            {stepTag}
          </span>
          <div
            aria-live="polite"
            className="relative bg-white text-ml-deep rounded-[22px_22px_22px_6px] px-[18px] py-4 font-bold text-base leading-[1.45] shadow-[0_18px_40px_-14px_rgba(20,8,50,.6)] max-w-[300px]"
          >
            {bearSays}
          </div>
          <div className="relative mt-auto flex justify-center">
            <div
              aria-hidden="true"
              className="absolute left-[4%] right-[4%] -bottom-10 h-[100px] rounded-[50%]"
              style={{ background: "linear-gradient(180deg,#F1F7FF,#A9CBF5)" }}
            />
            <div className="relative w-[64%] max-w-[230px] mb-[22px] animate-ml-bob" style={{ animationDuration: "4s" }}>
              <Bear pose={ready ? "celebrate" : "guide"} eager />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-[1.5_1_440px] min-w-0 p-[clamp(26px,4vw,48px)] flex flex-col gap-[26px]">
          <div className="flex flex-col gap-2.5">
            <h1 className="m-0 font-display font-extrabold text-[clamp(32px,4.4vw,48px)] leading-[1.02] tracking-[-0.04em] text-ml-deep">
              Find Your Perfect
              <br />
              <span className="text-ml-violet">Learning Match</span>
            </h1>
            <p className="m-0 text-base leading-relaxed text-ml-muted max-w-[32em]">
              Tell us what you're studying, and we'll pair you with the best specialized faculty in the field
            </p>
          </div>

          {/* Progress */}
          <div className="grid grid-cols-3 gap-2" aria-hidden="true">
            {steps.map((s) => (
              <div key={s.label} className="flex flex-col gap-2">
                <div className="h-1.5 rounded-md bg-ml-lav overflow-hidden">
                  <div
                    className="h-full bg-ml-coral rounded-md transition-[width] duration-500"
                    style={{ width: s.done ? "100%" : s.active ? "35%" : "0%" }}
                  />
                </div>
                <span className={`text-xs font-extrabold tracking-[0.06em] ${s.done ? "text-ml-ink" : "text-[#A39CB5]"}`}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Syllabus */}
          <fieldset className="m-0 p-0 border-0 flex flex-col gap-3">
            <legend className="text-xs font-extrabold tracking-[0.14em] text-ml-ink mb-3">SYLLABUS</legend>
            {syllabusLoading ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5">
                {[...Array(4)].map((_, i) => <div key={i} className="h-[58px] rounded-[18px] bg-ml-mist animate-pulse" />)}
              </div>
            ) : syllabuses.length === 0 ? (
              <p className="m-0 text-sm text-ml-muted">No syllabus available right now.</p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5">
                {syllabuses.map((s) => {
                  const on = syllabusId === s._id;
                  return (
                    <button
                      key={s._id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => handleSyllabusChange(s._id)}
                      className={`px-4 py-[15px] rounded-[18px] border-2 text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 font-display font-extrabold text-lg tracking-[-0.02em] break-words ${
                        on
                          ? "bg-ml-violet border-ml-violet text-white shadow-[0_12px_22px_-12px_rgba(109,53,217,.8)]"
                          : "bg-white border-ml-line text-ml-ink hover:border-ml-violet"
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>

          {/* Class */}
          <fieldset
            disabled={!syllabusId}
            className={`m-0 p-0 border-0 flex flex-col gap-3 transition-opacity duration-300 ${syllabusId ? "opacity-100" : "opacity-45"}`}
          >
            <legend className="text-xs font-extrabold tracking-[0.14em] text-ml-ink mb-3">
              CLASS / GRADE{" "}
              {!syllabusId && <span className="font-semibold tracking-normal text-ml-muted">(pick a syllabus first)</span>}
            </legend>
            {syllabusId && classLoading ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2.5">
                {[...Array(5)].map((_, i) => <div key={i} className="h-[64px] rounded-[18px] bg-ml-mist animate-pulse" />)}
              </div>
            ) : !syllabusId ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2.5">
                {[...Array(5)].map((_, i) => <div key={i} className="h-[64px] rounded-[18px] border-2 border-ml-line" />)}
              </div>
            ) : classes.length === 0 ? (
              <p className="m-0 text-sm text-ml-muted">No classes available right now.</p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2.5">
                {classes.map((c) => {
                  const on = classId === c._id;
                  return (
                    <button
                      key={c._id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setClassId(c._id)}
                      className={`min-h-[64px] px-2 py-2.5 rounded-[18px] border-2 cursor-pointer flex items-center justify-center text-center transition-all duration-200 font-display font-extrabold text-[clamp(18px,2vw,22px)] leading-tight break-words disabled:cursor-not-allowed ${
                        on
                          ? "bg-ml-coral border-ml-coral text-ml-deep shadow-[0_12px_22px_-12px_rgba(255,107,94,.9)]"
                          : "bg-white border-ml-line text-ml-ink hover:border-ml-coral"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <button
              type="button"
              onClick={handleFindFaculty}
              disabled={!ready}
              className={`h-[58px] rounded-[18px] font-extrabold text-base tracking-[0.04em] flex items-center justify-center gap-2.5 transition-all duration-[250ms] ${
                ready ? "bg-ml-violet text-white cursor-pointer hover:-translate-y-0.5" : "bg-[#EEEAF5] text-[#8E86A3] cursor-not-allowed"
              }`}
            >
              FIND FACULTY
              <ArrowRight className="w-[18px] h-[18px]" />
            </button>
            <button
              type="button"
              onClick={handleFindChapters}
              disabled={!ready}
              className={`h-[58px] rounded-[18px] font-extrabold text-base tracking-[0.04em] flex items-center justify-center gap-2.5 transition-all duration-[250ms] ${
                ready ? "bg-ml-coral text-ml-deep cursor-pointer hover:-translate-y-0.5" : "bg-[#EEEAF5] text-[#8E86A3] cursor-not-allowed"
              }`}
            >
              FIND CHAPTERS
              <ArrowRight className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default BookTutorPage;
