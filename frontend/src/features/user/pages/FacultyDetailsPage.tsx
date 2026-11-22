import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getFacultyPublicProfile,
  getFacultyAvailableSlots,
  getFacultyByChapter,
} from "../../../api/faculty.api";
import BookingModal from "../components/BookingModal";
import WaveEdge from "../components/ui/WaveEdge";
import Reveal from "../components/ui/Reveal";
import ErrorState from "../components/ui/ErrorState";
import { ArrowRight, ChevronLeft, Person } from "../components/ui/Icons";
import { initials, tintFor } from "../components/ui/tints";

type OfferingItem = {
  variantId: string;
  subjectName: string;
  className: string;
  syllabusName: string;
  /** ids of the class & syllabus this subject belongs to (used for bookings) */
  classId?: string;
  syllabusId?: string;
  price: number;
};

type SlotData = {
  id: string;
  isAvailable: boolean;
  time?: string;
  chapter?: { id: string; name: string };
  pool: any[];
  poolLimit: number;
};

type FacultyData = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  demoClass?: string;
  image?: string;
  price: number;
  slot?: SlotData;
};

/** Extract YouTube video ID from various URL formats */
const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/v\/)([\w-]{11})/,
    /(?:youtube\.com\/live\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
};

const formatTime = (time: string) => {
  const d = new Date(time);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

const FacultyDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    facultyId = "",
    chapterId,
    syllabusId = "",
    classId = "",
    variantId: initialVariantId = "",
  } = (location.state ?? {}) as {
    facultyId?: string;
    chapterId?: string;
    syllabusId?: string;
    classId?: string;
    variantId?: string;
  };

  const isChapterMode = !!chapterId;

  /* ─── Slot mode: which variant is currently selected ─── */
  const [activeVariantId, setActiveVariantId] = useState<string>(initialVariantId);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"oneToOne" | "pooling">("pooling");
  const [avatarError, setAvatarError] = useState(false);

  /* ─── Chapter mode: fetch via existing chapter endpoint ─── */
  const {
    data: chapterFaculty,
    isLoading: chapterLoading,
    isError: chapterError,
  } = useQuery<FacultyData>({
    queryKey: ["faculty-detail-chapter", facultyId, chapterId],
    queryFn: () => getFacultyByChapter(facultyId, chapterId!),
    enabled: isChapterMode && !!facultyId,
    refetchOnWindowFocus: false,
  });

  /* ─── Slot mode: always load public profile (no variantId needed) ─── */
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["faculty-public-profile", facultyId, classId, syllabusId],
    queryFn: () =>
      getFacultyPublicProfile(facultyId, {
        classId: classId || undefined,
        syllabusId: syllabusId || undefined,
      }),
    enabled: !isChapterMode && !!facultyId,
    refetchOnWindowFocus: false,
  });

  /* ─── Slot mode: available slots for the chosen variant ─── */
  const { data: slots } = useQuery({
    queryKey: ["faculty-slots", facultyId, activeVariantId],
    queryFn: () => getFacultyAvailableSlots(facultyId, activeVariantId),
    enabled: !isChapterMode && !!facultyId && !!activeVariantId,
    refetchOnWindowFocus: false,
  });

  /* ─── Derived values ─── */
  const isLoading = isChapterMode ? chapterLoading : profileLoading;
  const isError   = isChapterMode ? chapterError   : profileError;

  const availableSlots = slots ?? [];

  // For slot mode: read pool info directly from the slots list (no separate admin call needed)
  const selectedSlotInfo = availableSlots.find((s) => s.id === selectedSlotId);
  const activeSlot = chapterFaculty?.slot;
  const poolCount  = isChapterMode
    ? (activeSlot?.pool?.length ?? 0)
    : (selectedSlotInfo?.poolCount ?? 0);
  const poolLimit  = isChapterMode
    ? (activeSlot?.poolLimit ?? 5)
    : (selectedSlotInfo?.poolLimit ?? 5);

  // Price: from the selected variant's offering, or chapter faculty price
  const selectedOffering: OfferingItem | undefined = (profile?.subjectOffering ?? []).find(
    (o) => o.variantId === activeVariantId,
  );
  const slotPrice = isChapterMode
    ? (chapterFaculty?.price ?? 0)
    : (selectedOffering?.price ?? 0);

  // Price tiers for pooling visualisation
  const priceTiers = [
    { label: `${slotPrice}`,                      suffix: "/each" },
    { label: `${Math.round(slotPrice / 2)}`,      suffix: "/each" },
    { label: `${Math.round(slotPrice / 3)}`,      suffix: "/each" },
    { label: `${Math.round(slotPrice / 4)}`,      suffix: "/each" },
    { label: `${Math.round(slotPrice / 5)}`,      suffix: "/each" },
  ];

  // Names for header display
  const displayName    = isChapterMode ? chapterFaculty?.name    : profile?.name    ?? "";
  const displayQuals   = isChapterMode ? chapterFaculty?.qualifications : profile?.qualifications ?? [];
  const displayDesc    = isChapterMode ? chapterFaculty?.description  : profile?.description    ?? "";
  const displayDemo    = isChapterMode ? chapterFaculty?.demoClass    : profile?.demoClass      ?? "";
  const displayImage   = isChapterMode ? chapterFaculty?.image        : profile?.image          ?? "";
  const offerings: OfferingItem[] = profile?.subjectOffering ?? [];

  const bookDisabled = !isChapterMode && !selectedSlotId;
  const tint = tintFor(displayName);

  /* ─── Loading skeleton ─── */
  if (isLoading) {
    return (
      <div className="min-h-[80vh]">
        <div className="relative bg-ml-hero h-[300px]">
          <WaveEdge />
        </div>
        <div className="max-w-[1200px] mx-auto px-5 -mt-[180px] relative animate-pulse">
          <div className="w-[140px] h-[140px] rounded-[40px] bg-white/30" />
          <div className="mt-6 space-y-4">
            <div className="h-6 bg-white/40 rounded w-1/3" />
            <div className="h-4 bg-white/30 rounded w-1/2" />
          </div>
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 mt-24">
            <div className="h-64 bg-white rounded-[30px]" />
            <div className="h-80 bg-white rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || (!isChapterMode && !profile) || (isChapterMode && !chapterFaculty)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <ErrorState sub="Couldn't load faculty details." />
      </div>
    );
  }

  const cardCls = "bg-white rounded-[30px] p-[clamp(22px,3vw,32px)] shadow-[0_18px_40px_-26px_rgba(42,22,80,.4)] flex flex-col gap-4";
  const cardTitle = "m-0 font-display font-extrabold text-2xl text-ml-deep tracking-[-0.02em]";
  const eyebrow = "text-xs font-extrabold tracking-[0.14em] text-ml-ink";

  return (
    <div className="min-h-[80vh]">
      {/* ── Purple profile header ── */}
      <section className="relative overflow-hidden bg-ml-hero text-white">
        <div
          aria-hidden="true"
          className="absolute w-[640px] h-[640px] -right-[200px] -top-[320px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(146,98,245,.6),rgba(146,98,245,0) 65%)" }}
        />
        <div className="relative max-w-[1200px] mx-auto px-5 pt-[clamp(22px,3vw,36px)] pb-[clamp(100px,10vw,130px)]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 font-extrabold text-sm text-ml-soft cursor-pointer hover:text-white"
          >
            <ChevronLeft /> Back
          </button>
          <Reveal className="flex flex-wrap gap-[clamp(20px,3vw,36px)] items-center mt-[22px]">
            <div
              className="flex-shrink-0 w-[clamp(116px,15vw,160px)] aspect-square rounded-[40px] -rotate-[4deg] overflow-hidden flex items-center justify-center font-display font-extrabold text-[clamp(48px,6vw,64px)] tracking-[-0.05em] shadow-[0_24px_40px_-18px_rgba(10,0,40,.6)]"
              style={{ background: tint.bg, color: tint.ink }}
            >
              {displayImage && !avatarError ? (
                <img
                  src={displayImage}
                  alt={displayName}
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover rotate-[4deg] scale-110"
                />
              ) : (
                initials(displayName)
              )}
            </div>
            <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-2.5">
              <span className="text-xs font-extrabold tracking-[0.16em] text-ml-peach uppercase">
                {isChapterMode && activeSlot?.chapter ? `${activeSlot.chapter.name} · Faculty` : "Faculty"}
              </span>
              <h1 className="m-0 font-display font-extrabold text-[clamp(36px,5vw,58px)] leading-none tracking-[-0.04em] break-words">
                {displayName}
              </h1>
              {(displayQuals ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {(displayQuals ?? []).map((q, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-white/12 border border-white/22 text-[13px] font-bold">
                      {q}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
        <WaveEdge />
      </section>

      {/* ── Main content ── */}
      <section className="relative z-[2] max-w-[1200px] mx-auto -mt-[clamp(44px,5vw,60px)] px-5 pb-[clamp(64px,8vw,110px)] flex flex-wrap gap-5 items-start">
        {/* LEFT COLUMN */}
        <div className="flex-[1.4_1_420px] min-w-0 flex flex-col gap-5">
          {/* Introduction */}
          <Reveal className={cardCls}>
            <h2 className={cardTitle}>About</h2>
            <p className="m-0 text-base leading-[1.7] text-ml-body text-pretty whitespace-pre-line">{displayDesc}</p>
          </Reveal>

          {/* ── Slot mode: Subject Variant Selector ── */}
          {!isChapterMode && offerings.length > 0 && (
            <Reveal className={cardCls}>
              <div className="flex flex-col gap-1">
                <h2 className={cardTitle}>Choose a subject</h2>
                <span className="text-[13px] font-bold text-ml-muted">Pick a subject to see available slots</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-2.5">
                {offerings.map((o) => {
                  const isActive = activeVariantId === o.variantId;
                  return (
                    <button
                      key={o.variantId}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setActiveVariantId(o.variantId);
                        setSelectedSlotId(null); // reset slot on variant change
                      }}
                      className={`px-4 py-3.5 rounded-[18px] border-2 text-left flex flex-col gap-1 cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "bg-ml-violet border-ml-violet text-white"
                          : "bg-white border-ml-line text-ml-ink hover:border-ml-violet"
                      }`}
                    >
                      <span className="font-extrabold text-[15px] leading-tight">{o.subjectName}</span>
                      <span className={`text-xs font-bold ${isActive ? "text-white/80" : "text-ml-muted"}`}>
                        {o.className} · {o.syllabusName}
                      </span>
                      <span className={`text-xs font-extrabold ${isActive ? "text-white" : "text-ml-violet"}`}>₹{o.price} /hr</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          )}

          {/* Demo Class */}
          {displayDemo && (() => {
            const videoId = getYoutubeId(displayDemo);
            return (
              <Reveal className={cardCls}>
                <h2 className={cardTitle}>Demo Class</h2>
                {videoId ? (
                  <a
                    href={displayDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block w-full max-w-[420px] aspect-video rounded-[22px] overflow-hidden"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt="Demo class thumbnail"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-ml-night/25 group-hover:bg-ml-night/35 transition-colors">
                      <span className="w-14 h-14 rounded-full bg-ml-coral flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-ml-deep ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </a>
                ) : (
                  <a
                    href={displayDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start inline-flex items-center gap-2 font-extrabold text-ml-violet hover:underline"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                    Watch Demo Class
                  </a>
                )}
              </Reveal>
            );
          })()}

          {/* Chapter info — only in chapter mode */}
          {isChapterMode && activeSlot?.chapter && (
            <Reveal className={cardCls}>
              <h2 className={cardTitle}>Chapter</h2>
              <span className="self-start px-4 py-3 rounded-[18px] bg-ml-lav text-ml-plum font-extrabold">{activeSlot.chapter.name}</span>
            </Reveal>
          )}
        </div>

        {/* RIGHT COLUMN — Booking Card */}
        <div className="flex-[1_1_340px] min-w-0 lg:sticky lg:top-[92px]">
          <Reveal delay={120} className="bg-white rounded-[32px] p-[clamp(20px,2.6vw,28px)] shadow-[0_30px_60px_-30px_rgba(42,22,80,.5)] flex flex-col gap-[18px]">
            <div className="flex justify-between items-baseline gap-2.5">
              <h2 className={cardTitle}>Book a session</h2>
              {slotPrice > 0 && <span className="text-sm font-bold text-ml-muted whitespace-nowrap">₹{slotPrice}/hr</span>}
            </div>

            {/* Selected variant info */}
            {!isChapterMode && selectedOffering && (
              <div className="px-4 py-3 rounded-[18px] bg-ml-mist">
                <p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-ml-muted">SUBJECT</p>
                <p className="m-0 mt-0.5 text-sm font-extrabold text-ml-ink">
                  {selectedOffering.subjectName}
                  <span className="ml-2 text-xs font-semibold text-ml-muted">
                    {selectedOffering.className} · {selectedOffering.syllabusName}
                  </span>
                </p>
              </div>
            )}

            {/* Mode toggle */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-[20px] bg-ml-mist" role="radiogroup" aria-label="Session type">
              {([
                { key: "oneToOne", label: "1-on-1", sub: "Just you" },
                { key: "pooling", label: "Pool", sub: `Up to ${poolLimit} students` },
              ] as const).map((m) => {
                const on = bookingType === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setBookingType(m.key)}
                    className={`px-3 py-2.5 rounded-[15px] text-left cursor-pointer transition-all duration-[250ms] ${
                      on ? "bg-ml-deep text-white shadow-md" : "bg-transparent text-ml-ink hover:bg-white/70"
                    }`}
                  >
                    <span className="block font-extrabold text-[15px]">{m.label}</span>
                    <span className={`block text-xs font-semibold mt-0.5 ${on ? "text-white/75" : "text-ml-muted"}`}>{m.sub}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Slot mode: Available Slots ── */}
            {!isChapterMode && (
              <div className="flex flex-col gap-3">
                <span className={eyebrow}>AVAILABLE SLOTS</span>
                {!activeVariantId ? (
                  <p className="m-0 text-sm text-ml-muted">Select a subject to see available slots.</p>
                ) : availableSlots.length === 0 ? (
                  <p className="m-0 text-sm text-ml-muted">No available slots for this subject at the moment.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((s) => {
                      const isSelected = selectedSlotId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedSlotId(s.id)}
                          className={`h-[46px] rounded-[14px] border-2 font-extrabold text-[13px] cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "bg-ml-coral border-ml-coral text-ml-deep"
                              : "bg-white border-ml-line text-ml-ink hover:border-ml-coral"
                          }`}
                        >
                          {formatTime(s.time)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pooling status */}
            {bookingType === "pooling" && (
              <div className="flex flex-col gap-3">
                <span className={eyebrow}>
                  POOLING STATUS ·{" "}
                  <span className="text-ml-coral">{poolCount}</span>
                  <span className="text-ml-muted"> / {poolLimit} joined</span>
                </span>
                <div className="grid grid-cols-5 gap-2 p-3.5 rounded-[20px] bg-[#F4F8FF]" aria-hidden="true">
                  {Array.from({ length: Math.max(poolLimit, 1) }).slice(0, 10).map((_, i) => {
                    const state = i < poolCount ? "on" : i === poolCount ? "you" : "off";
                    const cls = {
                      on: "border-solid border-ml-ice bg-ml-ice",
                      you: "border-dashed border-ml-coral bg-ml-rose",
                      off: "border-dashed border-[#DCD3EE] bg-transparent scale-[.88]",
                    }[state];
                    const ic = { on: "#512B81", you: "#B4332A", off: "transparent" }[state];
                    return (
                      <div key={i} className={`aspect-square rounded-[14px] border-2 flex items-center justify-center transition-all duration-[450ms] ${cls}`}>
                        <Person className="w-[48%] h-[48%]" fill={ic} />
                      </div>
                    );
                  })}
                </div>
                {/* Price tiers */}
                <div className="flex gap-1.5">
                  {priceTiers.map((tier, i) => {
                    const isActive = i < poolCount;
                    return (
                      <div key={i} className="flex-1 min-w-0">
                        <div className={`h-1.5 rounded-full mb-1 ${isActive ? "bg-ml-coral" : "bg-ml-lav"}`} />
                        <p className="m-0 text-[10px] font-extrabold text-ml-ink text-center truncate">
                          ₹{tier.label}
                          <span className="hidden sm:inline text-ml-muted font-semibold">{tier.suffix}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
                <span className="text-[13px] font-semibold text-ml-muted">The dashed seat is yours. Each new student lowers the fee.</span>
              </div>
            )}

            {/* Prompt messages */}
            {!isChapterMode && !activeVariantId && (
              <p className="m-0 px-3.5 py-2.5 rounded-[14px] bg-ml-rose text-ml-red text-[13px] font-bold text-center">
                Please select a subject to continue.
              </p>
            )}
            {!isChapterMode && activeVariantId && !selectedSlotId && (
              <p className="m-0 px-3.5 py-2.5 rounded-[14px] bg-ml-rose text-ml-red text-[13px] font-bold text-center">
                Please select a time slot to proceed.
              </p>
            )}

            {/* Action */}
            <div className="pt-4 border-t-2 border-dashed border-ml-lav flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setBookingModalOpen(true)}
                disabled={bookDisabled}
                className={`h-[58px] rounded-[18px] font-extrabold text-base flex items-center justify-center gap-2.5 transition-all duration-[250ms] ${
                  bookDisabled
                    ? "bg-[#EEEAF5] text-[#8E86A3] cursor-not-allowed"
                    : bookingType === "oneToOne"
                      ? "bg-ml-violet text-white cursor-pointer hover:-translate-y-0.5"
                      : "bg-ml-coral text-ml-deep cursor-pointer hover:-translate-y-0.5"
                }`}
              >
                {bookingType === "oneToOne" ? `Book One-to-One — ₹${slotPrice}/hr` : "Join For Pooling"}
                <ArrowRight className="w-[18px] h-[18px]" />
              </button>
              {/* [OTP DISABLED – early stage] Re-enable when phone verification is needed again
              <span className="text-xs font-semibold text-ml-muted text-center">
                You'll verify your mobile number with a one-time OTP.
              </span>
              */}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        bookingType={bookingType}
        mode={isChapterMode ? "chapter" : "slot"}
        facultyId={facultyId}
        slotId={isChapterMode ? undefined : selectedSlotId}
        subjectVariantId={isChapterMode ? undefined : activeVariantId || undefined}
        chapterId={chapterId}
        // from the page we came from, or (e.g. opened from the home page) from the subject being booked
        defaultSyllabusId={syllabusId || selectedOffering?.syllabusId}
        defaultClassId={classId || selectedOffering?.classId}
      />
    </div>
  );
};

export default FacultyDetailsPage;
