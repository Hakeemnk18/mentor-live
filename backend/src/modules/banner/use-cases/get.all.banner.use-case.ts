import { inject, injectable } from "tsyringe";
import type { IBannerRepository } from "../repository/banner.repository.interface.js";
import type { Banner } from "../entities/banner.entity.js";
import type { IGetAllBannerUseCase } from "./interfaces/get.all.banner.use-case.interface.js";

@injectable()
export class GetAllBannerUseCase
  implements IGetAllBannerUseCase
{
  constructor(
    @inject("IBannerRepository")
    private readonly _bannerRepository: IBannerRepository
  ) {}

  async execute(): Promise<Banner[]> {
    return await this._bannerRepository.findAllForUser();
  }
}