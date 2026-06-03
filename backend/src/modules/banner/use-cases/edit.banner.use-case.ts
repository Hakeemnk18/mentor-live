import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Banner } from "../entities/banner.entity.js";
import type { IEditBannerUseCase } from "./interfaces/edit.banner.use-case.interface.js";
import type { CreateBannerRequestDto } from "../dto/create.banner.dto.js";
import type { IBannerRepository } from "../repository/banner.repository.interface.js";

@injectable()
export class EditBannerUseCase implements IEditBannerUseCase {
  constructor(
    @inject("IBannerRepository")
    private readonly _bannerRepository: IBannerRepository,
  ) {}

  async execute(id: string, dto: CreateBannerRequestDto): Promise<void> {
    const existing = await this._bannerRepository.findById(id);

    if (!existing) {
      throw new CustomError(
        ResponseMessages.BANNER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    /* If visible with a priority, check uniqueness (excluding self) */
    const newIsShow = dto.isShow ?? existing.isShow;
    const newPriority = dto.priority ?? existing.priority;

    if (newIsShow && newPriority != null) {
      const taken = await this._bannerRepository.getActivePriorities(id);
      if (taken.includes(newPriority)) {
        throw new CustomError(
          ResponseMessages.BANNER_PRIORITY_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    const updated = new Banner({
      id: existing.id,
      image: dto.image,
      description: dto.description,
      priority: dto.priority ?? existing.priority,
      isShow: dto.isShow ?? existing.isShow,
      isClickable: dto.isClickable ?? existing.isClickable,
      buttonText: dto.buttonText ?? existing.buttonText,
      isDeleted: existing.isDeleted,
    });

    await this._bannerRepository.save(updated);
  }
}
