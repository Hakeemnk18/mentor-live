import axiosInstance from "./axios.instance";
import type {
  AdminUser,
  CreateUserPayload,
  EditUserPayload,
  GetUsersParams,
  GetUsersResult,
} from "../shared/types/user.types";

export const getUsers = async (params: GetUsersParams): Promise<GetUsersResult> => {
  const res = await axiosInstance.get("/admin/users", { params });
  const d = res.data;
  return {
    data: d.data ?? [],
    total: d.total ?? 0,
    currentPage: d.currentPage ?? 1,
    totalPages: d.totalPages ?? 1,
  };
};

export const createUser = async (payload: CreateUserPayload): Promise<AdminUser> => {
  const res = await axiosInstance.post("/admin/users", payload);
  return res.data.data;
};

export const editUser = async (id: string, payload: EditUserPayload): Promise<AdminUser> => {
  const res = await axiosInstance.put(`/admin/users/${id}`, payload);
  return res.data.data;
};

export const blockUser = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/admin/users/${id}/block`);
};

export const unblockUser = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/admin/users/${id}/unblock`);
};
