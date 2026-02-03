import { inject, injectable } from "tsyringe";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IGetAllFacultyForAdminUseCase } from "./interfaces/get.all.faculty.for.admin.use-case.interface.js";
import type { FindByClassSyllabusQueryDto } from "../../../core/shared/dtos/get.by.class.and.subject.dto.js";
import type { FacultyView } from "../types/faculty.type.js";
import { buildFacultySort } from "../utils/faculty-sort.util.js";

@injectable()
export class GetAllFacultyForAdminUseCase
  implements IGetAllFacultyForAdminUseCase
{
  constructor(
    @inject("IFacultyRepository") 
    private _facultyRepository: IFacultyRepository
  ) {}
  async execute(
    dto: FindByClassSyllabusQueryDto
  ): Promise<{ data: FacultyView[]; total: number }> {
    const { syllabusId, classId, subjectId, sortValue, limit, search, page, isDeleted } = dto;
    

    const sort = buildFacultySort(sortValue)

    const {data , total }= await this._facultyRepository.findAllFacultyForAdmin({
      page,
      limit,
      search,
      subjectId,
      classId,
      syllabusId,
      sort,
      isDeleted
    });

    return { data, total }
  }
}
