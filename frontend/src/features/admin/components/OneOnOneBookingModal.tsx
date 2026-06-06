import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatTimeAMPM } from "../../../shared/utils/time.utils";
import {
  confirmChapterBooking,
  confirmSlotBooking,
} from "../../../api/booking.api";
import { getFacultyAvailableSlots } from "../../../api/faculty.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { OneOnOneBooking, AvailableSlot } from "../../../shared/types/booking.types";
/* ───── helpers ─────────────────────────────────────────── */
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
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [confirming, setConfirming] = useState(false);

  /* fetch all available faculty slots when a chapter booking opens
     (chapter bookings don't scope to a variant, so we show all slots) */
  useEffect(() => {
    if (!booking || booking.mode !== "chapter") return;
    setSelectedSlotId(null);
    setLoadingSlots(true);
    // no variantId → returns all available slots across all variants
    getFacultyAvailableSlots(booking.faculty.id)
      .then((raw) => {
        setAvailableSlots(
          raw.map((s) => {
            const d = new Date(s.time);
            return {
              id: s.id,
              time: !isNaN(d.getTime())
                ? d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
                : String(s.time),
            };
          })
        );
      })
      .catch(handleApiError)
      .finally(() => setLoadingSlots(false));
  }, [booking]);

  if (!booking) return null;

  const isConfirmed = booking.status === "confirmed";

  /* toggle slot selection */
  const toggleSlot = (id: string) =>
    setSelectedSlotId((prev) => (prev === id ? null : id));

  /* confirm handler */
  const handleConfirm = async () => {
    if (booking.mode === "chapter" && !selectedSlotId) {
      toast.error("Please select a time slot");
      return;
    }
    try {
      setConfirming(true);
      if (booking.mode === "chapter") {
        await confirmChapterBooking(booking.id, [selectedSlotId!]);
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
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#DB313E] text-white rounded-md hover:bg-[#c02535] transition-colors"
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
            {!isConfirmed && !readOnly && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
