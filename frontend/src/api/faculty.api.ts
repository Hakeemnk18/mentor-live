import { timeStringToISOSlot } from "../features/admin/components/FacultyModal";
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

export type FacultyListParams = {
  syllabusId: string;
  classId: string;
  subjectId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
};

export type FacultyListItem = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  price: number;
  image?: string;
};

export const getFacultiesList = async (
  params: FacultyListParams
): Promise<{ data: FacultyListItem[] }> => {
  const res = await axiosInstance.get("/faculties/list", {
    params: { type: "class", ...params },
  });
  return res.data;
};

export type FacultyByChapterParams = {
  chapterId: string;
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
};

export const getFacultiesByChapter = async (
  params: FacultyByChapterParams
): Promise<{ data: FacultyListItem[] }> => {
  const res = await axiosInstance.get("/faculties/list", {
    params: { type: "chapter", ...params },
  });
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

/** Fetch faculty details for a specific chapter */
export const getFacultyByChapter = async (facultyId: string, chapterId: string) => {
  const res = await axiosInstance.get(`/faculties/${facultyId}/chapter`, {
    params: { chapterId },
  });
  return res.data.data;
};

/** Fetch only available (unbooked) time slots for a faculty — used in booking confirm flows */
export const getFacultyAvailableSlots = async (
  facultyId: string
): Promise<{ id: string; time: string }[]> => {
  const res = await axiosInstance.get(`/faculties/${facultyId}/available-slots`);
  console.log("available slots",res.data.data);
  
  return res.data.data ?? [];
};

/** Fetch slot details (pool info, price, etc.) for a specific slot */
export const getFacultySlotDetails = async (
  facultyId: string,
  slotId: string
) => {
  const res = await axiosInstance.get(`/faculties/${facultyId}/slot-details`, {
    params: { slotId },
  });
  return res.data.data;
};

/* ── Time slot ─────────────────────────────── */
export const  addFacultySlot = async (
  facultyId: string,
  payload: { time: string } // time in "HH:MM" format
) => {
  // Convert "HH:MM" → full ISO date string (backend expects a date object/ISO)
  console.log(payload);
  
  const [h, m] = payload.time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  const res = await axiosInstance.post(`/faculties/${facultyId}/slots`, {
    slots: [{ time: d.toISOString() }],
  });
  return res.data;
};
// faculty.api.ts
export const addFacultySlotIST = async (
  facultyId: string,
  payload: { time: string }
) => {
  const res = await axiosInstance.post(`/faculties/${facultyId}/slots`, {
    slots: [timeStringToISOSlot(payload.time)], // uses the helper with correct IST offset
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

