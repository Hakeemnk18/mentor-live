import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { IBlockFacultyUseCase } from "./interfaces/block.faculty.use-case.interface.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";


@injectable()
export class BlockFacultyUseCase implements IBlockFacultyUseCase {
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

    // 2️⃣ Deleted faculty cannot be blocked
    if (faculty.isDeleted) {
      throw new CustomError(
        ResponseMessages.FACULTY_ALREADY_BLOCKED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const updatedFaculty = faculty.markAsDeleted();

    await this._facultyRepository.save(updatedFaculty);
  }
}
