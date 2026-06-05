import axiosInstance from "./axios.instance";

import type {
  GetSyllabusParams,
  GetSyllabusResult,
  GetSyllabusApiResponse,
} from "../shared/types/syllabus.types";

/** Admin table — full paginated list */
export const getSyllabus = async (
  params: GetSyllabusParams
): Promise<GetSyllabusResult> => {
  const res = await axiosInstance.get<GetSyllabusApiResponse>("/syllabuses", { params });
  const d = res.data;
  return {
    rows: d.data.map((s) => ({ _id: s.id, name: s.name, isDeleted: s.isDeleted })),
    currentPage: d.currentPage,
    totalPages: d.totalPages,
    total: d.total,
  };
};

/** Lightweight dropdown list — only name + id, no pagination */
export const getSyllabusList = async (): Promise<{ _id: string; name: string }[]> => {
  const res = await axiosInstance.get("/syllabuses/list");
  return (res.data.data ?? []).map((s: { id?: string; _id?: string; name: string }) => ({ _id: s.id ?? s._id, name: s.name }));
};

export const createSyllabus = async (payload: { name: string }) => {
  const res = await axiosInstance.post("/syllabuses", payload);
  return res.data;
};

export const updateSyllabus = async (id: string, payload: { name: string }) => {
  const res = await axiosInstance.put(`/syllabuses/${id}`, payload);
  return res.data;
};