import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import type { IUnblockSubjectUseCase } from "./interfaces/unblock.subject.use-case.interface.js";

/** Make an inactive subject active again (admin). */
@injectable()
export class UnblockSubjectUseCase implements IUnblockSubjectUseCase {
  constructor(
    @inject("ISubjectRepository")
    private readonly _subjectRepository: ISubjectRepository
  ) {}

  async execute(id: string): Promise<void> {
    const subject = await this._subjectRepository.findById(id);

    if (!subject) {
      throw new CustomError(ResponseMessages.SUBJECT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (!subject.isDeleted) {
      throw new CustomError(ResponseMessages.SUBJECT_NOT_DELETED, HttpStatusCode.BAD_REQUEST);
    }

    await this._subjectRepository.save(subject.restore());
  }
}
