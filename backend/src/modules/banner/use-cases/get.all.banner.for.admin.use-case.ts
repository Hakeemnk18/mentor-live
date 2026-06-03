import { inject, injectable } from "tsyringe";
import type { IBannerRepository } from "../repository/banner.repository.interface.js";
import type { IGetAllBannerForAdminUseCase } from "./interfaces/get.all.banner.for.admin.use-case.interface.js";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { Banner } from "../entities/banner.entity.js";

@injectable()
export class GetAllBannerForAdminUseCase implements IGetAllBannerForAdminUseCase {
  constructor(
    @inject("IBannerRepository")
    private readonly _bannerRepository: IBannerRepository,
  ) {}

  async execute(dto: GetAllQueryDto): Promise<{ data: Banner[]; total: number }> {
    const { page, limit, search, sortValue, filters } = dto;

    const query: Record<string, any> = {};

    if (search && search.trim() !== "") {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.description = { $regex: escaped, $options: "i" };
    }

    if (filters && Object.keys(filters).length > 0) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          query[key] = value;
        }
      }
    }

    let sort: Record<string, any> = { createdAt: -1 };
    if (sortValue === "priority") sort = { priority: 1, createdAt: -1 };

    const [data, total] = await Promise.all([
      this._bannerRepository.findAllForAdmin({ page, limit, query, sort }),
      this._bannerRepository.countDocument(query),
    ]);

    return { data, total };
  }
}
