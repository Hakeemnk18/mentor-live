import { inject, injectable } from "tsyringe";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { IGetAllForAdminStudentUseCase } from "./interfaces/get.all.for.admin.use-case.interface.js";
import type { IStudentRepository } from "../repositories/student.repository.interface.js";
import type { Student } from "../entities/student.entity.js";

@injectable()
export class GetAllForAdminStudentUseCase implements IGetAllForAdminStudentUseCase {

    constructor(
        @inject("IStudentRepository") private readonly _studentRepository: IStudentRepository
    ){}
  async execute(
    dto: GetAllQueryDto,
  ): Promise<{ data: Student[]; total: number }> {

    const { page, search, limit, filters } = dto;
    let query: Record<string, any> = {};
    let sort: Record<string, any> = {
      createdAt: -1,
    };

    if (search && search.trim() !== "") {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { phoneNumber: { $regex: escapedSearch, $options: "i" } },
        { place: { $regex: escapedSearch, $options: "i" } },
        { school: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    // ---- FILTERS ----
    if (filters && Object.keys(filters).length > 0) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          query[key] = value;
        }
      }
    }

    let allDoc: IGetAllDocDB = {
      page,
      limit,
      query,
      sort,
    };

    const [ data, total ] = await Promise.all([
        this._studentRepository.findAllForAdmin(allDoc),
        this._studentRepository.countDocument(query)
    ])

    return { data, total}

  }
}
