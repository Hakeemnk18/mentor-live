import { inject, injectable } from "tsyringe";
import type { GetAllFacultyBYChapterDto } from "../dtos/find.by.chapter.dto.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { FacultyViewForUser } from "../types/faculty.type.js";
import type { IFindFacultyByChapterUseCase } from "./interfaces/find.faculty.by.chapter.use-case.interface.js";
import { buildFacultySort } from "../utils/faculty-sort.util.js";

@injectable()
export class FindFacultyByChapterUseCase implements IFindFacultyByChapterUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,
  ) {}

  async execute(dto: GetAllFacultyBYChapterDto): Promise<FacultyViewForUser[]> {
    const { sortValue, limit, search, page, chapterId } = dto;

    const sort = buildFacultySort(sortValue)

    const data = await this._facultyRepository.findFacultyByChapter({
      page,
      limit,
      search,
      chapterId,
      sort,
    });

    return data
  }
}
