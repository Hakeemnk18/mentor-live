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
  currentPage: number;
  totalPages: number;
  total: number;
};

export type SyllabusRow = {
  _id: string;
  name: string;
  isDeleted: boolean;
};

/** Returned by GET /syllabuses/list — lightweight dropdown items */
export type SyllabusListItem = {
  _id: string;
  name: string;
};
