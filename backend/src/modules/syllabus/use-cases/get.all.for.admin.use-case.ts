import { inject, injectable } from "tsyringe";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { IGetSyllabusesForAdminUseCase } from "./interfaces/get.all.for.admin.interface.js";
import type { Syllabus } from "../entities/syllabus.entity.js";
import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";

@injectable()
export class GetSyllabusesForAdminUseCase
  implements IGetSyllabusesForAdminUseCase
{
  constructor(
    @inject("ISyllabusRepository")
    private readonly _syllabusRepository: ISyllabusRepository
  ) {}

  async execute(dto: GetAllQueryDto): Promise<{data: Syllabus[], total: number}> {
    const { page, search, limit } = dto;
    let query: Record<string, any> = {};
    let sort: Record<string, any> = {
        createdAt: 1
    };
    
    if (search && search.trim() !== "") {
      query.name = { $regex: `^${search.trim()}`, $options: "i" };
    }

    let allDoc: IGetAllDocDB = {
      page,
      limit,
      query,
      sort,
    };

    const [ data, total ] = await Promise.all([
        this._syllabusRepository.findAllForAdmin(allDoc),
        this._syllabusRepository.countDocument(query)
    ])

    return { data, total}
  }
}