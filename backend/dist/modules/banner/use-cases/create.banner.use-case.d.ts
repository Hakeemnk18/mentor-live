import type { ICreateBannerUseCase } from "./interfaces/create.banner.use-case.interface.js";
import type { CreateBannerRequestDto } from "../dto/create.banner.dto.js";
import type { IBannerRepository } from "../repository/banner.repository.interface.js";
export declare class CreateBannerUseCase implements ICreateBannerUseCase {
    private readonly _bannerRepository;
    constructor(_bannerRepository: IBannerRepository);
    execute(dto: CreateBannerRequestDto): Promise<void>;
}
//# sourceMappingURL=create.banner.use-case.d.ts.map