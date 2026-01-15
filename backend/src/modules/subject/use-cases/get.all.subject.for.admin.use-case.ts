import { inject, injectable } from "tsyringe";
import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import { Subject } from "../entities/subject.entity.js";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { IGetSubjectsForAdminUseCase } from "./interfaces/get.all.subject.for.admin.use-case.interface.js";

@injectable()
export class GetSubjectsForAdminUseCase
  implements IGetSubjectsForAdminUseCase
{
  constructor(
    @inject("ISubjectRepository")
    private readonly _subjectRepository: ISubjectRepository
  ) {}

  async execute(dto: GetAllQueryDto): Promise<{ data: Subject[]; total: number }> {
    const { page, search, limit } = dto;

    let query: Record<string, any> = {};
    let sort: Record<string, any> = {
      createdAt: 1,
    };

    if (search && search.trim() !== "") {
      query.name = { $regex: `^${search.trim()}`, $options: "i" };
    }

    const allDoc: IGetAllDocDB = {
      page,
      limit,
      query,
      sort,
    };

    const [data, total] = await Promise.all([
      this._subjectRepository.findAllForAdmin(allDoc),
      this._subjectRepository.countDocument(query),
    ]);

    return { data, total };
  }
}
