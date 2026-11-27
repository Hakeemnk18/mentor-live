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
import { AdminBadge, AdminButton, AdminContactActions, AdminModal } from "./ui";

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
  <div className="flex flex-col gap-0.5 min-w-0">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A80A3]">{label}</span>
    <span className="text-sm text-[#2A1650] break-words">{value}</span>
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

  const statusLabel =
    booking.status === "interested" ? "Pending" : booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
  const statusTone = booking.status === "confirmed" ? "success" : booking.status === "interested" ? "info" : "neutral";
  const busy = confirming || markingContacted;
  const close = () => {
    if (!busy) onClose();
  };

  return (
    <>
      <AdminModal
        open
        onClose={close}
        size="md"
        zIndex={1000}
        closeOnEsc={!showContactConfirm}
        closeOnBackdrop={!showContactConfirm}
        title="Booking Details"
        description={<span className="capitalize">{booking.mode} booking · One-on-One</span>}
        footer={
          <>
            <AdminButton variant="outline" onClick={close} disabled={busy}>
              Close
            </AdminButton>
            {!booking.isContacted && (
              <AdminButton variant="soft" onClick={() => setShowContactConfirm(true)} loading={markingContacted}>
                {markingContacted ? "Marking…" : "Mark as Contacted"}
              </AdminButton>
            )}
            {!isConfirmed && !readOnly && (
              <AdminButton
                onClick={handleConfirm}
                loading={confirming}
                disabled={booking.mode === "chapter" && !selectedTime}
              >
                {confirming ? "Confirming…" : "Confirm Booking"}
              </AdminButton>
            )}
          </>
        }
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <AdminBadge tone={statusTone}>{statusLabel}</AdminBadge>
            <AdminBadge tone={booking.isContacted ? "success" : "warning"}>
              {booking.isContacted ? "Contacted" : "Not contacted"}
            </AdminBadge>
          </div>

          {/* Student */}
          <div className="rounded-2xl border border-[#E4DDF2] bg-[#FAF8FE] p-4">
            <p className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A80A3]">Student</p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0 space-y-2.5">
                <Detail label="Name" value={booking.student.name} />
                <Detail label="Phone" value={<span className="tabular-nums">{booking.student.phone}</span>} />
              </div>
              <AdminContactActions phone={booking.student.phone} name={booking.student.name} size="md" />
            </div>
          </div>

          {/* Booking info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Detail label="Faculty" value={booking.faculty.name} />
            <Detail label="Class" value={booking.class.name} />
            <Detail label="Syllabus" value={booking.syllabus.name} />
            <Detail label="Mode" value={<span className="capitalize">{booking.mode}</span>} />
            {booking.chapter && <Detail label="Chapter" value={booking.chapter.name} />}
            {booking.slot && <Detail label="Slot" value={formatTimeAMPM(booking.slot.time)} />}
            <Detail label="Booked On" value={fmtDate(booking.createdAt)} />
          </div>

          {/* Slot picker — chapter bookings, hidden for read-only roles */}
          {booking.mode === "chapter" && !isConfirmed && !readOnly && (
            <div>
              <p className="m-0 mb-2 text-xs font-semibold text-[#2A1650]/80">
                Assign a time slot <span className="text-[#FF6B5E]">*</span>
              </p>
              {loadingSlots ? (
                <p className="m-0 text-sm text-[#8A80A3]">Loading slots…</p>
              ) : availableSlots.length === 0 ? (
                <p className="m-0 text-sm text-[#8A80A3]">No available slots for this faculty.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map((s) => {
                    const selected = selectedTime === s.time;
                    return (
                      <button
                        key={s.time}
                        type="button"
                        onClick={() => toggleSlot(s.time)}
                        aria-pressed={selected}
                        className={`h-9 px-3.5 text-sm font-semibold rounded-full border cursor-pointer transition-colors tabular-nums ${
                          selected
                            ? "bg-[#6D35D9] border-[#6D35D9] text-white"
                            : "bg-white border-[#E4DDF2] text-[#2A1650] hover:border-[#6D35D9] hover:text-[#6D35D9]"
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
      </AdminModal>

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
