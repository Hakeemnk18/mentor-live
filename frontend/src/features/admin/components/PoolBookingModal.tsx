import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { PoolBooking, PoolStudent, PoolStudentsResponse } from "../../../api/booking.api";
import {
  getPoolStudents,
  confirmSlotPooling,
  confirmChapterPooling,
  removeStudentFromPool,
} from "../../../api/booking.api";
import { getFacultyAvailableSlots } from "../../../api/faculty.api";

/* ───── helpers ─────────────────────────────────────────── */
const fmtTime = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm text-gray-800">{value}</span>
  </div>
);

/* ───── types ───────────────────────────────────────────── */
interface AvailableSlot { id: string; time: string; }

interface Props {
  booking: PoolBooking | null;
  onClose: () => void;
  onConfirmed: () => void;
}

/* ───── component ───────────────────────────────────────── */
export default function PoolBookingModal({ booking, onClose, onConfirmed }: Props) {
  const [detail, setDetail] = useState<PoolStudentsResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // For chapter-mode: pick time slots from faculty
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [confirming, setConfirming] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  /* ── fetch students + faculty slots on open ── */
  useEffect(() => {
    if (!booking) return;

    // 1. Fetch student list
    setLoadingDetail(true);
    setDetail(null);
    setSelectedSlotId(null);
    const params: Parameters<typeof getPoolStudents>[0] = {
      facultyId: booking.faculty.id,
      mode: booking.mode,
      ...(booking.mode === "chapter" && booking.chapter
        ? { chapterId: booking.chapter.id }
        : { slotId: booking.slot?.id }),
    };
    getPoolStudents(params)
      .then(setDetail)
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setLoadingDetail(false));

    // 2. For chapter mode also fetch faculty time slots for confirm
    if (booking.mode === "chapter") {
      setLoadingSlots(true);
      getFacultyAvailableSlots(booking.faculty.id)
        .then((raw) => {
          setAvailableSlots(
            raw.map((s) => ({
              id: s.id,
              time: fmtTime(s.time),
            }))
          );
        })
        .catch(() => toast.error("Failed to load faculty slots"))
        .finally(() => setLoadingSlots(false));
    }
  }, [booking?.faculty.id, booking?.mode, booking?.chapter?.id, booking?.slot?.id]);

  if (!booking) return null;

  const toggleSlot = (id: string) =>
    setSelectedSlotId((prev) => (prev === id ? null : id));

  /* ── confirm ── */
  const handleConfirm = async () => {
    if (booking.mode === "chapter" && !selectedSlotId) {
      toast.error("Select a time slot");
      return;
    }
    try {
      setConfirming(true);
      if (booking.mode === "slot") {
        await confirmSlotPooling({
          facultyId: booking.faculty.id,
          slotId: booking.slot!.id,
        });
      } else {
        await confirmChapterPooling({
          facultyId: booking.faculty.id,
          slotId: [selectedSlotId!],
          chapterId: booking.chapter!.id,
        });
      }
      toast.success("Pool booking confirmed");
      onConfirmed();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to confirm");
    } finally {
      setConfirming(false);
    }
  };

  /* ── remove student ── */
  const handleRemove = async (student: PoolStudent) => {
    try {
      setRemovingId(student.id);
      await removeStudentFromPool({
        facultyId: booking.faculty.id,
        userId: student.id,
        mode: booking.mode,
        ...(booking.mode === "slot"
          ? { slotId: booking.slot!.id }
          : { chapterId: booking.chapter!.id }),
      });
      toast.success(`${student.name} removed`);
      // update local list
      setDetail((prev) =>
        prev
          ? { ...prev, student: prev.student.filter((s) => s.id !== student.id) }
          : prev
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove student");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[1000]" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Panel */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto relative w-full max-w-xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Pool Booking</h2>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{booking.mode} mode</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Booking info */}
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Faculty" value={booking.faculty.name} />
              <Detail label="Class" value={booking.class.name} />
              <Detail label="Syllabus" value={booking.syllabus.name} />
              <Detail label="Mode" value={booking.mode} />
              {booking.chapter && <Detail label="Chapter" value={booking.chapter.name} />}
              {booking.slot && <Detail label="Slot" value={fmtTime(booking.slot.time)} />}
              <Detail label="Total Students" value={booking.totalStudents} />
              <Detail label="Booked On" value={fmtDate(booking.createdAt)} />
              <Detail
                label="Pending Contact"
                value={
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    booking.hasPendingContact ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                  }`}>
                    {booking.hasPendingContact ? "Yes" : "No"}
                  </span>
                }
              />
            </div>

            {/* Students list */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Enrolled Students
              </p>
              {loadingDetail ? (
                <p className="text-sm text-gray-400">Loading students…</p>
              ) : !detail || detail.student.length === 0 ? (
                <p className="text-sm text-gray-400">No students found.</p>
              ) : (
                <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                  {detail.student.map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{s.name}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            s.isContacted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {s.isContacted ? "Contacted" : "Not Contacted"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(s)}
                        disabled={removingId === s.id}
                        className="text-xs px-2.5 py-1 text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors"
                      >
                        {removingId === s.id ? "Removing…" : "Remove"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slot picker — chapter mode confirm */}
            {booking.mode === "chapter" && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Assign Time Slot(s) to Confirm
                </p>
                {loadingSlots ? (
                  <p className="text-sm text-gray-400">Loading slots…</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-gray-400">No available slots for this faculty.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((s) => {
                      const selected = selectedSlotId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleSlot(s.id)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            selected
                              ? "bg-[#DB313E] border-[#DB313E] text-white"
                              : "border-gray-300 text-gray-700 hover:border-[#DB313E] hover:text-[#DB313E]"
                          }`}
                        >
                          {s.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleConfirm}
              disabled={
                confirming ||
                (booking.mode === "chapter" && !selectedSlotId)
              }
              className="px-4 py-2 text-sm font-medium bg-[#DB313E] text-white rounded-md hover:bg-[#c02535] disabled:opacity-50 transition-colors"
            >
              {confirming ? "Confirming…" : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
