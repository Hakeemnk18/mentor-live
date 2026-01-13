import axiosInstance from "./axios.instance";

export type CreateClassPayload = {
  name: string;
};

export type ClassResponse = {
  _id: string;
  name: string;
  isDeleted: boolean;
};

export const createClass = async (
  payload: CreateClassPayload
): Promise<ClassResponse> => {
  const res = await axiosInstance.post("/admin/classes", payload);
  return res.data;
};

export const updateClass = async (
  id: string,
  payload: CreateClassPayload
): Promise<ClassResponse> => {
  const res = await axiosInstance.put(`/admin/classes/${id}`, payload);
  return res.data;
};
