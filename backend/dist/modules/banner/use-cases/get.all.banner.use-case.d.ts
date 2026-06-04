import type { IBannerRepository } from "../repository/banner.repository.interface.js";
import type { Banner } from "../entities/banner.entity.js";
import type { IGetAllBannerUseCase } from "./interfaces/get.all.banner.use-case.interface.js";
export declare class GetAllBannerUseCase implements IGetAllBannerUseCase {
    private readonly _bannerRepository;
    constructor(_bannerRepository: IBannerRepository);
    /** Returns up to 5 visible banners sorted by priority for the user-facing carousel */
    execute(): Promise<Banner[]>;
}
//# sourceMappingURL=get.all.banner.use-case.d.ts.map