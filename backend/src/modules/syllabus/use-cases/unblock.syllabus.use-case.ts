import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";
import type { IUnblockSyllabusUseCase } from "./interfaces/unblock.syllabus.use-case.interface.js";

/** Make an inactive syllabus active again (admin). */
@injectable()
export class UnblockSyllabusUseCase implements IUnblockSyllabusUseCase {
  constructor(
    @inject("ISyllabusRepository")
    private readonly _syllabusRepository: ISyllabusRepository
  ) {}

  async execute(id: string): Promise<void> {
    const syllabus = await this._syllabusRepository.findById(id);

    if (!syllabus) {
      throw new CustomError(ResponseMessages.SYLLABUS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (!syllabus.isDeleted) {
      throw new CustomError(ResponseMessages.SYLLABUS_NOT_DELETED, HttpStatusCode.BAD_REQUEST);
    }

    await this._syllabusRepository.save(syllabus.restore());
  }
}
