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
    private readonly _bannerRepository: IBannerRepository
  ) {}

  async execute(id: string, dto: CreateBannerRequestDto

  ): Promise<void> {
    //  Fetch existing banner
    const existing = await this._bannerRepository.findById(id);

    if (!existing) {
      throw new CustomError(
        ResponseMessages.BANNER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    //  Priority uniqueness check (exclude self)
    if (existing.priority !== dto.priority) {
      const priorities = await this._bannerRepository.getAllPriorities();

      const conflict = priorities.some(
        (priority) => priority === dto.priority
      );

      if (conflict) {
        throw new CustomError(
          ResponseMessages.BANNER_PRIORITY_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST
        );
      }
    }

    //  Rebuild domain entity (immutable update)
    const updated = new Banner({
      id: existing.id,
      image: dto.image,
      description: dto.description,
      priority: dto.priority,
      isDeleted: existing.isDeleted,
    });

    //  Persist
    await this._bannerRepository.save(updated);
  }
}
