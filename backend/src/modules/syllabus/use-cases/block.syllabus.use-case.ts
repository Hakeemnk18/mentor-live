import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";
import type { IBlockSyllabusUseCase } from "./interfaces/block.syllabus.use-case.interface.js";

/** Make a syllabus inactive (admin). */
@injectable()
export class BlockSyllabusUseCase implements IBlockSyllabusUseCase {
  constructor(
    @inject("ISyllabusRepository")
    private readonly _syllabusRepository: ISyllabusRepository
  ) {}

  async execute(id: string): Promise<void> {
    const syllabus = await this._syllabusRepository.findById(id);

    if (!syllabus) {
      throw new CustomError(ResponseMessages.SYLLABUS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (syllabus.isDeleted) {
      throw new CustomError(ResponseMessages.SYLLABUS_ALREADY_DELETED, HttpStatusCode.BAD_REQUEST);
    }

    await this._syllabusRepository.save(syllabus.delete());
  }
}
