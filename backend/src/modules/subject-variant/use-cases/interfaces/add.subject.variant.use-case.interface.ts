import type { AddSubjectVariantRequestDto } from "../../dtos/add.subject.variant.dto.js";

export interface IAddSubjectVariantUseCase {
  execute(
    subjectId: string,
    dto: AddSubjectVariantRequestDto
  ): Promise<void>;
}