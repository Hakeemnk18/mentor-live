import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IUnblockFacultyUseCase } from "./interfaces/unblock.faculty.interface.js";

@injectable()
export class UnblockFacultyUseCase implements IUnblockFacultyUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository
  ) {}

  async execute(facultyId: string): Promise<void> {
    // 1️⃣ Fetch faculty
    const faculty = await this._facultyRepository.findById(facultyId);

    if (!faculty) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    // 2️⃣ Deleted faculty cannot be unblocked
    if (!faculty.isDeleted) {
      throw new CustomError(
        ResponseMessages.FACULTY_ALREADY_UNBLOCKED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const updatedFaculty = faculty.markAsUnblocked();

    await this._facultyRepository.save(updatedFaculty);
  }
}
