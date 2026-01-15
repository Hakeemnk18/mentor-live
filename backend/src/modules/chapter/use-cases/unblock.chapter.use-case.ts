import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { IUnblockChapterUseCase } from "./interfaces/unblock.chapter.use-case.interface.js";

@injectable()
export class UnblockChapterUseCase implements IUnblockChapterUseCase {
  constructor(
    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository
  ) {}

  async execute(id: string): Promise<void> {
    const chapter = await this._chapterRepository.findById(id);

    if (!chapter) {
      throw new CustomError(
        ResponseMessages.CHAPTER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (!chapter.isDeleted) {
      throw new CustomError(
        ResponseMessages.CHAPTER_NOT_DELETED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const restored = chapter.restore();
    await this._chapterRepository.save(restored);
  }
}
