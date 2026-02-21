import type { CreateFacultyPayload } from "../shared/types/api.types";
import axiosInstance from "./axios.instance";

export type UpdateFacultyPayload = {
  name?: string;
  qualifications?: string[];
  description?: string;
  demoClass?: string;
  price?: number;
  image?: { url: string; publicId: string };
  subjects?: string[];
};

export const getFaculties = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  syllabusId?: string;
  subjectId?: string;
  isDeleted?: boolean;
}) => {
  const res = await axiosInstance.get("/faculties", { params });
  console.log("fetched faculties ",res);
  
  return res.data;
};
export const createFaculty = async (
  payload: CreateFacultyPayload
) => {
  const res = await axiosInstance.post("/faculties", payload);
  return res.data;
};

export const updateFaculty = async (id: string, payload: UpdateFacultyPayload) => {
  const res = await axiosInstance.put(`/faculties/${id}`, payload);
  return res.data;
};

export const getFacultyById = async (id: string) => {
  const res = await axiosInstance.get(`/faculties/${id}`);
  return res.data.data; // assume backend returns { data: faculty }
};

/** Fetch only available (unbooked) time slots for a faculty — used in booking confirm flows */
export const getFacultyAvailableSlots = async (
  facultyId: string
): Promise<{ id: string; time: string }[]> => {
  const res = await axiosInstance.get(`/faculties/${facultyId}/available-slots`);
  return res.data.data ?? [];
};

/* ── Time slot ─────────────────────────────── */
export const addFacultySlot = async (
  facultyId: string,
  payload: { time: string } // time in "HH:MM" format
) => {
  // Convert "HH:MM" → full ISO date string (backend expects a date object/ISO)
  const [h, m] = payload.time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  const res = await axiosInstance.post(`/faculties/${facultyId}/slots`, {
    slots: [{ time: d.toISOString() }],
  });
  return res.data;
};

export const setFacultySlotAvailability = async (
  facultyId: string,
  slotId: string,
  isAvailable: boolean
) => {
  const res = await axiosInstance.patch(
    `/faculties/${facultyId}/slots/${slotId}`,
    { isAvailable }
  );
  return res.data;
};

/** @deprecated use setFacultySlotAvailability */
export const removeFacultySlot = (facultyId: string, slotId: string) =>
  setFacultySlotAvailability(facultyId, slotId, false);

/* ── Chapter slot ───────────────────────────── */
export const addFacultyChapterSlot = async (
  facultyId: string,
  payload: { chapter: string }
) => {
  const res = await axiosInstance.post(
    `/faculties/${facultyId}/chapterSlots`,
    { chapterSlots: [{ chapter: payload.chapter }] }
  );
  return res.data;
};

export const setFacultyChapterSlotAvailability = async (
  facultyId: string,
  slotId: string,
  isAvailable: boolean
) => {
  const res = await axiosInstance.patch(
    `/faculties/${facultyId}/chapter-slots/${slotId}`,
    { isAvailable }
  );
  return res.data;
};

/** @deprecated use setFacultyChapterSlotAvailability */
export const removeFacultyChapterSlot = (facultyId: string, slotId: string) =>
  setFacultyChapterSlotAvailability(facultyId, slotId, false);

