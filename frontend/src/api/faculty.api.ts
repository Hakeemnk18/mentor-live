import { timeStringToISOSlot } from "../features/admin/components/FacultyModal";
import axiosInstance from "./axios.instance";

import type { CreateFacultyPayload, UpdateFacultyPayload, FacultyListParams, FacultyListItem, FacultyByChapterParams } from "../shared/types/faculty.types";

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

export const getFacultiesList = async (
  params: FacultyListParams
): Promise<{ data: FacultyListItem[] }> => {
  const res = await axiosInstance.get("/faculties/list", {
    params: { type: "class", ...params },
  });
  return res.data;
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

/** Fetch only available (unbooked) time slots for a faculty ” used in booking confirm flows */
export const getFacultyAvailableSlots = async (
  facultyId: string
): Promise<{ id: string; time: string }[]> => {
  const res = await axiosInstance.get(`/faculties/${facultyId}/available-slots`);
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

