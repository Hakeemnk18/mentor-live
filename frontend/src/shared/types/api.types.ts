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


export type EditSubjectNamePayload
= {
  name:string
}


//CHAPTER

export type GetChaptersParams = {
  page: number;
  limit: number;
  search?: string;
  classId?: string;
  syllabusId?: string;
  subjectId?: string;
  isDeleted?: boolean;
};

export type ChapterRow = {
  _id: string;
  name: string;
  price: number;
  icon?: string;
  isDeleted: boolean;
  className: string;
  syllabusName: string;
  subjectName: string;
  classId: string;
  syllabusId: string;
  subjectVariantId: string;
};

export type GetChaptersResult = {
  rows: ChapterRow[];
  currentPage: number;
  totalPages: number;
  total: number;
};
export type GetChaptersListParams = {
  syllabusId: string;
  classId: string;
  subjectId?: string;
};

export type ChapterListItem = {
  _id: string;
  name: string;
  price: number;
  icon: string;
};

export type SubjectVariantOption = {
  _id: string;
  subjectName: string;
};

export type ChapterIcon = {
  url: string;
  publicId: string;
};

export type CreateChapterForm = {
  name: string;
  price: number;
  syllabusId: string;
  classId: string;
  subjectVariantId: string;
  icon: ChapterIcon;
};
export type CreateChapterPayload = {
  name: string;
  price: number;
  subjectVariant: string;
  icon: {
    url: string;
    publicId: string;
  };
};

export type SubjectVariantsForChapterApi = {
  id: string;
  subject: {
    id: string;
    name: string;
  };
};

export type GetSubjectVariantsParams = {
  classId: string;
  syllabusId: string;
};

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

export type FacultyImagePayload = {
  url: string;
  publicId: string;
};

export type FacultySlotPayload = {
  time: string; // ISO string
};

export type CreateFacultyPayload = {
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: FacultyImagePayload;
  price: number;
  subjects: string[];
  slots: FacultySlotPayload[];
};