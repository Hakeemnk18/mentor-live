import { inject, injectable } from "tsyringe";
import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { IGetChaptersForUserUseCase } from "./interfaces/get.all.for.user.use-case.interface.js";
import type { GetChaptersForUserQueryDto } from "../dtos/get.chapters.user.dto.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";

@injectable()
export class GetChaptersForUserUseCase implements IGetChaptersForUserUseCase {
  constructor(
    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(
    dto: GetChaptersForUserQueryDto
  ): Promise<{ id: string; name: string; price: number; icon: string }[]> {
    const { syllabusId, classId, subjectId, sortValue, limit, search } = dto;
    let page = 1;

    let sort: Record<string, any> = {
      createdAt: 1,
    };

    if (sortValue === "price_asc") {
      sort = { price: 1, createdAt: 1 };
    } else if (sortValue === "price_desc") {
      sort = { price: -1, createdAt: 1 };
    }

    const data = await this._chapterRepository.findAllForUser({
      page,
      limit,
      search,
      subjectId,
      classId,
      syllabusId,
      sort,
    });
    return data;
  }
}
