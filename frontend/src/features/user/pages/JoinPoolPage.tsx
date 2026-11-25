import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPoolShareSummary } from "../../../api/share.api";
import Bear from "../components/ui/Bear";
import { ArrowRight } from "../components/ui/Icons";

/**
 * Landing page for "invite a friend" links: /join/:slotId
 * Open pool → straight to the tutor page with the booking form already open (Pool, same subject & time).
 * Full / closed pool → a friendly message with a way forward.
 */
const JoinPoolPage = () => {
  const { slotId = "" } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pool-share", slotId],
    queryFn: () => getPoolShareSummary(slotId),
    enabled: !!slotId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const open = !!data && data.isAvailable && !data.isFull;

  useEffect(() => {
    if (!open || !data) return;
    navigate("/faculty-details", {
      replace: true,
      state: {
        facultyId: data.facultyId,
        variantId: data.variantId,
        classId: data.classId,
        syllabusId: data.syllabusId,
        joinSlotId: data.slotId,
      },
    });
  }, [open, data, navigate]);

  if (isLoading || open) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="w-[96px] animate-ml-bob"><Bear pose="celebrate" /></div>
        <p className="m-0 font-extrabold text-ml-deep">Opening your friend&apos;s pool class…</p>
      </div>
    );
  }

  const full = !!data && data.isFull;
  const title = full ? "This pool is full" : "This class is no longer available";
  const sub = full
    ? `All ${data!.poolLimit} seats in ${data!.facultyName}'s ${data!.subjectName} pool are taken. Pick another time with the same tutor.`
    : isError
      ? "The link may be old, or the class time has changed."
      : "The tutor has closed this time. You can still book another class.";

  const btn = "h-[52px] px-6 rounded-[16px] font-extrabold inline-flex items-center justify-center gap-2 transition hover:-translate-y-0.5";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-16">
      <div className="max-w-[480px] w-full flex flex-col items-center text-center gap-3">
        <div className="w-[120px]"><Bear pose="lost" /></div>
        <h1 className="m-0 font-display font-extrabold text-[28px] text-ml-deep tracking-[-0.03em]">{title}</h1>
        <p className="m-0 text-[15px] leading-relaxed text-ml-muted">{sub}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2.5">
          {data && (
            <button
              type="button"
              onClick={() =>
                navigate("/faculty-details", {
                  replace: true,
                  state: { facultyId: data.facultyId, variantId: data.variantId, classId: data.classId, syllabusId: data.syllabusId },
                })
              }
              className={`${btn} bg-ml-coral text-ml-deep cursor-pointer`}
            >
              See other times <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <Link to="/book-tutor" className={`${btn} ${data ? "bg-white border-2 border-ml-line text-ml-ink" : "bg-ml-coral text-ml-deep"}`}>
            Find a tutor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JoinPoolPage;
