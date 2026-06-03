import axiosInstance from "./axios.instance";
import type {
  CreateLeadPayload,
  GetLeadsParams,
  GetLeadsResponse,
  LeadStatus,
} from "../shared/types/lead.types";

export const createLead = async (payload: CreateLeadPayload): Promise<void> => {
  await axiosInstance.post("/leads", payload);
};

export const getLeads = async (params: GetLeadsParams): Promise<GetLeadsResponse> => {
  const res = await axiosInstance.get("/leads", { params });
  const d = res.data;
  return {
    data: d.data ?? [],
    total: d.total ?? 0,
    totalPages: d.totalPages ?? 1,
    currentPage: d.currentPage ?? 1,
  };
};

export const updateLeadStatus = async (
  id: string,
  status: LeadStatus,
): Promise<void> => {
  await axiosInstance.patch(`/leads/${id}/status`, { status });
};
