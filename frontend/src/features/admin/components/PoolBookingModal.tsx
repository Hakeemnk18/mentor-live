import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getPoolStudents,
  confirmSlotPooling,
  confirmChapterPooling,
  removeStudentFromPool,
} from "../../../api/booking.api";
import { getFacultyAvailableSlots } from "../../../api/faculty.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import ConfirmModal from "./ConfirmModal";
import { AdminBadge, AdminButton, AdminContactActions, AdminModal } from "./ui";

import type { PoolBooking, PoolStudent, PoolStudentsResponse } from "../../../shared/types/booking.types";
/* ───── helpers ─────────────────────────────────────────── */
const fmtTime = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" });
};

/** A group of FacultySlot ids that share the same displayed time
 *  (e.g. two subject variants both have a 4:00 PM slot). */
interface GroupedSlot {
  time: string;
  ids: string[];
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A80A3]">{label}</span>
    <span className="text-sm text-[#2A1650] break-words">{value}</span>
  </div>
);

/* ───── types ───────────────────────────────────────────── */
interface Props {
  booking: PoolBooking | null;
  onClose: () => void;
  onConfirmed: () => void;
  readOnly?: boolean;
}

/* ───── component ───────────────────────────────────────── */
export default function PoolBookingModal({ booking, onClose, onConfirmed, readOnly = false }: Props) {
  const [detail, setDetail] = useState<PoolStudentsResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // For chapter-mode: pick time slots from faculty, grouped by displayed time
  // (multiple subject variants can each have a FacultySlot at the same time)
  const [availableSlots, setAvailableSlots] = useState<GroupedSlot[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [confirming, setConfirming] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<PoolStudent | null>(null);

  /* ── fetch students + faculty slots on open ── */
  useEffect(() => {
    if (!booking) return;

    // 1. Fetch student list
    setLoadingDetail(true);
    setDetail(null);
    setSelectedTimes([]);
    const params: Parameters<typeof getPoolStudents>[0] = {
      facultyId: booking.faculty.id,
      mode: booking.mode,
      poolCycle: booking.poolCycle,
      ...(booking.mode === "chapter" && booking.chapter
        ? { chapterId: booking.chapter.id }
        : { slotId: booking.slot?.id }),
    };
    getPoolStudents(params)
      .then(setDetail)
      .catch(handleApiError)
      .finally(() => setLoadingDetail(false));

    // 2. For chapter mode also fetch all faculty time slots for confirm
    //    (no variantId — returns all slots across variants)
    if (booking.mode === "chapter") {
      setLoadingSlots(true);
      getFacultyAvailableSlots(booking.faculty.id)
        .then((raw) => {
          // Group slots by displayed time so identical times across
          // different subject variants render as a single option.
          const groups = new Map<string, string[]>();
          raw.forEach((s) => {
            const time = fmtTime(s.time);
            const ids = groups.get(time);
            if (ids) ids.push(s.id);
            else groups.set(time, [s.id]);
          });
          setAvailableSlots(
            Array.from(groups, ([time, ids]) => ({ time, ids }))
          );
        })
        .catch(handleApiError)
        .finally(() => setLoadingSlots(false));
    }
  }, [booking]);

  if (!booking) return null;

  const isConfirmed = detail?.status === "confirmed";

  const toggleSlot = (time: string) =>
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );

  /* ── confirm ── */
  const handleConfirm = async () => {
    if (booking.mode === "chapter" && selectedTimes.length === 0) {
      toast.error("Select at least one time slot");
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
        const slotIds = availableSlots
          .filter((s) => selectedTimes.includes(s.time))
          .flatMap((s) => s.ids);
        await confirmChapterPooling({
          facultyId: booking.faculty.id,
          slotId: slotIds,
          chapterId: booking.chapter!.id,
        });
      }
      toast.success("Pool booking confirmed");
      onConfirmed();
      onClose();
    } catch (err) {
      handleApiError(err);
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
          ? { ...prev, students: prev.students.filter((s) => s.id !== student.id) }
          : prev
      );
    } catch (err) {
      handleApiError(err);
    } finally {
      setRemovingId(null);
      setRemoveTarget(null);
    }
  };

  const busy = confirming || !!removingId;
  const close = () => {
    if (!busy) onClose();
  };

  return (
    <>
      <AdminModal
        open
        onClose={close}
        size="lg"
        zIndex={1000}
        closeOnEsc={!removeTarget}
        closeOnBackdrop={!removeTarget}
        title={
          <span className="flex flex-wrap items-center gap-2">
            Pool Booking
            {isConfirmed && <AdminBadge tone="success">Confirmed</AdminBadge>}
          </span>
        }
        description={<span className="capitalize">{booking.mode} mode</span>}
        footer={
          <>
            <AdminButton variant="outline" onClick={close} disabled={busy}>
              Close
            </AdminButton>
            {!readOnly && !isConfirmed && (
              <AdminButton
                onClick={handleConfirm}
                loading={confirming}
                disabled={booking.mode === "chapter" && selectedTimes.length === 0}
              >
                {confirming ? "Confirming…" : "Confirm Booking"}
              </AdminButton>
            )}
          </>
        }
      >
        <div className="space-y-5">
          {/* Booking info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4">
            <Detail label="Faculty" value={booking.faculty.name} />
            <Detail label="Class" value={booking.class.name} />
            <Detail label="Syllabus" value={booking.syllabus.name} />
            <Detail label="Mode" value={<span className="capitalize">{booking.mode}</span>} />
            {booking.chapter && <Detail label="Chapter" value={booking.chapter.name} />}
            {booking.slot && <Detail label="Slot" value={fmtTime(booking.slot.time)} />}
            <Detail label="Total Students" value={<span className="tabular-nums">{booking.totalStudents}</span>} />
            <Detail label="Booked On" value={fmtDate(booking.createdAt)} />
            <Detail
              label="Pending Contact"
              value={
                <AdminBadge tone={booking.hasPendingContact ? "warning" : "success"}>
                  {booking.hasPendingContact ? "Yes" : "No"}
                </AdminBadge>
              }
            />
          </div>

          {/* Students */}
          <div>
            <p className="m-0 mb-2 text-xs font-semibold text-[#2A1650]/80">Enrolled students</p>
            {loadingDetail ? (
              <p className="m-0 text-sm text-[#8A80A3]">Loading students…</p>
            ) : !detail || !detail.students || detail.students.length === 0 ? (
              <p className="m-0 text-sm text-[#8A80A3]">No students found.</p>
            ) : (
              <ul className="m-0 p-0 list-none rounded-2xl border border-[#E4DDF2] overflow-hidden divide-y divide-[#EFE9FA]">
                {detail.students.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-3.5 sm:px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-[#F4F1FA] text-[#6D35D9] flex items-center justify-center text-sm font-bold">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="m-0 text-sm font-semibold text-[#2A1650] truncate">{s.name}</p>
                        <p className="m-0 text-xs text-[#8A80A3] tabular-nums">{s.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <AdminBadge tone={s.isContacted ? "success" : "warning"}>
                        {s.isContacted ? "Contacted" : "Not contacted"}
                      </AdminBadge>
                      <AdminContactActions phone={s.phone} name={s.name} />
                      {!isConfirmed && !readOnly && (
                        <button
                          type="button"
                          onClick={() => setRemoveTarget(s)}
                          disabled={removingId === s.id}
                          className="h-8 px-3 rounded-full text-xs font-semibold text-[#C8372D] border border-[#FFCBC4] bg-white cursor-pointer hover:bg-[#FFE3DF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {removingId === s.id ? "Removing…" : "Remove"}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Slot picker — chapter mode confirm, hidden for read-only roles */}
          {booking.mode === "chapter" && !readOnly && !isConfirmed && (
            <div>
              <p className="m-0 mb-2 text-xs font-semibold text-[#2A1650]/80">
                Assign time slot(s) to confirm <span className="text-[#FF6B5E]">*</span>
              </p>
              {loadingSlots ? (
                <p className="m-0 text-sm text-[#8A80A3]">Loading slots…</p>
              ) : availableSlots.length === 0 ? (
                <p className="m-0 text-sm text-[#8A80A3]">No available slots for this faculty.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map((s) => {
                    const selected = selectedTimes.includes(s.time);
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

      <ConfirmModal
        open={!!removeTarget}
        title="Remove Student"
        message={`Are you sure you want to remove ${removeTarget?.name} from this pool?`}
        confirmLabel="Remove"
        confirmVariant="danger"
        loading={removingId === removeTarget?.id}
        onConfirm={() => removeTarget && handleRemove(removeTarget)}
        onClose={() => setRemoveTarget(null)}
      />
    </>
  );
}
