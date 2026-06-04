import type { IEditBannerUseCase } from "./interfaces/edit.banner.use-case.interface.js";
import type { CreateBannerRequestDto } from "../dto/create.banner.dto.js";
import type { IBannerRepository } from "../repository/banner.repository.interface.js";
export declare class EditBannerUseCase implements IEditBannerUseCase {
    private readonly _bannerRepository;
    constructor(_bannerRepository: IBannerRepository);
    execute(id: string, dto: CreateBannerRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.banner.use-case.d.ts.map