import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Chapter } from "../entities/chapter.entity.js";
import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { CreateChapterRequestDto } from "../dtos/create.chapter.dto.js";
import type { IEditChapterUseCase } from "./interfaces/edit.chapter.use-case.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";

@injectable()
export class EditChapterUseCase implements IEditChapterUseCase {
  constructor(
    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository,

    @inject("ISubjectVariantRepository")
        private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(id: string, dto: CreateChapterRequestDto): Promise<void> {
    const normalizedName = dto.name.trim();

    //  Fetch existing chapter
    const existing = await this._chapterRepository.findById(id);

    if (!existing) {
      throw new CustomError(
        ResponseMessages.CHAPTER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    //  If name or variant changes, check for duplicates
    if (
      existing.name !== normalizedName ||
      existing.subjectVariant !== dto.subjectVariant
    ) {
      const duplicate = await this._chapterRepository.findByNameAndVariant(
        normalizedName,
        dto.subjectVariant
      );

      if (duplicate && !duplicate.isDeleted && duplicate.id !== id) {
        throw new CustomError(
          ResponseMessages.CHAPTER_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST
        );
      }
    }

    //  Validate Subject Variant existence
    const subjectVariant = await this._subjectVariantRepository.findById(
      dto.subjectVariant
    );
    if (!subjectVariant || subjectVariant.isDeleted) {
      throw new CustomError(
        ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    //  Rebuild domain entity (immutable update)
    const updated = new Chapter({
      id: existing.id,
      icon: dto.icon,
      name: normalizedName,
      price: dto.price,
      subjectVariant: dto.subjectVariant,
      isDeleted: existing.isDeleted,
    });

    //  Persist
    await this._chapterRepository.save(updated);
  }
}
