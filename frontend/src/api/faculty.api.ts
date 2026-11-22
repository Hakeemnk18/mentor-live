import { timeStringToISOSlot } from "../features/admin/components/FacultyModal";
import axiosInstance from "./axios.instance";

import type {
  CreateFacultyPayload,
  UpdateFacultyPayload,
  FacultyListParams,
  FacultyListItem,
  FacultyByChapterParams,
  FeaturedFaculty,
} from "../shared/types/faculty.types";

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

/**
 * Fetch the dedicated featured-faculty list for the landing page.
 * Returns at most 8 active faculty marked as `isFeatured`.
 */
export const getFeaturedFaculty = async (): Promise<FeaturedFaculty[]> => {
  const res = await axiosInstance.get("/faculties/featured");
  return res.data.data ?? [];
};

export const getFacultiesByChapter = async (
  params: FacultyByChapterParams
): Promise<{ data: FacultyListItem[] }> => {
  const res = await axiosInstance.get("/faculties/list", {
    params: { type: "chapter", ...params },
  });
  return res.data;
};

export const createFaculty = async (payload: CreateFacultyPayload) => {
  const res = await axiosInstance.post("/faculties", payload);
  return res.data;
};

export const updateFaculty = async (
  id: string,
  payload: UpdateFacultyPayload
) => {
  const res = await axiosInstance.put(`/faculties/${id}`, payload);
  return res.data;
};

export const getFacultyById = async (id: string) => {
  const res = await axiosInstance.get(`/faculties/${id}`);
  return res.data.data;
};

/**
 * Fetch faculty profile + first available slot for a subject variant.
 * Used on the user-facing faculty details page (slot mode).
 * variantId is REQUIRED after the per-variant slot refactor.
 */
export const getFacultyBySlot = async (
  facultyId: string,
  variantId: string,
  slotId?: string
) => {
  const res = await axiosInstance.get(`/faculties/${facultyId}/slot`, {
    params: { variantId, ...(slotId ? { slotId } : {}) },
  });
  return res.data.data;
};

/**
 * Public faculty profile — always loadable without a slot or chapter context.
 * Returns basic info + subject offerings filtered by classId+syllabusId.
 */
export const getFacultyPublicProfile = async (
  facultyId: string,
  params: { classId?: string; syllabusId?: string } = {}
) => {
  const res = await axiosInstance.get(`/faculties/${facultyId}/public-profile`, { params });
  return res.data.data as {
    id: string;
    name: string;
    qualifications: string[];
    description: string;
    demoClass: string;
    image: string;
    subjectOffering: {
      variantId: string;
      subjectName: string;
      className: string;
      syllabusName: string;
      price: number;
    }[];
  };
};

/** Fetch faculty details for a specific chapter */
export const getFacultyByChapter = async (
  facultyId: string,
  chapterId: string
) => {
  const res = await axiosInstance.get(`/faculties/${facultyId}/chapter`, {
    params: { chapterId },
  });
  return res.data.data;
};

/**
 * Fetch only available time slots for a faculty + subject variant.
 * variantId is REQUIRED — the backend returns slots scoped to that variant.
 */
export const getFacultyAvailableSlots = async (
  facultyId: string,
  variantId?: string
): Promise<{ id: string; time: string; variantId: string; poolCount: number; poolLimit: number }[]> => {
  const res = await axiosInstance.get(
    `/faculties/${facultyId}/available-slots`,
    { params: { variantId } }
  );
  return res.data.data ?? [];
};

/** Fetch slot details (pool info, etc.) for a specific slot */
export const getFacultySlotDetails = async (
  facultyId: string,
  slotId: string
) => {
  const res = await axiosInstance.get(`/faculties/${facultyId}/slot-details`, {
    params: { slotId },
  });
  return res.data.data;
};

/**
 * Add one time slot for a faculty for a SPECIFIC subject variant.
 * variantId is now required by the backend.
 */
export const addFacultySlotIST = async (
  facultyId: string,
  payload: { time: string; variantId: string }
) => {
  const res = await axiosInstance.post(`/faculties/${facultyId}/slots`, {
    variantId: payload.variantId,
    slots: [timeStringToISOSlot(payload.time)],
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

/** Add several chapters to a faculty in one request (the endpoint accepts a list). */
export const addFacultyChapterSlots = async (facultyId: string, chapterIds: string[]) => {
  const res = await axiosInstance.post(`/faculties/${facultyId}/chapterSlots`, {
    chapterSlots: chapterIds.map((chapter) => ({ chapter })),
  });
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
export const removeFacultyChapterSlot = (
  facultyId: string,
  slotId: string
) => setFacultyChapterSlotAvailability(facultyId, slotId, false);
