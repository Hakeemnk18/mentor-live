import axiosInstance from "./axios.instance";

import type { Student, GetStudentsParams, GetStudentsResult } from "../shared/types/student.types";
export const getStudents = async (
  params: GetStudentsParams
): Promise<GetStudentsResult> => {
  const res = await axiosInstance.get("/students", { params });
  const d = res.data;
  return {
    data: d.data ?? [],
    total: d.total ?? 0,
    currentPage: d.currentPage ?? 1,
    totalPages: d.totalPages ?? 1,
  };
};

export const blockStudent = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/students/${id}/block`);
};

export const unblockStudent = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/students/${id}/unblock`);
};
