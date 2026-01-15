import type {
  GetSubjectsApiResponse,
  GetSubjectsParams,
  GetSubjectsResult,
} from "../shared/types/api.types";
import axiosInstance from "./axios.instance";

export const getSubjects = async (
  params: GetSubjectsParams
): Promise<GetSubjectsResult> => {
  const res = await axiosInstance.get<GetSubjectsApiResponse>("/subjects", {
    params,
  });
  console.log("fetch subjects response ", res);
  const apiData = res.data;

  return {
    rows: apiData.data.map((s) => ({
      _id: s.id,
      name: s.name,
      isDeleted: s.isDeleted,
    })),
    currentPage: apiData.currentPage,
    totalPages: apiData.totalPages,
    total: apiData.total,
  };
};
export const createSubject = async (payload: { name: string }) => {
  const res = await axiosInstance.post("/subjects", payload);
  return res.data;
};

export const updateSubject = async (id: string, payload: { name: string }) => {
  const res = await axiosInstance.put(`/subjects/${id}`, payload);
  return res.data;
};
