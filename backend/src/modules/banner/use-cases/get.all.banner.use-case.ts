import { inject, injectable } from "tsyringe";
import type { IBannerRepository } from "../repository/banner.repository.interface.js";
import type { Banner } from "../entities/banner.entity.js";
import type { IGetAllBannerUseCase } from "./interfaces/get.all.banner.use-case.interface.js";

@injectable()
export class GetAllBannerUseCase implements IGetAllBannerUseCase {
  constructor(
    @inject("IBannerRepository")
    private readonly _bannerRepository: IBannerRepository,
  ) {}

  /** Returns up to 5 visible banners sorted by priority for the user-facing carousel */
  async execute(): Promise<Banner[]> {
    return this._bannerRepository.findAllForUser();
  }
}
