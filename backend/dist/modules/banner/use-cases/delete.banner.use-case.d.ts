import type { IBannerRepository } from "../repository/banner.repository.interface.js";
import type { IDeleteBannerUseCase } from "./interfaces/delete.banner.use-case.interface.js";
export declare class DeleteBannerUseCase implements IDeleteBannerUseCase {
    private readonly _bannerRepository;
    constructor(_bannerRepository: IBannerRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=delete.banner.use-case.d.ts.map