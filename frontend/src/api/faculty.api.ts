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
  return res.data;
};
