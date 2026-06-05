import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getFacultyPublicProfile,
  getFacultyAvailableSlots,
  getFacultySlotDetails,
  getFacultyByChapter,
} from "../../../api/faculty.api";
import BookingModal from "../components/BookingModal";

type OfferingItem = {
  variantId: string;
  subjectName: string;
  className: string;
  syllabusName: string;
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

  /* ─── Slot mode: details of the currently selected slot ─── */
  const { data: selectedSlotData } = useQuery({
    queryKey: ["slot-details", facultyId, selectedSlotId],
    queryFn: () => getFacultySlotDetails(facultyId, selectedSlotId!),
    enabled: !isChapterMode && !!facultyId && !!selectedSlotId,
    refetchOnWindowFocus: false,
  });

  /* ─── Derived values ─── */
  const isLoading = isChapterMode ? chapterLoading : profileLoading;
  const isError   = isChapterMode ? chapterError   : profileError;

  const availableSlots = slots ?? [];
  const activeSlot = selectedSlotData ?? chapterFaculty?.slot;
  const poolCount  = activeSlot?.pool?.length ?? 0;
  const poolLimit  = activeSlot?.poolLimit ?? 5;

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

  /* ─── Loading skeleton ─── */
  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-[#F5F5F5]">
        <div className="bg-[#111] h-[200px]" />
        <div className="max-w-5xl mx-auto px-5 md:px-8 -mt-20">
          <div className="animate-pulse">
            <div className="w-36 h-36 rounded-full bg-gray-300 border-4 border-white" />
            <div className="mt-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || (!isChapterMode && !profile) || (isChapterMode && !chapterFaculty)) {
    return (
      <div className="min-h-[80vh] bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-medium">Something went wrong</p>
          <p className="text-gray-400 text-sm mt-1">Couldn't load faculty details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#F5F5F5]">
      {/* ── Black hero strip ── */}
      <div className="bg-[#111] h-[200px] md:h-[220px]" />

      {/* ── Profile header (overlapping hero) ── */}
      <div className="max-w-5xl mx-auto px-5 md:px-8 -mt-24">
        <div className="flex items-end gap-6 mb-10">
          {/* Avatar */}
          <div className="w-36 h-36 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden shrink-0">
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}
          </div>

          {/* Name + badges */}
          <div className="pb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.8),0_0_8px_rgba(0,0,0,0.6)]">
              {displayName}
            </h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="bg-[#DB313E] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {(displayQuals ?? [])[0] ?? "Faculty"}
              </span>
              {isChapterMode && activeSlot?.chapter && (
                <span className="bg-gray-700 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {activeSlot.chapter.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Main content grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-16">
          {/* LEFT COLUMN (3/5) */}
          <div className="lg:col-span-3 space-y-10">

            {/* Introduction */}
            <div>
              <SectionHeading label="Introduction" />
              <p className="text-gray-500 text-sm leading-relaxed pl-3">{displayDesc}</p>
            </div>

            {/* Qualifications */}
            <div>
              <SectionHeading label="Qualifications" />
              <div className="flex flex-wrap gap-3 pl-3">
                {(displayQuals ?? []).map((q, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-md border border-gray-200"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo Class */}
            {displayDemo && (() => {
              const videoId = getYoutubeId(displayDemo);
              return (
                <div>
                  <SectionHeading label="Demo Class" />
                  <div className="pl-3">
                    {videoId ? (
                      <a
                        href={displayDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-block rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt="Demo class thumbnail"
                          className="w-64 h-36 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-[#DB313E] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <a
                        href={displayDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#DB313E] text-sm font-semibold hover:underline"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Demo Class
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── Slot mode: Subject Variant Selector ── */}
            {!isChapterMode && offerings.length > 0 && (
              <div>
                <SectionHeading label="Select Subject" />
                <div className="flex flex-wrap gap-2 pl-3">
                  {offerings.map((o) => {
                    const isActive = activeVariantId === o.variantId;
                    return (
                      <button
                        key={o.variantId}
                        onClick={() => {
                          setActiveVariantId(o.variantId);
                          setSelectedSlotId(null); // reset slot on variant change
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#DB313E] text-white border-[#DB313E] shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#DB313E] hover:text-[#DB313E]"
                        }`}
                      >
                        <span className="font-semibold">{o.subjectName}</span>
                        <span className="text-[10px] ml-1 opacity-80">
                          {o.className} · {o.syllabusName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Slot mode: Available Slots (only after variant is picked) ── */}
            {!isChapterMode && (
              <div>
                <SectionHeading label="Available Slots" />
                <div className="flex flex-wrap gap-2 pl-3">
                  {!activeVariantId ? (
                    <p className="text-gray-400 text-sm">Select a subject above to see available slots.</p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-gray-400 text-sm">No available slots for this subject at the moment.</p>
                  ) : (
                    availableSlots.map((s) => {
                      const isSelected = selectedSlotId === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSlotId(s.id)}
                          className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#DB313E] text-white shadow-sm"
                              : "bg-[#DB313E]/10 text-[#DB313E] hover:bg-[#DB313E]/20"
                          }`}
                        >
                          {formatTime(s.time)}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Chapter info — only in chapter mode */}
            {isChapterMode && activeSlot?.chapter && (
              <div>
                <SectionHeading label="Chapter" />
                <p className="text-gray-600 text-sm font-medium pl-3">{activeSlot.chapter.name}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Booking Card (2/5) */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-8">

              {/* Selected variant info */}
              {!isChapterMode && selectedOffering && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Subject</p>
                  <p className="text-sm font-bold text-gray-800">
                    {selectedOffering.subjectName}
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      {selectedOffering.className} · {selectedOffering.syllabusName}
                    </span>
                  </p>
                </div>
              )}

              {/* Pooling status */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Pooling status:{" "}
                <span className="text-[#DB313E]">{poolCount}</span>
                <span className="text-gray-400"> / {poolLimit} students joined</span>
              </h3>

              {/* Price tiers */}
              <div className="flex gap-2 mb-4">
                {priceTiers.map((tier, i) => {
                  const isActive = i < poolCount;
                  return (
                    <div key={i} className="flex-1">
                      <div className={`h-2 rounded-full mb-1 ${isActive ? "bg-[#DB313E]" : "bg-gray-200"}`} />
                      <p className="text-[10px] font-bold text-gray-700 text-center">
                        {tier.label}
                        <span className="text-gray-400 font-normal">{tier.suffix}</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Pool avatars */}
              {poolCount > 0 && (
                <div className="flex gap-2 mb-5">
                  {Array.from({ length: poolCount }).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}

              {/* Prompt messages */}
              {!isChapterMode && !activeVariantId && (
                <p className="text-[#DB313E] text-xs font-bold text-center mb-3">
                  Please select a subject to continue.
                </p>
              )}
              {!isChapterMode && activeVariantId && !selectedSlotId && (
                <p className="text-[#DB313E] text-xs font-bold text-center mb-3">
                  Please select a time slot to proceed.
                </p>
              )}

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => { setBookingType("oneToOne"); setBookingModalOpen(true); }}
                  disabled={!isChapterMode && !selectedSlotId}
                  className={`w-full py-3 text-sm font-bold rounded-md transition ${
                    !isChapterMode && !selectedSlotId
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#111] text-white hover:bg-black cursor-pointer"
                  }`}
                >
                  Book One-on-One — ₹{slotPrice}/hr
                </button>
                <button
                  onClick={() => { setBookingType("pooling"); setBookingModalOpen(true); }}
                  disabled={!isChapterMode && !selectedSlotId}
                  className={`w-full py-3 text-sm font-bold rounded-md transition ${
                    !isChapterMode && !selectedSlotId
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#DB313E] text-white hover:bg-[#c12a36] cursor-pointer"
                  }`}
                >
                  Join For Pooling
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        defaultSyllabusId={syllabusId}
        defaultClassId={classId}
      />
    </div>
  );
};

/** Reusable section heading with red left bar */
const SectionHeading = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="w-1 h-6 bg-[#DB313E] rounded-full" />
    <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wide">{label}</h2>
  </div>
);

export default FacultyDetailsPage;
