import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { SubjectVariant } from "../entities/subject.variant.entity.js";
import type { ISubjectVariantRepository } from "../repositories/subject.variant.repository.interface.js";
import type { IAddSubjectVariantUseCase } from "./interfaces/add.subject.variant.use-case.interface.js";
import type { AddSubjectVariantRequestDto } from "../dtos/add.subject.variant.dto.js";

@injectable()
export class AddSubjectVariantUseCase implements IAddSubjectVariantUseCase {
  constructor(
    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(
    subjectId: string,
    dto: AddSubjectVariantRequestDto
  ): Promise<void> {

    const {classId, syllabusId }  = dto
    
    // 1️⃣ Check if variant already exists
    const existing =
      await this._subjectVariantRepository.findByCombination(
        subjectId,
        classId,
        syllabusId
      );

    if (existing && !existing.isDeleted) {
      throw new CustomError(
        ResponseMessages.SUBJECT_VARIANT_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    // 2️⃣ If soft-deleted, restore instead of recreating
    if (existing && existing.isDeleted) {
      const restored = existing.restore();
      await this._subjectVariantRepository.save(restored);
      return;
    }

    // 3️⃣ Create new variant
    const variant = new SubjectVariant({
      id: null,
      subjectId,
      classId,
      syllabusId,
      isDeleted: false,
    });

    await this._subjectVariantRepository.create(variant);
  }
}
