import { inject, injectable } from "tsyringe";
import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import { Chapter } from "../entities/chapter.entity.js";
import type { IGetChaptersForAdminUseCase } from "./interfaces/get.all.for.admin.use-case.interface.js";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { ChapterWithSubjectVariantView } from "../type/chapter.type.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";

@injectable()
export class GetChaptersForAdminUseCase implements IGetChaptersForAdminUseCase {
  constructor(
    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(
    dto: GetAllQueryDto
  ): Promise<{ data: ChapterWithSubjectVariantView[]; total: number }> {
    const { page, search, limit, sortValue, filters } = dto;
    let filteredSubjectVariantIds: string[] = [];
    let match: Record<string, any> = {};

    let query: Record<string, any> = {};
    let sort: Record<string, any> = {
      createdAt: 1,
    };

    if (search && search.trim() !== "") {
      query.name = { $regex: `^${search.trim()}`, $options: "i" };
    }

   
    if (filters && Object.keys(filters).length > 0) {
      
      if (filters.classId) {
        match.class = filters.classId;
      }
      if (filters.subjectId) {
        match.subject = filters.subjectId;
      }

      if (filters.syllabusId) {
        match.syllabus = filters.syllabusId;
      }

      if (filters.isDeleted !== undefined) {
        query.isDeleted = filters.isDeleted;
      }

      if (match && Object.keys(match).length > 0) {
        filteredSubjectVariantIds =
          await this._subjectVariantRepository.findAllIds(match);
          
      }
    }

    if (filters && Object.keys(match).length > 0) {
      if (filteredSubjectVariantIds.length === 0) {
        return { data: [], total: 0 }; 
      }
      query.subjectVariant = { $in: filteredSubjectVariantIds };
    }

    

    if (sortValue === "price_asc") {
      sort = { price: 1 };
    } else if (sortValue === "price_desc") {
      sort = { price: -1 };
    }

    const allDoc: IGetAllDocDB = {
      page,
      limit,
      query,
      sort,
    };

    const [chapters, total] = await Promise.all([
      this._chapterRepository.findAllForAdmin(allDoc),
      this._chapterRepository.countDocument(query),
    ]);

    const subjectVariantIds = [
      ...new Set(chapters.map((c) => c.subjectVariant.toString())),
    ];

    const subjectVariants =
      await this._subjectVariantRepository.findAllWithPopulatedSUbject({
        _id: { $in: subjectVariantIds },
      });

    const subjectVariantMap = new Map(subjectVariants.map((v) => [v.id, v]));

    const data: ChapterWithSubjectVariantView[] = chapters.map((chapter) => ({
      ...chapter,
      subjectVariant: subjectVariantMap.get(chapter.subjectVariant.toString())!,
    }));

    return { data, total };
  }
}
