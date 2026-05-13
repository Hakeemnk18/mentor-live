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

export type SubjectFormVariant = {
  syllabusId: string;
  classId: string;
};

export type SubjectFormData = {
  _id?: string;
  name: string;
  variants: SubjectFormVariant[];
};

export type SubjectVariantApi = {
  syllabus: { id: string };
  class: { id: string };
};

export type GetSubjectByIdApiResponse = {
  success: boolean;
  message: string;
  data: {
    subject: {
      id: string;
      name: string;
    };
    variants: SubjectVariantApi[];
  };
};

export type SyllabusAndClassPayload = {
  syllabus: string;
  classes: string[];
};

export type CreateSubjectPayload = {
  name: string;
  syllabusAndClass: SyllabusAndClassPayload[];
};

export type EditSubjectNamePayload = {
  name: string;
};

export type SubjectRow = {
  _id: string;
  name: string;
  variants: number;
  isDeleted: boolean;
};

export type VariantRow = {
  _id: string;
  syllabusName: string;
  className: string;
};

export type SubjectVariantForm = {
  syllabusId: string;
  classId: string;
};
