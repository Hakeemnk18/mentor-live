import type { ExportColumn } from "../../../core/utils/export.util.js";
import type { AdminAllBookingView, AdminBookingView, AdminPoolingView } from "../type/booking.type.js";

const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtTime = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

export const oneToOneBookingExportColumns: ExportColumn<AdminBookingView>[] = [
  { header: "Student Name", value: (b) => b.student.name },
  { header: "Phone", value: (b) => b.student.phone },
  { header: "Faculty", value: (b) => b.faculty.name },
  { header: "Class", value: (b) => b.class.name },
  { header: "Syllabus", value: (b) => b.syllabus.name },
  { header: "Mode", value: (b) => b.mode },
  { header: "Chapter", value: (b) => b.chapter?.name ?? "" },
  { header: "Slot Time", value: (b) => fmtTime(b.slot?.time) },
  { header: "Status", value: (b) => (b.status === "interested" ? "pending" : b.status) },
  { header: "Contacted", value: (b) => (b.isContacted ? "Yes" : "No") },
  { header: "Booked On", value: (b) => fmtDate(b.createdAt) },
];

export const allBookingExportColumns: ExportColumn<AdminAllBookingView>[] = [
  { header: "Type", value: (b) => (b.type === "oneToOne" ? "One-to-One" : "Pooling") },
  { header: "Student Name", value: (b) => b.student.name },
  { header: "Phone", value: (b) => b.student.phone },
  { header: "Faculty", value: (b) => b.faculty.name },
  { header: "Class", value: (b) => b.class.name },
  { header: "Syllabus", value: (b) => b.syllabus.name },
  { header: "Mode", value: (b) => b.mode },
  { header: "Chapter", value: (b) => b.chapter?.name ?? "" },
  { header: "Slot Time", value: (b) => fmtTime(b.slot?.time) },
  { header: "Status", value: (b) => (b.status === "interested" ? "pending" : b.status) },
  { header: "Contacted", value: (b) => (b.isContacted ? "Yes" : "No") },
  { header: "Booked On", value: (b) => fmtDate(b.createdAt) },
];

export const poolingBookingExportColumns: ExportColumn<AdminPoolingView>[] = [
  { header: "Faculty", value: (b) => b.faculty.name },
  { header: "Mode", value: (b) => b.mode },
  { header: "Subject", value: (b) => b.subject?.name ?? "" },
  { header: "Chapter", value: (b) => b.chapter?.name ?? "" },
  { header: "Slot Time", value: (b) => fmtTime(b.slot?.time) },
  { header: "Class", value: (b) => b.class.name },
  { header: "Syllabus", value: (b) => b.syllabus.name },
  { header: "Total Students", value: (b) => b.totalStudents },
  { header: "Pending Contact", value: (b) => (b.hasPendingContact ? "Yes" : "No") },
  { header: "Booked On", value: (b) => fmtDate(b.createdAt) },
];
