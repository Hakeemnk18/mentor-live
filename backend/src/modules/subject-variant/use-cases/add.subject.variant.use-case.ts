import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { SubjectVariant } from "../entities/subject.variant.entity.js";
import type { ISubjectVariantRepository } from "../repositories/subject.variant.repository.interface.js";
import type { IAddSubjectVariantUseCase } from "./interfaces/add.subject.variant.use-case.interface.js";
import type { AddSubjectVariantRequestDto } from "../dtos/add.subject.variant.dto.js";
import type { ISubjectRepository } from "../../subject/repositories/subject.repository.interface.js";
import type { IClassRepository } from "../../class/repositories/class.repository.interface.js";
import type { ISyllabusRepository } from "../../syllabus/repositories/syllabus.repository.interface.js";

@injectable()
export class AddSubjectVariantUseCase implements IAddSubjectVariantUseCase {
  constructor(
    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository,

    @inject("ISubjectRepository")
    private readonly _subjectRepository: ISubjectRepository,

    @inject("IClassRepository")
    private readonly _classRepository: IClassRepository,

    @inject("ISyllabusRepository")
    private readonly _syllabusRepository: ISyllabusRepository
  ) {}

  async execute(
    subjectId: string,
    dto: AddSubjectVariantRequestDto
  ): Promise<void> {
    // Track duplicate (classId + syllabusId) within the same request
    const seen = new Set<string>();

    // Ensure subject exists and is active
    const subject = await this._subjectRepository.findById(subjectId);
    if (!subject || subject.isDeleted) {
      throw new CustomError(
        ResponseMessages.SUBJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    /**
     * Validation phase:
     * - prevent duplicate variants in request
     * - ensure referenced class and syllabus exist
     * - ensure variant does not already exist for subject
     * No database mutations should happen here.
     */
    for (const { classId, syllabusId } of dto.variants) {
      const key = `${classId}:${syllabusId}`;

      if (seen.has(key)) {
        throw new CustomError(
          ResponseMessages.DUPLICATE_SUBJECT_VARIANT_IN_REQUEST,
          HttpStatusCode.BAD_REQUEST
        );
      }
      seen.add(key);

      if (!(await this._classRepository.findById(classId))) {
        throw new CustomError(
          ResponseMessages.CLASS_NOT_FOUND,
          HttpStatusCode.NOT_FOUND
        );
      }

      if (!(await this._syllabusRepository.findById(syllabusId))) {
        throw new CustomError(
          ResponseMessages.SYLLABUS_NOT_FOUND,
          HttpStatusCode.NOT_FOUND
        );
      }

      if (
        await this._subjectVariantRepository.findByCombination(
          subjectId,
          classId,
          syllabusId
        )
      ) {
        throw new CustomError(
          ResponseMessages.SUBJECT_VARIANT_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST
        );
      }
    }

    /**
     * Mutation phase:
     * All validations have passed, safe to create variants.
     */
    for (const { classId, syllabusId } of dto.variants) {
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
}
