import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Subject } from "../entities/subject.entity.js";

import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import type { CreateSubjectRequestDto } from "../dtos/subject.create.dto.js";
import type { ICreateSubjectUseCase } from "./interfaces/create.subject.use-case.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import { SubjectVariant } from "../../subject-variant/entities/subject.variant.entity.js";
import type { IClassRepository } from "../../class/repositories/class.repository.interface.js";
import type { ISyllabusRepository } from "../../syllabus/repositories/syllabus.repository.interface.js";

@injectable()
export class CreateSubjectUseCase implements ICreateSubjectUseCase {
  constructor(
    @inject("ISubjectRepository")
    private readonly _subjectRepository: ISubjectRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository,

    @inject("IClassRepository")
    private readonly _classRepository: IClassRepository,

    @inject("ISyllabusRepository")
    private readonly _syllabusRepository: ISyllabusRepository
  ) {}

  async execute(dto: CreateSubjectRequestDto): Promise<void> {
    // Normalize subject name to enforce case/whitespace–insensitive uniqueness
    const normalizedName = dto.name.trim();

    // Ensure subject with same name does not already exist
    const existing = await this._subjectRepository.findByName(normalizedName);
    if (existing && !existing.isDeleted) {
      throw new CustomError(
        ResponseMessages.SUBJECT_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    

    /**
     * Validation phase (read-only):
     * - ensure all referenced syllabuses exist
     * - ensure all referenced classes exist
     * No database mutations should occur in this phase.
     */
    for (const item of dto.syllabusAndClass) {
      if (!(await this._syllabusRepository.findById(item.syllabus))) {
        throw new CustomError(
          ResponseMessages.SYLLABUS_NOT_FOUND,
          HttpStatusCode.NOT_FOUND
        );
      }

      for (const classId of item.classes) {
        if (!(await this._classRepository.findById(classId))) {
          throw new CustomError(
            ResponseMessages.CLASS_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        }
      }
    }

    /**
     * Create subject first.
     * Variants depend on subject ID, so subject must exist before validation
     * of subject-variant combinations.
     */
    const subjectEntity = new Subject({
      id: null,
      name: normalizedName,
      isDeleted: false,
    });

    const subject = await this._subjectRepository.create(subjectEntity);
    if (!subject) {
      throw new CustomError(
        ResponseMessages.SUBJECT_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    /**
     * Mutation phase:
     * All validations have passed, safe to create subject variants.
     * Existing variants are skipped to keep operation idempotent.
     */
    for (const item of dto.syllabusAndClass) {
      for (const classId of item.classes) {
        const existingVariant =
          await this._subjectVariantRepository.findByCombination(
            subject.id!,
            classId,
            item.syllabus
          );

        if (existingVariant && !existingVariant.isDeleted) {
          continue;
        }

        const variant = new SubjectVariant({
          id: null,
          subjectId: subject.id!,
          classId,
          syllabusId: item.syllabus,
          isDeleted: false,
        });

        await this._subjectVariantRepository.create(variant);
      }
    }
  }
}
