export interface Student {
  id: string;
  name: string;
  class: string;
  place: string;
  phoneNumber: string;
  school: string;
  syllabus: string;
  isDeleted: boolean;
}

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  class?: string;
  syllabus?: string;
  isDeleted?: boolean;
}

export interface GetStudentsResult {
  data: Student[];
  total: number;
  currentPage: number;
  totalPages: number;
}
