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


@injectable()
export class CreateSubjectUseCase implements ICreateSubjectUseCase {
  constructor(
    @inject("ISubjectRepository")
    private readonly _subjectRepository: ISubjectRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(dto: CreateSubjectRequestDto): Promise<void> {
    const normalizedName = dto.name.trim();

    // 1️⃣ Check duplicate subject name
    const existing = await this._subjectRepository.findByName(normalizedName);

    if (existing && !existing.isDeleted) {
      throw new CustomError(
        ResponseMessages.SUBJECT_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    // 2️⃣ If subject exists but deleted → restore
    let subject: Subject;

    if (existing && existing.isDeleted) {
      const restored = existing.restore();
      subject = await this._subjectRepository.save(restored);
    } else {
      // 3️⃣ Create new subject
      const subjectEntity = new Subject({
        id: null,
        name: normalizedName,
        isDeleted: false,
      });

      subject = await this._subjectRepository.create(subjectEntity);

      if (!subject) {
        throw new CustomError(
          ResponseMessages.SUBJECT_CREATION_FAILED,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    }

    // 4️⃣ Create SubjectVariants
    for (const item of dto.syllabusAndClass) {
      for (const classId of item.classes) {
        // Prevent duplicate combination (DB also enforces this)
        const existingVariant =
          await this._subjectVariantRepository.findByCombination(
            subject.id!,
            classId,
            item.syllabus
          );

        if (existingVariant && !existingVariant.isDeleted) {
          continue; // already exists → skip
        }

        if (existingVariant && existingVariant.isDeleted) {
          const restored = existingVariant.restore();
          await this._subjectVariantRepository.save(restored);
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
