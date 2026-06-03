import { inject, injectable } from "tsyringe";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";

import type { IGetAllLeadsUseCase } from "./interfaces/get.all.leads.use-case.interface.js";
import type { ILeadRepository } from "../repository/lead.repository.interface.js";
import type { LeadListItem } from "../type/lead.type.js";

@injectable()
export class GetAllLeadsUseCase implements IGetAllLeadsUseCase {
  constructor(
    @inject("ILeadRepository")
    private readonly _leadRepository: ILeadRepository,
  ) {}

  async execute(dto: GetAllQueryDto): Promise<{ data: LeadListItem[]; total: number }> {
    const { page, search, limit, sortValue, filters } = dto;

    let query: Record<string, any> = {};
    let sort: Record<string, any> = { createdAt: -1 };

    /* ---------- filters (type, status) ---------- */
    if (filters && Object.keys(filters).length > 0) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          query[key] = value;
        }
      }
    }

    /* ---------- sort ---------- */
    if (sortValue === "oldest") {
      sort = { createdAt: 1 };
    }

    /* ---------- search (name, phone) ---------- */
    if (search && search.trim() !== "") {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { phone: { $regex: escaped, $options: "i" } },
        { purpose: { $regex: escaped, $options: "i" } },
      ];
    }

    const allDoc: IGetAllDocDB = { page, limit, query, sort };

    const [data, total] = await Promise.all([
      this._leadRepository.findAllForAdmin(allDoc),
      this._leadRepository.countDocument(query),
    ]);

    return { data, total };
  }
}
