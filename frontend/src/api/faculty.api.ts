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
  const res = await axiosInstance.patch(`/faculties/${id}`, payload);
  return res.data;
};

export const getFacultyById = async (id: string) => {
  const res = await axiosInstance.get(`/faculties/${id}`);
  return res.data.data; // assume backend returns { data: faculty }
};

/* ── Time slot ─────────────────────────────── */
export const addFacultySlot = async (
  facultyId: string,
  payload: { time: string }
) => {
  const res = await axiosInstance.post(`/faculties/${facultyId}/slots`, payload);
  return res.data;
};

export const removeFacultySlot = async (facultyId: string, slotId: string) => {
  const res = await axiosInstance.patch(
    `/faculties/${facultyId}/slots/${slotId}`,
    { isAvailable: false }
  );
  return res.data;
};

/* ── Chapter slot ───────────────────────────── */
export const addFacultyChapterSlot = async (
  facultyId: string,
  payload: { chapter: string }
) => {
  const res = await axiosInstance.post(
    `/faculties/${facultyId}/chapter-slots`,
    payload
  );
  return res.data;
};

export const removeFacultyChapterSlot = async (
  facultyId: string,
  slotId: string
) => {
  const res = await axiosInstance.patch(
    `/faculties/${facultyId}/chapter-slots/${slotId}`,
    { isAvailable: false }
  );
  return res.data;
};

