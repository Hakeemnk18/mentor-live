export type CreateClassPayload = {
  name: string;
};

export type ClassResponse = {
  id: string;
  name: string;
  isDeleted: boolean;
};

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

export type ClassRow = {
  _id: string;
  name: string;
  isDeleted: boolean;
};
