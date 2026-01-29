import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IStudentRepository } from "../repositories/student.repository.interface.js";
import type { IBlockStudentUseCase } from "./interfaces/block.student.interface.js";

@injectable()
export class BlockStudentUseCase implements IBlockStudentUseCase {
  constructor(
    @inject("IStudentRepository")
    private readonly _studentRepository: IStudentRepository
  ) {}

  async execute(studentId: string): Promise<void> {
    // 1️⃣ Fetch student
    const student = await this._studentRepository.findById(studentId);

    if (!student) {
      throw new CustomError(
        ResponseMessages.STUDENT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    // 2️⃣ Deleted student cannot be blocked
    if (student.isDeleted) {
      throw new CustomError(
        ResponseMessages.STUDENT_ALREADY_BLOCKED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const updatedStudent = student.delete()

    await this._studentRepository.save(updatedStudent)

    
  }
}
