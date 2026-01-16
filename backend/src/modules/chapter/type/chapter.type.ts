import { type ChapterProps } from "../entities/chapter.entity.js";
import type { SubjectVariantWithSubjectView } from "../../subject-variant/type/subject.variant.type.js"; 

export type ChapterWithSubjectVariantView =
  Omit<ChapterProps, "subjectVariant"> & {
    subjectVariant: SubjectVariantWithSubjectView;
  };


export type GetChaptersForUserFilter = {
  classId: string;
  syllabusId: string;
  subjectId: string | undefined;
  sort: Record<string, 1 | -1>;
  limit: number;
  search?: string;
  page: number;
};