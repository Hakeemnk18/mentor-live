import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Banner } from "../entities/banner.entity.js";
import type { ICreateBannerUseCase } from "./interfaces/create.banner.use-case.interface.js";
import type { CreateBannerRequestDto } from "../dto/create.banner.dto.js";
import type { IBannerRepository } from "../repository/banner.repository.interface.js";

@injectable()
export class CreateBannerUseCase implements ICreateBannerUseCase {
  constructor(
    @inject("IBannerRepository")
    private readonly _bannerRepository: IBannerRepository,
  ) {}

  async execute(dto: CreateBannerRequestDto): Promise<void> {
    /* If banner is set to visible, priority must be unique among visible banners */
    if (dto.isShow && dto.priority != null) {
      const taken = await this._bannerRepository.getActivePriorities();
      if (taken.includes(dto.priority)) {
        throw new CustomError(
          ResponseMessages.BANNER_PRIORITY_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    const bannerEntity = new Banner({
      id: null,
      image: dto.image,
      description: dto.description,
      priority: dto.priority ?? null,
      isShow: dto.isShow ?? false,
      isClickable: dto.isClickable ?? false,
      buttonText: dto.buttonText ?? "Get In Touch",
      isDeleted: false,
    });

    const banner = await this._bannerRepository.create(bannerEntity);

    if (!banner) {
      throw new CustomError(
        ResponseMessages.BANNER_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
