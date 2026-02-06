import type { CreateFacultyPayload } from "../shared/types/api.types";
import axiosInstance from "./axios.instance";

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

// api/faculty.api.ts
export const getFacultyById = async (id: string) => {
  const res = await axiosInstance.get(`/faculties/${id}`);
  return res.data.data; // assume backend returns { data: faculty }
};
