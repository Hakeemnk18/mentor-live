import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Banner } from "../entities/banner.entity.js";

export interface IBannerRepository {
  create(bannerEntity: Banner): Promise<Banner>;
  findById(id: string): Promise<Banner | null>;
  save(bannerEntity: Banner): Promise<Banner>;

  findAllForAdmin(allDoc: IGetAllDocDB): Promise<Banner[]>;
  findAllForUser(): Promise<Banner[]>;

  countDocument(query: Record<string, any>): Promise<number>;
  deleteById(id: string): Promise<void>;
  getAllPriorities(): Promise<number[]>;
}