export type UserRole = "user" | "admin" | "salesPerson";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  isVerified: boolean;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | "";
  isBlocked?: boolean;
  sort?: string;
}

export interface GetUsersResult {
  data: AdminUser[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface EditUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
