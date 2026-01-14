import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import type { IEditSubjectUseCase } from "./interfaces/edit.subject.use-case.interface.js";

@injectable()
export class EditSubjectUseCase implements IEditSubjectUseCase {
  constructor(
    @inject("ISubjectRepository")
    private readonly _subjectRepository: ISubjectRepository
  ) {}

  async execute(id: string, name: string): Promise<void> {
    const normalizedName = name.trim();

    // 1️⃣ Fetch subject
    const existingSubject = await this._subjectRepository.findById(id);

    if (!existingSubject) {
      throw new CustomError(
        ResponseMessages.SUBJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    // 2️⃣ If name is changing, check for duplicates
    if (existingSubject.name !== normalizedName) {
      const duplicate = await this._subjectRepository.findByName(normalizedName);

      if (duplicate && !duplicate.isDeleted) {
        throw new CustomError(
          ResponseMessages.SUBJECT_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST
        );
      }
    }

    // 3️⃣ Rename via domain
    const renamed = existingSubject.rename(normalizedName);

    // 4️⃣ Persist
    await this._subjectRepository.save(renamed);
  }
}
