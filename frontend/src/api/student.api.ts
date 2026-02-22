import axiosInstance from "./axios.instance";

export interface Student {
  id: string;
  name: string;
  class: string;
  place: string;
  phoneNumber: string;
  school: string;
  syllabus: string;
  isDeleted: boolean;
}

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  class?: string;
  syllabus?: string;
  isDeleted?: boolean;
}

export interface GetStudentsResult {
  data: Student[];
  total: number;
  currentPage: number;
  totalPages: number;
}

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
