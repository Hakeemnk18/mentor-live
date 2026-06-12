import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { formatTimeAMPM, toMinutesSinceMidnight } from "../../../shared/utils/time.utils";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import {
  getFacultyById,
  setFacultySlotAvailability,
  addFacultyChapterSlot,
  setFacultyChapterSlotAvailability,
  addFacultySlotIST,
} from "../../../api/faculty.api";
import { getChaptersList } from "../../../api/chapter.api";
import { getClasses } from "../../../api/class.api";
import { getSyllabus } from "../../../api/syllabus.api";
import EditFacultyBasicModal from "../components/EditFacultyBasicModal";
import PoolBookingModal from "../components/PoolBookingModal";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import type { TimeSlot, ChapterSlot, FacultyData } from "../../../shared/types/faculty.types";
import type { PoolBooking } from "../../../shared/types/booking.types";
/* ================================================================== */
/* HELPERS                                                              */
/* ================================================================== */

// const timeStringToISOSlot = (time: string): string => {
//   const [h, m] = time.split(":").map(Number);
//   const d = new Date();
//   d.setHours(h, m, 0, 0);
//   const localIsoDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
//   return localIsoDate.toISOString();
// };

/** Extract YouTube video ID from various URL formats */
const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/v\/)([\w-]{11})/,
    /(?:youtube\.com\/live\/)([\w-]{11})/,   // YouTube Live URLs
    /(?:youtube\.com\/shorts\/)([\w-]{11})/, // YouTube Shorts
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
};

/* ================================================================== */
/* COMPONENT                                                            */
/* ================================================================== */

export default function FacultyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* ---------- State ---------- */
  const [faculty, setFaculty] = useState<FacultyData | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit basic info modal
  const [editOpen, setEditOpen] = useState(false);
  const [syllabusList, setSyllabusList] = useState<{ _id: string; name: string }[]>([]);
  const [classesList, setClassesList] = useState<{ _id: string; name: string }[]>([]);

  // Time slot add
  const [newTime, setNewTime] = useState("");
  const [slotWorking, setSlotWorking] = useState(false);
  const [slotError, setSlotError] = useState("");

  // Currently selected subject variant for the Time Slots section
  const [selectedSlotVariantId, setSelectedSlotVariantId] = useState("");

  // Chapter slot add
  const [chapterSyllabusId, setChapterSyllabusId] = useState("");
  const [chapterClassId, setChapterClassId] = useState("");
  const [chapterOptions, setChapterOptions] = useState<{ _id: string; name: string }[]>([]);
  const [chapterId, setChapterId] = useState("");
  const [chapterWorking, setChapterWorking] = useState(false);

  // Pool booking modal
  const [selectedPoolBooking, setSelectedPoolBooking] = useState<PoolBooking | null>(null);

  /* ---------- Fetch faculty data ---------- */
  const fetchFaculty = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getFacultyById(id);
      setFaculty(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  /* Default the Time Slots variant filter to the first subject offering */
  useEffect(() => {
    if (!faculty) return;
    setSelectedSlotVariantId((prev) =>
      faculty.subjectOffering.some((so) => so.id === prev)
        ? prev
        : faculty.subjectOffering[0]?.id ?? ""
    );
  }, [faculty]);

  /* Fetch syllabuses and classes for edit modal & chapter add */
  useEffect(() => {
    Promise.all([
      getSyllabus({ page: 1, limit: 100 }),
      getClasses({ page: 1, limit: 100 }),
    ])
      .then(([s, c]) => {
        setSyllabusList(s.rows);
        setClassesList(c.rows);
      })
      .catch(handleApiError);
  }, []);

  /* Fetch chapter options when syllabus + class selected */
  useEffect(() => {
    if (!chapterSyllabusId || !chapterClassId) {
      setChapterOptions([]);
      setChapterId("");
      return;
    }
    getChaptersList({ syllabusId: chapterSyllabusId, classId: chapterClassId })
      .then((items) => setChapterOptions(items.map((c) => ({ _id: c._id, name: c.name }))))
      .catch(handleApiError);
  }, [chapterSyllabusId, chapterClassId]);

  /* ================================================================ */
  /* TIME SLOT ACTIONS                                                  */
  /* ================================================================ */

  const handleAddTimeSlot = async () => {
    if (!newTime || !selectedSlotVariantId || !id || !faculty) return;

    // 1-hr gap check against this variant's active slots
    const newMins = toMinutesSinceMidnight(newTime);
    const overlap = faculty.slots.find(
      (s) =>
        s.variantId === selectedSlotVariantId &&
        s.isAvailable &&
        newMins !== null &&
        Math.abs((toMinutesSinceMidnight(s.time) ?? Infinity) - newMins) < 60
    );
    if (overlap) {
      setSlotError(`Overlaps with ${formatTimeAMPM(overlap.time)} — slots must be at least 1 hr apart`);
      return;
    }
    setSlotError("");

    try {
      setSlotWorking(true);
      await addFacultySlotIST(id, { time: newTime, variantId: selectedSlotVariantId });
      toast.success("Time slot added");
      setNewTime("");
      await fetchFaculty();
    } catch (err) {
      handleApiError(err);
    } finally {
      setSlotWorking(false);
    }
  };

  const handleToggleSlot = async (slot: TimeSlot) => {
    if (!id || !faculty) return;

    // Unblocking: ensure a 1-hr gap from every other active slot for this variant
    if (!slot.isAvailable) {
      const mins = toMinutesSinceMidnight(slot.time);
      const conflict = faculty.slots.find(
        (s) =>
          s.id !== slot.id &&
          s.variantId === slot.variantId &&
          s.isAvailable &&
          mins !== null &&
          Math.abs((toMinutesSinceMidnight(s.time) ?? Infinity) - mins) < 60
      );
      if (conflict) {
        toast.error(`Cannot unblock — overlaps with active slot ${formatTimeAMPM(conflict.time)}`);
        return;
      }
    }

    try {
      setSlotWorking(true);
      await setFacultySlotAvailability(id, slot.id, !slot.isAvailable);
      toast.success(slot.isAvailable ? "Slot blocked" : "Slot unblocked");
      await fetchFaculty();
    } catch (err) {
      handleApiError(err);
    } finally {
      setSlotWorking(false);
    }
  };

  /* ================================================================ */
  /* CHAPTER SLOT ACTIONS                                               */
  /* ================================================================ */

  const handleAddChapterSlot = async () => {
    if (!chapterId || !id) return;
    try {
      setChapterWorking(true);
      await addFacultyChapterSlot(id, { chapter: chapterId });
      toast.success("Chapter slot added");
      setChapterId("");
      await fetchFaculty();
    } catch (err) {
      handleApiError(err);
    } finally {
      setChapterWorking(false);
    }
  };

  const handleToggleChapterSlot = async (cs: ChapterSlot) => {
    if (!id) return;
    const slotId = typeof cs.chapter === "string" ? cs.chapter : cs.chapter.id;
    try {
      setChapterWorking(true);
      await setFacultyChapterSlotAvailability(id, slotId, !cs.isAvailable);
      toast.success(cs.isAvailable ? "Chapter blocked" : "Chapter unblocked");
      await fetchFaculty();
    } catch (err) {
      handleApiError(err);
    } finally {
      setChapterWorking(false);
    }
  };

  /* ================================================================ */
  /* RENDER                                                             */
  /* ================================================================ */

  if (loading) {
    const pulse = "animate-pulse bg-gray-200 rounded";
    return (
      <AdminPageContainer>
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className={`${pulse} w-12 h-5`} />
            <div>
              <div className={`${pulse} h-7 w-40 mb-1.5`} />
              <div className={`${pulse} h-4 w-24`} />
            </div>
          </div>
          <div className={`${pulse} h-6 w-16 rounded-full`} />
        </div>

        {/* Basic Info skeleton */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className={`${pulse} h-5 w-36`} />
            <div className={`${pulse} h-9 w-20 rounded-lg`} />
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className={`${pulse} w-20 h-20 sm:w-28 sm:h-28 rounded-xl flex-shrink-0`} />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className={`${pulse} h-3 w-16 mb-2`} />
                    <div className={`${pulse} h-4 w-32`} />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <div className={`${pulse} h-3 w-20 mb-2`} />
                  <div className={`${pulse} h-4 w-full max-w-md`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Time Slots skeleton */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className={`${pulse} h-5 w-28`} />
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            <div className="flex flex-wrap gap-3 mb-2">
              <div className={`${pulse} h-10 w-full sm:w-40 rounded-lg`} />
              <div className={`${pulse} h-10 w-28 rounded-lg`} />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`${pulse} h-5 w-14`} />
                  <div className={`${pulse} h-5 w-16 rounded`} />
                </div>
                <div className={`${pulse} h-8 w-16 rounded-lg`} />
              </div>
            ))}
          </div>
        </section>

        {/* Chapter Slots skeleton */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className={`${pulse} h-5 w-32`} />
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className={`${pulse} h-3 w-14 mb-1.5`} />
                  <div className={`${pulse} h-10 w-full rounded-lg`} />
                </div>
              ))}
              <div className="flex items-end">
                <div className={`${pulse} h-10 w-28 rounded-lg`} />
              </div>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`${pulse} h-5 w-28`} />
                  <div className={`${pulse} h-5 w-16 rounded`} />
                </div>
                <div className={`${pulse} h-8 w-16 rounded-lg`} />
              </div>
            ))}
          </div>
        </section>
      </AdminPageContainer>
    );
  }

  if (!faculty) {
    return (
      <AdminPageContainer>
        <div className="py-20 text-center">
          <p className="text-gray-500 text-lg">Faculty not found</p>
          <button
            onClick={() => navigate("/admin/faculty")}
            className="mt-4 text-sm text-[#DB313E] hover:underline"
          >
             Back to Faculty List
          </button>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      {/* â"€â"€ HEADER â"€â"€ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/faculty")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{faculty.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Faculty Details</p>
          </div>
        </div>
        <span
          className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-medium ${
            faculty.isDeleted
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {faculty.isDeleted ? "Inactive" : "Active"}
        </span>
      </div>

      {/* â"€â"€ BASIC INFO CARD â"€â"€ */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-800">Basic Information</h2>
          <button
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#DB313E] rounded-lg hover:bg-[#c22935] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Image */}
            <img
              src={typeof faculty.image === "object" ? faculty.image.url : faculty.image}
              alt={faculty.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl object-cover border border-gray-200 shadow-sm flex-shrink-0"
            />

            {/* Details */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-4">
              <InfoItem label="Name" value={faculty.name} />
              <InfoItem label="Qualifications" value={faculty.qualifications.join(", ")} />
              <div className="sm:col-span-2">
                <InfoItem label="Description" value={faculty.description} />
              </div>
            </div>
          </div>

          {/* Demo Class Preview */}
          {faculty.demoClass && (() => {
            const videoId = getYoutubeId(faculty.demoClass);
            return (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Demo Class
                </p>
                {videoId ? (
                  <a
                    href={faculty.demoClass}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-block rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt="Demo class thumbnail"
                      className="w-64 h-36 object-cover"
                    />
                    {/* Play button overlay */}
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
                    href={faculty.demoClass}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#DB313E] hover:underline"
                  >
                    {faculty.demoClass}
                  </a>
                )}
              </div>
            );
          })()}

          {/* Subjects */}
          {faculty.subjectOffering.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Subject Offerings
              </p>
              <div className="flex flex-wrap gap-2">
                {faculty.subjectOffering.map((so) => (
                  <span
                    key={so.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[#DB313E]/8 text-[#DB313E] border border-[#DB313E]/15"
                  >
                    {so.subject.name}
                    <span className="text-gray-500">{so.class.name}</span>
                    <span className="text-gray-500">{so.syllabus.name}</span>
                    <span className="ml-1 px-1.5 py-0.5 rounded bg-white border border-[#DB313E]/20 text-gray-700 font-semibold">
                      {String.fromCharCode(8377)}{so.price}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* â"€â"€ TIME SLOTS CARD â"€â"€ */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-800">
            Time Slots
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({faculty.slots.length} total)
            </span>
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          {faculty.subjectOffering.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              No subject offerings added yet
            </p>
          ) : (
            <>
              {/* Variant selector — pick which subject's slots to view */}
              <div className="flex flex-wrap gap-2 mb-5">
                {faculty.subjectOffering.map((so) => {
                  const count = faculty.slots.filter((s) => s.variantId === so.id).length;
                  const isSelected = selectedSlotVariantId === so.id;
                  return (
                    <button
                      key={so.id}
                      onClick={() => {
                        setSelectedSlotVariantId(so.id);
                        setSlotError("");
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected
                          ? "bg-[#DB313E] text-white border-[#DB313E]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {so.subject.name} · {so.class.name} · {so.syllabus.name}
                      <span className={isSelected ? "ml-1.5 text-white/80" : "ml-1.5 text-gray-400"}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Add slot row — adds to the selected variant */}
              <div className="mb-5">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">Time</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => {
                        setNewTime(e.target.value);
                        setSlotError("");
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 w-full sm:w-40"
                    />
                  </div>
                  <button
                    onClick={handleAddTimeSlot}
                    disabled={!newTime || !selectedSlotVariantId || slotWorking}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#DB313E] rounded-lg hover:bg-[#c22935] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {slotWorking ? "Adding…" : "+ Add Slot"}
                  </button>
                </div>
                {slotError && (
                  <p className="text-xs text-red-500 mt-1.5">{slotError}</p>
                )}
              </div>

              {/* Slot list — filtered to the selected variant */}
              {(() => {
                const filteredSlots = faculty.slots.filter(
                  (s) => s.variantId === selectedSlotVariantId
                );
                const selectedOffering = faculty.subjectOffering.find(
                  (so) => so.id === selectedSlotVariantId
                );

                if (filteredSlots.length === 0) {
                  return (
                    <p className="text-sm text-gray-400 text-center py-6">
                      No time slots added yet for this subject
                    </p>
                  );
                }

                return (
                  <div className="space-y-2">
                    {filteredSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg border transition-colors ${
                          slot.isAvailable
                            ? "bg-white border-gray-200 hover:border-gray-300"
                            : "bg-gray-50 border-gray-200 opacity-70"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <span className="text-sm font-mono font-semibold text-gray-800">
                            {formatTimeAMPM(slot.time)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              slot.isAvailable
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {slot.isAvailable ? "Available" : "Blocked"}
                          </span>
                          {slot.pool.length > 0 && (
                            <span className="text-xs text-gray-400">
                              {slot.pool.length}/{slot.poolLimit} booked
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {slot.pool.length > 0 && (
                            <button
                              onClick={() =>
                                setSelectedPoolBooking({
                                  faculty: { id: faculty.id, name: faculty.name },
                                  mode: "slot",
                                  class: selectedOffering?.class ?? { id: "", name: "" },
                                  syllabus: selectedOffering?.syllabus ?? { id: "", name: "" },
                                  slot: { id: slot.id, time: slot.time },
                                  totalStudents: slot.pool.length,
                                  hasPendingContact: false,
                                  createdAt: "",
                                })
                              }
                              className="px-3 py-1.5 text-xs font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                            >
                              View Pool
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleSlot(slot)}
                            disabled={slotWorking || (slot.isAvailable && slot.pool.length > 0)}
                            title={
                              slot.isAvailable && slot.pool.length > 0
                                ? "Cannot block — has active bookings"
                                : ""
                            }
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                              slot.isAvailable
                                ? "text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
                                : "text-green-600 bg-green-50 hover:bg-green-100 border border-green-200"
                            }`}
                          >
                            {slot.isAvailable ? "Block" : "Unblock"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </section>

      {/* â"€â"€ CHAPTER SLOTS CARD â"€â"€ */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-800">
            Chapter Slots
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({faculty.chapterSlots.length} total)
            </span>
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          {/* Add chapter row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Syllabus</label>
              <select
                value={chapterSyllabusId}
                onChange={(e) => {
                  setChapterSyllabusId(e.target.value);
                  setChapterClassId("");
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-full"
              >
                <option value="">Select</option>
                {syllabusList.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Class</label>
              <select
                value={chapterClassId}
                onChange={(e) => setChapterClassId(e.target.value)}
                disabled={!chapterSyllabusId}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-full disabled:bg-gray-100"
              >
                <option value="">{chapterSyllabusId ? "Select" : "Pick syllabus"}</option>
                {classesList.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Chapter</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                disabled={!chapterClassId}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-full disabled:bg-gray-100"
              >
                <option value="">
                  {!chapterClassId
                    ? "Pick class first"
                    : chapterOptions.length === 0
                      ? "No chapters found"
                      : "Select chapter"}
                </option>
                {chapterOptions.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddChapterSlot}
              disabled={!chapterId || chapterWorking}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#DB313E] rounded-lg hover:bg-[#c22935] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {chapterWorking ? "Adding" : "+ Add Chapter"}
            </button>
          </div>

          {/* Chapter slot list */}
          {faculty.chapterSlots.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No chapter slots added yet</p>
          ) : (
            <div className="space-y-2">
              {faculty.chapterSlots.map((cs) => {
                const chapterName =
                  typeof cs.chapter === "object" ? cs.chapter.name : cs.chapter;
                const chapterKey =
                  typeof cs.chapter === "object" ? cs.chapter.id : cs.chapter;

                return (
                  <div
                    key={chapterKey}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg border transition-colors ${
                      cs.isAvailable
                        ? "bg-white border-gray-200 hover:border-gray-300"
                        : "bg-gray-50 border-gray-200 opacity-70"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className="text-sm font-medium text-gray-800">{chapterName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          cs.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {cs.isAvailable ? "Available" : "Blocked"}
                      </span>
                      {cs.pool?.length > 0 && (
                        <span className="text-xs text-gray-400">
                          {cs.pool.length} booked
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {cs.pool?.length > 0 && (
                        <button
                          onClick={() => {
                            const chapterObj =
                              typeof cs.chapter === "object"
                                ? cs.chapter
                                : { id: cs.chapter, name: cs.chapter };
                            setSelectedPoolBooking({
                              faculty: { id: faculty.id, name: faculty.name },
                              mode: "chapter",
                              class: faculty.subjectOffering[0]?.class ?? { id: "", name: "" },
                              syllabus: faculty.subjectOffering[0]?.syllabus ?? { id: "", name: "" },
                              chapter: chapterObj,
                              totalStudents: cs.pool.length,
                              hasPendingContact: false,
                              createdAt: "",
                            });
                          }}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                        >
                          View Pool
                        </button>
                      )}

                    <button
                      onClick={() => handleToggleChapterSlot(cs)}
                      disabled={chapterWorking || (cs.isAvailable && cs.pool?.length > 0)}
                      title={
                        cs.isAvailable && cs.pool?.length > 0
                          ? "Cannot block has active bookings"
                          : ""
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        cs.isAvailable
                          ? "text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
                          : "text-green-600 bg-green-50 hover:bg-green-100 border border-green-200"
                      }`}
                    >
                      {cs.isAvailable ? "Block" : "Unblock"}
                    </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* â"€â"€ EDIT BASIC INFO MODAL â"€â"€ */}
      {editOpen && (
        <EditFacultyBasicModal
          open={editOpen}
          facultyId={faculty.id}
          initialData={faculty}
          syllabuses={syllabusList}
          classes={classesList}
          onClose={() => setEditOpen(false)}
          onSuccess={() => {
            setEditOpen(false);
            fetchFaculty();
          }}
        />
      )}

      {/* â"€â"€ POOL BOOKING MODAL â"€â"€ */}
      <PoolBookingModal
        booking={selectedPoolBooking}
        onClose={() => {
          setSelectedPoolBooking(null);
          fetchFaculty();
        }}
        onConfirmed={() => {
          setSelectedPoolBooking(null);
          fetchFaculty();
        }}
      />
    </AdminPageContainer>
  );
}

/* ================================================================== */
/* SMALL HELPER COMPONENT                                               */
/* ================================================================== */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="text-sm text-gray-800">{value || ""}</div>
    </div>
  );
}
