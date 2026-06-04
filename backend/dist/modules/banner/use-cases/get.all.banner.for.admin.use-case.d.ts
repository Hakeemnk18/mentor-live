import type { IBannerRepository } from "../repository/banner.repository.interface.js";
import type { IGetAllBannerForAdminUseCase } from "./interfaces/get.all.banner.for.admin.use-case.interface.js";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { Banner } from "../entities/banner.entity.js";
export declare class GetAllBannerForAdminUseCase implements IGetAllBannerForAdminUseCase {
    private readonly _bannerRepository;
    constructor(_bannerRepository: IBannerRepository);
    execute(dto: GetAllQueryDto): Promise<{
        data: Banner[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.banner.for.admin.use-case.d.ts.map