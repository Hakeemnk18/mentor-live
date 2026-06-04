import { type ChapterProps } from "../entities/chapter.entity.js";
import type { SubjectVariantWithSubjectView } from "../../subject-variant/type/subject.variant.type.js";
import type { AcademicListFiltersBase } from "../../../core/shared/type/find.all.with.filters.js";
export type ChapterWithSubjectVariantView = Omit<ChapterProps, "subjectVariant"> & {
    subjectVariant: SubjectVariantWithSubjectView;
};
export type ChapterListFilters = AcademicListFiltersBase & {
    classId: string;
    syllabusId: string;
};
//# sourceMappingURL=chapter.type.d.ts.map