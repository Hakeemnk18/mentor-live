import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Chapter } from "../entities/chapter.entity.js";
import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { CreateChapterRequestDto } from "../dtos/create.chapter.dto.js"; 
import type { ICreateChapterUseCase } from "./interfaces/create.chapter.use-case.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";

@injectable()
export class CreateChapterUseCase implements ICreateChapterUseCase {
  constructor(
    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(dto: CreateChapterRequestDto): Promise<void> {


    

    const normalizedName = dto.name.trim();

    //  Check duplicate within same subject variant
    const existing = await this._chapterRepository.findByNameAndVariant(
      normalizedName,
      dto.subjectVariant
    );

    if (existing && !existing.isDeleted) {
      throw new CustomError(
        ResponseMessages.CHAPTER_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    //  If exists but soft-deleted → restore
    if (existing && existing.isDeleted) {
      const restored = existing.restore();
      await this._chapterRepository.save(restored);
      return;
    }

    //  Validate Subject Variant existence
    const subjectVariant = await this._subjectVariantRepository.findById(dto.subjectVariant);
    if (!subjectVariant || subjectVariant.isDeleted) {
      throw new CustomError(
        ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    //  Create domain entity
    const chapterEntity = new Chapter({
      id: null,
      icon: dto.icon,
      name: normalizedName,
      price: dto.price,
      subjectVariant: dto.subjectVariant,
      isDeleted: false,
    });

    //  Persist
    const created = await this._chapterRepository.create(chapterEntity);

    if (!created) {
      throw new CustomError(
        ResponseMessages.CHAPTER_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
