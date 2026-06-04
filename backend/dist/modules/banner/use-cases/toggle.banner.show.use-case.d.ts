import type { IBannerRepository } from "../repository/banner.repository.interface.js";
import type { IToggleBannerShowUseCase } from "./interfaces/toggle.banner.show.use-case.interface.js";
export declare class ToggleBannerShowUseCase implements IToggleBannerShowUseCase {
    private readonly _bannerRepository;
    constructor(_bannerRepository: IBannerRepository);
    execute(id: string, isShow: boolean, priority?: number): Promise<void>;
}
//# sourceMappingURL=toggle.banner.show.use-case.d.ts.map