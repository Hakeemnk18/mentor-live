import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IBannerRepository } from "../repository/banner.repository.interface.js";
import type { IDeleteBannerUseCase } from "./interfaces/delete.banner.use-case.interface.js";

@injectable()
export class DeleteBannerUseCase implements IDeleteBannerUseCase {
  constructor(
    @inject("IBannerRepository")
    private readonly _bannerRepository: IBannerRepository
  ) {}

  async execute(id: string): Promise<void> {
    //  Ensure banner exists
    const existing = await this._bannerRepository.findById(id);

    if (!existing) {
      throw new CustomError(
        ResponseMessages.BANNER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    //  Hard delete
    await this._bannerRepository.deleteById(id);
  }
}
