import type { Banner } from "../../entities/banner.entity.js";

export interface IGetAllBannerUseCase {
  execute(): Promise<Banner[]>;
}