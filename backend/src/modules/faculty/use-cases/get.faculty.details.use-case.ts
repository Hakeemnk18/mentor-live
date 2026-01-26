import { inject, injectable } from "tsyringe";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IGetFacultyDetailsUseCase } from "./interfaces/get.faculty.details.use-case.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { FacultyFullAdminView } from "../types/faculty.type.js";

@injectable()
export class GetFacultyDetailsUseCase implements IGetFacultyDetailsUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly facultyRepo: IFacultyRepository,
  ) {}

  async execute(facultyId: string): Promise<FacultyFullAdminView> {
    const facultyDetails =
      await this.facultyRepo.findFacultyFullByIdForAdmin(facultyId);
    if (!facultyDetails) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }
    return facultyDetails;
  }
}
