import type { GetAllQueryDto } from "../../../../core/shared/dtos/get.all.doc.dto.js";
import type { Banner } from "../../entities/banner.entity.js";

export interface IGetAllBannerForAdminUseCase {
  execute(dto: GetAllQueryDto): Promise<{ data: Banner[]; total: number }>;
}
