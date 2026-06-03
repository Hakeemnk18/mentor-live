import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IBannerRepository } from "../repository/banner.repository.interface.js";
import type { IToggleBannerShowUseCase } from "./interfaces/toggle.banner.show.use-case.interface.js";

@injectable()
export class ToggleBannerShowUseCase implements IToggleBannerShowUseCase {
  constructor(
    @inject("IBannerRepository")
    private readonly _bannerRepository: IBannerRepository,
  ) {}

  async execute(id: string, isShow: boolean, priority?: number): Promise<void> {
    const existing = await this._bannerRepository.findById(id);
    if (!existing) {
      throw new CustomError(
        ResponseMessages.BANNER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (isShow) {
      /* Priority is required to show a banner */
      const effectivePriority = priority ?? existing.priority;

      if (effectivePriority === null || effectivePriority === undefined) {
        throw new CustomError(
          "Priority (1–5) is required to make the banner visible",
          HttpStatusCode.BAD_REQUEST,
        );
      }

      if (effectivePriority < 1 || effectivePriority > 5) {
        throw new CustomError(
          ResponseMessages.BANNER_PRIORITY_INVALID,
          HttpStatusCode.BAD_REQUEST,
        );
      }

      /* Check uniqueness among other visible banners */
      const taken = await this._bannerRepository.getActivePriorities(id);
      if (taken.includes(effectivePriority)) {
        throw new CustomError(
          ResponseMessages.BANNER_PRIORITY_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST,
        );
      }

      await this._bannerRepository.save(
        existing.show(effectivePriority),
      );
    } else {
      await this._bannerRepository.save(existing.hide());
    }
  }
}
