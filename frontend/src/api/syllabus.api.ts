import axiosInstance from "./axios.instance";

import type { SyllabusResponse, GetSyllabusParams, GetSyllabusResult, GetSyllabusApiResponse } from "../shared/types/syllabus.types";
export const getSyllabus = async (
  params: GetSyllabusParams
): Promise<GetSyllabusResult> => {
  const res = await axiosInstance.get<GetSyllabusApiResponse>(
    "/syllabuses",
    { params }
  );

  const apiData = res.data;
console.log("syllabus api response ",res)
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


export const createSyllabus = async (payload: { name: string }) => {
  const res = await axiosInstance.post("/syllabuses", payload);
  return res.data;
};

export const updateSyllabus = async (
  id: string,
  payload: { name: string }
) => {
  const res = await axiosInstance.put(`/syllabuses/${id}`, payload);
  return res.data;
};