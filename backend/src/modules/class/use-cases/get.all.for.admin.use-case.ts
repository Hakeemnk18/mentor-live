import { inject, injectable } from "tsyringe";
import type { IClassRepository } from "../repositories/class.repository.interface.js";
import { Class } from "../entities/class.entity.js";
import type { IGetClassesForAdminUseCase } from "./interfaces/get.all.for.admin.use-case.interface.js";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";

@injectable()
export class GetClassesForAdminUseCase
  implements IGetClassesForAdminUseCase
{
  constructor(
    @inject("IClassRepository")
    private readonly _classRepository: IClassRepository
  ) {}

  async execute(dto: GetAllQueryDto): Promise<{data: Class[], total: number}> {
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
        this._classRepository.findAllForAdmin(allDoc),
        this._classRepository.countDocument(query)
    ])

    return { data, total}
  }
}