import axiosInstance from "./axios.instance";

import type { CreateBookingPayload, BookingFilters, OneOnOneBooking, PoolBooking, PoolStudentsResponse } from "../shared/types/booking.types";

export const createBooking = async (payload: CreateBookingPayload) => {
  try {
    const res = await axiosInstance.post("/bookings", payload);
    return res.data;
  } catch (err: unknown) {
    // Re-throw with the server's error body so the modal can parse it
    const e = err as { response?: { data?: unknown } };
    if (e.response?.data) throw e.response.data;
    throw err;
  }
};


/** Builds the shared query params used by both list and export endpoints */
const buildBookingFilterParams = (
  filters: BookingFilters = {}
): Record<string, string | number | boolean> => {
  const params: Record<string, string | number | boolean> = {};
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
  return params;
};

export const getOneOnOneBookings = async (
  filters: BookingFilters = {}
): Promise<{ data: OneOnOneBooking[]; total: number }> => {
  const params = buildBookingFilterParams(filters);

  const res = await axiosInstance.get("/bookings/one-to-one", { params });
  return { data: res.data.data, total: res.data.total };
};

/** Export one-on-one bookings matching the given filters (all rows, no pagination) */
export const exportOneOnOneBookings = async (
  filters: BookingFilters = {}
): Promise<Blob> => {
  const params = buildBookingFilterParams(filters);
  const res = await axiosInstance.get("/bookings/one-to-one/export", {
    params,
    responseType: "blob",
  });
  return res.data;
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

/** Mark a one-on-one booking as contacted */
export const markBookingContacted = async (bookingId: string): Promise<void> => {
  await axiosInstance.patch(`/bookings/one-to-one/${bookingId}/contact`);
};


export const getPoolBookings = async (
  filters: BookingFilters = {}
): Promise<{ data: PoolBooking[]; total: number }> => {
  const params = buildBookingFilterParams(filters);

  const res = await axiosInstance.get("/bookings/pooling", { params });
  return { data: res.data.data, total: res.data.total };
};

/** Export pooling bookings matching the given filters (all rows, no pagination) */
export const exportPoolBookings = async (
  filters: BookingFilters = {}
): Promise<Blob> => {
  const params = buildBookingFilterParams(filters);
  const res = await axiosInstance.get("/bookings/pooling/export", {
    params,
    responseType: "blob",
  });
  return res.data;
};



/** Fetch enrolled students for a pool booking */
export const getPoolStudents = async (params: {
  facultyId: string;
  mode: "chapter" | "slot";
  chapterId?: string;
  slotId?: string;
  poolCycle?: number;
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

