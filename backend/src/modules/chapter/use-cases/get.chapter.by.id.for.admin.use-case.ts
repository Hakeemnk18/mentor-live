import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { IGetChapterByIdForAdminUseCase } from "./interfaces/get.chapter.by.id.for.admin.use-case.interface.js";
import type { ChapterWithSubjectVariantView } from "../type/chapter.type.js";

@injectable()
export class GetChapterByIdForAdminUseCase
  implements IGetChapterByIdForAdminUseCase
{
  constructor(
    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(id: string): Promise<ChapterWithSubjectVariantView> {
    const chapter = await this._chapterRepository.findById(id);

    if (!chapter) {
      throw new CustomError(
        ResponseMessages.CHAPTER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const variants = await this._subjectVariantRepository.findAllWithPopulatedSUbject(
      { _id: chapter.subjectVariant }
    );

    const subjectVariant = variants[0];

    if (!subjectVariant) {
      throw new CustomError(
        ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    return {
      ...chapter,
      subjectVariant,
    };
  }
}
