import { type ChapterProps } from "../entities/chapter.entity.js";
import type { SubjectVariantWithSubjectView } from "../../subject-variant/type/subject.variant.type.js"; 

export type ChapterWithSubjectVariantView =
  Omit<ChapterProps, "subjectVariant"> & {
    subjectVariant: SubjectVariantWithSubjectView;
  };


