import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import type { IBlockSubjectUseCase } from "./interfaces/block.subject.use-case.interface.js";

/** Make a subject inactive (admin). */
@injectable()
export class BlockSubjectUseCase implements IBlockSubjectUseCase {
  constructor(
    @inject("ISubjectRepository")
    private readonly _subjectRepository: ISubjectRepository
  ) {}

  async execute(id: string): Promise<void> {
    const subject = await this._subjectRepository.findById(id);

    if (!subject) {
      throw new CustomError(ResponseMessages.SUBJECT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (subject.isDeleted) {
      throw new CustomError(ResponseMessages.SUBJECT_ALREADY_DELETED, HttpStatusCode.BAD_REQUEST);
    }

    await this._subjectRepository.save(subject.delete());
  }
}
