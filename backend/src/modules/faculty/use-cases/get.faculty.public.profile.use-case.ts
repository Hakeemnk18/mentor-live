import { inject, injectable } from "tsyringe";
import type { IGetFacultyPublicProfileUseCase } from "./interfaces/get.faculty.public.profile.use-case.interface.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { FacultyPublicProfileView } from "../types/faculty.type.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

@injectable()
export class GetFacultyPublicProfileUseCase
  implements IGetFacultyPublicProfileUseCase
{
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,
  ) {}

  async execute(
    facultyId: string,
    classId?: string,
    syllabusId?: string,
  ): Promise<FacultyPublicProfileView> {
    const profile = await this._facultyRepository.findFacultyPublicProfile(
      facultyId,
      classId,
      syllabusId,
    );

    if (!profile) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    return profile;
  }
}
