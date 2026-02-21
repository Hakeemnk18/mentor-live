import axiosInstance from "./axios.instance";

/* ── Shared filter params ─────────────────────────────── */
export interface BookingFilters {
  search?: string;
  mode?: "chapter" | "slot";
  chapterId?: string;
  slotId?: string;
  faculty?: string;
  classId?: string;
  syllabusId?: string;
  isContacted?: boolean;
  page?: number;
  limit?: number;
}

/* ── One-on-One booking ───────────────────────────────── */
export interface OneOnOneBooking {
  id: string;
  student: { id: string; name: string; phone: string };
  faculty: { id: string; name: string };
  class: { id: string; name: string };
  syllabus: { id: string; name: string };
  isContacted: boolean;
  chapter?: { id: string; name: string };
  slot?: { id: string; time: string };
  mode: "chapter" | "slot";
  status: string;
  createdAt: string;
}

export const getOneOnOneBookings = async (
  filters: BookingFilters = {}
): Promise<{ data: OneOnOneBooking[]; total: number }> => {
  const params: Record<string, any> = {};
  if (filters.search) params.search = filters.search;
  if (filters.mode) params.mode = filters.mode;
  if (filters.chapterId) params.chapterId = filters.chapterId;
  if (filters.slotId) params.slotId = filters.slotId;
  if (filters.faculty) params.faculty = filters.faculty;
  if (filters.classId) params.classId = filters.classId;
  if (filters.syllabusId) params.syllabusId = filters.syllabusId;
  if (filters.isContacted !== undefined) params.isContacted = filters.isContacted;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const res = await axiosInstance.get("/bookings/one-to-one", { params });
  return { data: res.data.data, total: res.data.total };
};

/** Confirm a chapter-mode one-on-one booking by assigning faculty slot IDs */
export const confirmChapterBooking = async (
  bookingId: string,
  slotIds: string[]
): Promise<void> => {
  await axiosInstance.patch(
    `/bookings/one-to-one/chapter/${bookingId}/confirm`,
    { slotId: slotIds }
  );
};

/** Confirm a slot-mode one-on-one booking (no body needed) */
export const confirmSlotBooking = async (bookingId: string): Promise<void> => {
  await axiosInstance.patch(`/bookings/one-to-one/slot/${bookingId}/confirm`);
};

/* ── Pool booking ─────────────────────────────────────── */
export interface PoolBooking {
  faculty: { id: string; name: string };
  mode: "chapter" | "slot";
  class: { id: string; name: string };
  syllabus: { id: string; name: string };
  chapter?: { id: string; name: string };
  slot?: { id: string; time: string };
  totalStudents: number;
  hasPendingContact: boolean;
  createdAt: string;
}

export const getPoolBookings = async (
  filters: BookingFilters = {}
): Promise<{ data: PoolBooking[]; total: number }> => {
  const params: Record<string, any> = {};
  if (filters.search) params.search = filters.search;
  if (filters.mode) params.mode = filters.mode;
  if (filters.chapterId) params.chapterId = filters.chapterId;
  if (filters.slotId) params.slotId = filters.slotId;
  if (filters.faculty) params.faculty = filters.faculty;
  if (filters.classId) params.classId = filters.classId;
  if (filters.syllabusId) params.syllabusId = filters.syllabusId;
  if (filters.isContacted !== undefined) params.isContacted = filters.isContacted;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const res = await axiosInstance.get("/bookings/pooling", { params });
  return { data: res.data.data, total: res.data.total };
};

/* ── Pool booking detail APIs ─────────────────────────── */

export interface PoolStudent {
  id: string;
  name: string;
  isContacted: boolean;
}

export interface PoolStudentsResponse {
  faculty: { id: string; name: string };
  mode: "chapter" | "slot";
  class: { id: string; name: string };
  syllabus: { id: string; name: string };
  chapter?: { id: string; name: string };
  slot?: { id: string; time: string };
  student: PoolStudent[];
}

/** Fetch enrolled students for a pool booking */
export const getPoolStudents = async (params: {
  facultyId: string;
  mode: "chapter" | "slot";
  chapterId?: string;
  slotId?: string;
}): Promise<PoolStudentsResponse | null> => {
  const res = await axiosInstance.get("/bookings/pooling/students", { params });
  const data = res.data.data;
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
};

/** Confirm a slot-mode pool booking */
export const confirmSlotPooling = async (payload: {
  facultyId: string;
  slotId: string;
}): Promise<void> => {
  await axiosInstance.patch("/bookings/pooling/slot/confirm", payload);
};

/** Confirm a chapter-mode pool booking */
export const confirmChapterPooling = async (payload: {
  facultyId: string;
  slotId: string[];
  chapterId: string;
}): Promise<void> => {
  await axiosInstance.patch("/bookings/pooling/chapter/confirm", payload);
};

/** Remove a student from a pool booking */
export const removeStudentFromPool = async (payload: {
  facultyId: string;
  userId: string;
  mode: "chapter" | "slot";
  slotId?: string;
  chapterId?: string;
}): Promise<void> => {
  await axiosInstance.patch("/bookings/pooling/remove-student", payload);
};

