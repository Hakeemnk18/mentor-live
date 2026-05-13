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

export type ChapterInitialData = {
  id: string;
  name: string;
  price: number;
  iconUrl?: string;
  syllabusId: string;
  classId: string;
  subjectVariantId: string;
};
