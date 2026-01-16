import type { GetSubjectVariantsByClassAndSyllabusQueryDto } from "../../dtos/get.all.variant.with.subject.dto.js";
import type { SubjectVariantViewOnlyWithSubject } from "../../type/subject.variant.type.js";

export interface IFindSubjectVariantWithSubjectUseCase {
  execute(
    dto: GetSubjectVariantsByClassAndSyllabusQueryDto
  ): Promise<SubjectVariantViewOnlyWithSubject[]>;
}