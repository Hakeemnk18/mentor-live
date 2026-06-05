import { inject, injectable } from "tsyringe";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { FacultyDetailsViewForUser } from "../types/faculty.type.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { IGetFacultyDetailsBySlotUseCase } from "./interfaces/get.faculty.details.by.slot.use-case.interface.js";

@injectable()
export class GetFacultyDetailsBySlotUseCase
  implements IGetFacultyDetailsBySlotUseCase
{
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,
  ) {}

  async execute(
    facultyId: string,
    variantId: string,
    slotId?: string,
  ): Promise<FacultyDetailsViewForUser> {
    let faculty: FacultyDetailsViewForUser | null;

    if (slotId) {
      /* Specific slot requested */
      faculty = await this._facultyRepository.findFacultyWithSlot(
        facultyId,
        slotId,
        variantId,
      );
    } else {
      /* Return first available slot for this variant */
      faculty = await this._facultyRepository.findFacultyWithFirstAvailableSlot(
        facultyId,
        variantId,
      );
    }

    if (!faculty) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    return faculty;
  }
}
