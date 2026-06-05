import { inject, injectable } from "tsyringe";
import type { AddSlotRequestDto } from "../dtos/add.slot.dto.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IFacultyAddSlotUseCase } from "./interfaces/faculty.add.slot.use-case.interface.js";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import {
  toMinutes,
  validateOnCreate,
} from "../../../core/utils/validate.time.slot.js";

@injectable()
export class FacultyAddSlotUseCase implements IFacultyAddSlotUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("IFacultySlotRepository")
    private readonly _facultySlotRepository: IFacultySlotRepository,
  ) {}

  async execute(facultyId: string, dto: AddSlotRequestDto): Promise<void> {
    /* ── Faculty must exist ── */
    const faculty = await this._facultyRepository.findById(facultyId);

    if (!faculty || faculty.isDeleted) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    /* ── Faculty must teach this variant ── */
    if (!faculty.teachesVariant(dto.variantId)) {
      throw new CustomError(
        ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    /* ── Validate 1-hr gap + end-before-midnight ── */
    if (!validateOnCreate(dto.slots)) {
      throw new CustomError(
        ResponseMessages.SLOT_TIME_NOT_VALID,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    /* ── Sort and persist ── */
    const sortedSlots = [...dto.slots].sort(
      (a, b) => toMinutes(a.time) - toMinutes(b.time),
    );

    await this._facultySlotRepository.createMany(
      sortedSlots.map((s) => ({
        facultyId,
        variantId: dto.variantId,
        time: new Date(s.time),
      })),
    );
  }
}
