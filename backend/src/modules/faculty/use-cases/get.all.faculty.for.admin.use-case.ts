import { inject, injectable } from "tsyringe";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IGetAllFacultyForAdminUseCase } from "./interfaces/get.all.faculty.for.admin.use-case.interface.js";
import type { FindByClassSyllabusQueryDto } from "../../../core/shared/dtos/get.by.class.and.subject.dto.js";
import type { FacultyView } from "../types/faculty.type.js";

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
    const { syllabusId, classId, subjectId, sortValue, limit, search, page } = dto;
    

    let sort: Record<string, any> = {
      createdAt: 1,
    };

    if (sortValue === "price_asc") {
      sort = { price: 1, createdAt: 1 };
    } else if (sortValue === "price_desc") {
      sort = { price: -1, createdAt: 1 };
    }

    const {data , total }= await this._facultyRepository.findAllFacultyForAdmin({
      page,
      limit,
      search,
      subjectId,
      classId,
      syllabusId,
      sort,
    });

    return { data, total }
  }
}
