import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatTimeAMPM } from "../../../shared/utils/time.utils";
import {
  confirmChapterBooking,
  confirmSlotBooking,
  markBookingContacted,
} from "../../../api/booking.api";
import { getFacultyAvailableSlots } from "../../../api/faculty.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import ConfirmModal from "./ConfirmModal";

import type { OneOnOneBooking } from "../../../shared/types/booking.types";
/* ───── helpers ─────────────────────────────────────────── */

/** A group of FacultySlot ids that share the same displayed time
 *  (e.g. two subject variants both have a 4:00 PM slot). */
interface GroupedSlot {
  time: string;
  ids: string[];
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm text-gray-800">{value}</span>
  </div>
);

/* ───── types ───────────────────────────────────────────── */
interface Props {
  booking: OneOnOneBooking | null;
  onClose: () => void;
  onConfirmed: () => void;
  readOnly?: boolean;
}

/* ───── component ───────────────────────────────────────── */
export default function OneOnOneBookingModal({ booking, onClose, onConfirmed, readOnly = false }: Props) {
  const [availableSlots, setAvailableSlots] = useState<GroupedSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [markingContacted, setMarkingContacted] = useState(false);
  const [showContactConfirm, setShowContactConfirm] = useState(false);

  /* fetch all available faculty slots when a chapter booking opens
     (chapter bookings don't scope to a variant, so we show all slots) */
  useEffect(() => {
    if (!booking || booking.mode !== "chapter") return;
    setSelectedTime(null);
    setLoadingSlots(true);
    // no variantId → returns all available slots across all variants
    getFacultyAvailableSlots(booking.faculty.id)
      .then((raw) => {
        // Group slots by displayed time so identical times across
        // different subject variants render as a single option.
        const groups = new Map<string, string[]>();
        raw.forEach((s) => {
          const d = new Date(s.time);
          const time = !isNaN(d.getTime())
            ? d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" })
            : String(s.time);
          const ids = groups.get(time);
          if (ids) ids.push(s.id);
          else groups.set(time, [s.id]);
        });
        setAvailableSlots(Array.from(groups, ([time, ids]) => ({ time, ids })));
      })
      .catch(handleApiError)
      .finally(() => setLoadingSlots(false));
  }, [booking]);

  if (!booking) return null;

  const isConfirmed = booking.status === "confirmed";

  /* toggle slot selection */
  const toggleSlot = (time: string) =>
    setSelectedTime((prev) => (prev === time ? null : time));

  /* confirm handler */
  const handleConfirm = async () => {
    if (booking.mode === "chapter" && !selectedTime) {
      toast.error("Please select a time slot");
      return;
    }
    try {
      setConfirming(true);
      if (booking.mode === "chapter") {
        const slotIds = availableSlots.find((s) => s.time === selectedTime)?.ids ?? [];
        await confirmChapterBooking(booking.id, slotIds);
      } else {
        await confirmSlotBooking(booking.id);
      }
      toast.success("Booking confirmed");
      onConfirmed();
      onClose();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setConfirming(false);
    }
  };

  /* mark booking as contacted */
  const handleMarkContacted = async () => {
    try {
      setMarkingContacted(true);
      await markBookingContacted(booking.id);
      toast.success("Booking marked as contacted");
      setShowContactConfirm(false);
      onConfirmed();
      onClose();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setMarkingContacted(false);
    }
  };

  /* contact via phone */
  const handleContact = () => {
    window.open(`tel:${booking.student.phone}`, "_self");
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(booking.student.phone).then(() =>
      toast.success("Phone number copied")
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-1000 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Panel */}
      <div className="fixed inset-0 z-1001 flex items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Booking Details
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                {booking.mode} booking
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "interested"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {booking.status === "interested"
                  ? "Pending"
                  : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.isContacted
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {booking.isContacted ? "Contacted" : "Not Contacted"}
              </span>
            </div>

            {/* Student section */}
            <div className="rounded-lg border border-gray-200 p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Student
              </p>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Detail label="Name" value={booking.student.name} />
                  <Detail label="Phone" value={booking.student.phone} />
                </div>
                {/* Contact buttons */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={handleContact}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#6D35D9] text-white rounded-md hover:bg-[#5B2BC0] transition-colors"
                  >
                    📞 Call
                  </button>
                  <button
                    onClick={copyPhone}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Booking info */}
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Faculty" value={booking.faculty.name} />
              <Detail label="Class" value={booking.class.name} />
              <Detail label="Syllabus" value={booking.syllabus.name} />
              <Detail label="Mode" value={booking.mode} />
              {booking.chapter && (
                <Detail label="Chapter" value={booking.chapter.name} />
              )}
              {booking.slot && (
                <Detail label="Slot" value={formatTimeAMPM(booking.slot.time)} />
              )}
              <Detail label="Booked On" value={fmtDate(booking.createdAt)} />
            </div>

            {/* Slot picker — chapter mode only, hidden for read-only roles */}
            {booking.mode === "chapter" && !isConfirmed && !readOnly && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Assign Time Slot(s)
                </p>
                {loadingSlots ? (
                  <p className="text-sm text-gray-400">Loading slots…</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No available slots for this faculty.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((s) => {
                      const selected = selectedTime === s.time;
                      return (
                        <button
                          key={s.time}
                          type="button"
                          onClick={() => toggleSlot(s.time)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            selected
                              ? "bg-[#6D35D9] border-[#6D35D9] text-white"
                              : "border-gray-300 text-gray-700 hover:border-[#6D35D9] hover:text-[#6D35D9]"
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
            {!booking.isContacted && (
              <button
                onClick={() => setShowContactConfirm(true)}
                disabled={markingContacted}
                className="px-4 py-2 text-sm font-medium border border-[#6D35D9] text-[#6D35D9] rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                {markingContacted ? "Marking…" : "Mark as Contacted"}
              </button>
            )}
            {!isConfirmed && !readOnly && (
              <button
                onClick={handleConfirm}
                disabled={
                  confirming ||
                  (booking.mode === "chapter" && !selectedTime)
                }
                className="px-4 py-2 text-sm font-medium bg-[#6D35D9] text-white rounded-md hover:bg-[#5B2BC0] disabled:opacity-50 transition-colors"
              >
                {confirming ? "Confirming…" : "Confirm Booking"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm mark-as-contacted */}
      <ConfirmModal
        open={showContactConfirm}
        title="Mark as Contacted"
        message="Mark this booking as contacted? This action cannot be undone."
        confirmLabel="Mark as Contacted"
        confirmVariant="warning"
        loading={markingContacted}
        onConfirm={handleMarkContacted}
        onClose={() => setShowContactConfirm(false)}
      />
    </>
  );
}
