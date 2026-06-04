import axiosInstance from "./axios.instance";

import type { ClassResponse, CreateClassPayload, GetClassesApiResponse, GetClassesParams, GetClassesResult } from "../shared/types/class.types";
export const createClass = async (
  payload: CreateClassPayload
): Promise<ClassResponse> => {
  const res = await axiosInstance.post("/classes", payload);
  console.log("create classes response ", res);

  return res.data;
};

export const updateClass = async (
  id: string,
  payload: CreateClassPayload
): Promise<ClassResponse> => {
  const res = await axiosInstance.put(`/classes/${id}`, payload);
  console.log("update classes response ", res);

  return res.data;
};

/** Lightweight dropdown list — only name + id, no pagination */
export const getClassesList = async (): Promise<{ _id: string; name: string }[]> => {
  const res = await axiosInstance.get("/classes/list");
  return (res.data.data ?? []).map((c: any) => ({ _id: c.id ?? c._id, name: c.name }));
};

export const getClasses = async (
  params: GetClassesParams
): Promise<GetClassesResult> => {
  const res = await axiosInstance.get<GetClassesApiResponse>("/classes", {
    params,
  });
  console.log("RAW RESPONSE", res);

  const apiData = res.data;

  return {
    rows: apiData.data.map((cls) => ({
      _id: cls.id,
      name: cls.name,
      isDeleted: cls.isDeleted,
    })),
    currentPage: apiData.currentPage,
    totalPages: apiData.totalPages,
    total: apiData.total,
  };
};
