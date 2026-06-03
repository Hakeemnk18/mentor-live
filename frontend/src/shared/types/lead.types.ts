export type LeadType = "inquiry" | "request";
export type LeadStatus = "new" | "contacted" | "resolved";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  purpose: string;
  type: LeadType;
  status: LeadStatus;
  classId: string | null;
  syllabusId: string | null;
  className: string | null;
  syllabusName: string | null;
  createdAt: string;
}

export interface CreateLeadPayload {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  purpose: string;
  type: LeadType;
  classId?: string | null;
  syllabusId?: string | null;
  className?: string | null;
  syllabusName?: string | null;
}

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  type?: LeadType | "";
  status?: LeadStatus | "";
}

export interface GetLeadsResponse {
  data: Lead[];
  total: number;
  totalPages: number;
  currentPage: number;
}
