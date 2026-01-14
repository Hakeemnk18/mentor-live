import type { ClassResponse } from "../../api/class.api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;  
}

export interface GetAllDocResponse<T = unknown> {
  success: boolean;
  message: string;
    total: number;
  currentPage: number;
  totalPages: number;
  data?: T;
  errors?: unknown; 
}




//CLASS

export type GetClassesApiResponse = {
  success: boolean;
  message: string;
  data: {
    data: ClassResponse[];
    currentPage: number;
    totalPages: number;
    total: number;
  };
};

export type GetClassesParams = {
  page: number;
  limit: number;
  search?: string;
  isDeleted?: boolean;
};
export type GetClassesResult = {
  rows: {
    _id: string;
    name: string;
    isDeleted: boolean;
  }[];
  currentPage: number;
  totalPages: number;
  total: number;
};




//SYLLABUS

export type SyllabusResponse = {
  _id: string;
  name: string;
  isDeleted: boolean;
};
export type GetSyllabusParams = {
  page: number;
  limit: number;
  search?: string;
  isDeleted?: boolean;
};
export type GetSyllabusResult = {
  rows: SyllabusResponse[];
  currentPage: number;
  totalPages: number;
  total: number;
};
export type GetSyllabusApiResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    isDeleted: boolean;
  }[];
};




//SUBJECT

export type GetSubjectsParams = {
  page: number;
  limit: number;
  search?: string;
  isDeleted?: boolean;
};

export type SubjectApiItem = {
  id: string;
  name: string;
  isDeleted: boolean;
};

export type GetSubjectsApiResponse = {
  success: boolean;
  message: string;
  currentPage: number;
  totalPages: number;
  total: number;
  data: SubjectApiItem[];
};

export type SubjectResponse = {
  _id: string;
  name: string;
  isDeleted: boolean;
};

export type GetSubjectsResult = {
  rows: SubjectResponse[];
  currentPage: number;
  totalPages: number;
  total: number;
};
