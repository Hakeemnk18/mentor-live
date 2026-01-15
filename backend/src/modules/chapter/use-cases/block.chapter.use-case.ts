import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";
import type { IBlockChapterUseCase } from "./interfaces/block.chapter.use-case.interface.js";

@injectable()
export class BlockChapterUseCase implements IBlockChapterUseCase {
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

    if (chapter.isDeleted) {
      throw new CustomError(
        ResponseMessages.CHAPTER_ALREADY_DELETED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const deleted = chapter.delete();
    await this._chapterRepository.save(deleted);
  }
}
