import { inject, injectable } from "tsyringe";
import type { IGetChapterNameUseCase } from "./interfaces/get.chapter.name.use-case.interface.js";
import type { IChapterRepository } from "../repositories/chapter.repository.interface.js";

@injectable()
export class GetChapterNameUseCase implements IGetChapterNameUseCase {
    constructor(
        @inject("IChapterRepository")
        private readonly _chapterRepository: IChapterRepository,
      ) {}

    async execute(): Promise<{ id: string; name: string }[]> {
    const chapters = await this._chapterRepository.findAllNames();
    return chapters;
  }
}
