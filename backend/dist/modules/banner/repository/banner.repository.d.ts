import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Banner } from "../entities/banner.entity.js";
import type { IBannerRepository } from "./banner.repository.interface.js";
export declare class BannerRepository implements IBannerRepository {
    create(bannerEntity: Banner): Promise<Banner>;
    findById(id: string): Promise<Banner | null>;
    save(bannerEntity: Banner): Promise<Banner>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<Banner[]>;
    findAllForUser(): Promise<Banner[]>;
    countDocument(query: Record<string, any>): Promise<number>;
    deleteById(id: string): Promise<void>;
    getActivePriorities(excludeId?: string): Promise<number[]>;
}
//# sourceMappingURL=banner.repository.d.ts.map