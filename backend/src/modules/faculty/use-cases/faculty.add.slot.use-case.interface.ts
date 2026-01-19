import { inject, injectable } from "tsyringe";
import type { AddSlotRequestDto } from "../dtos/add.slot.dto.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IFacultyAddSlotUseCase } from "./interfaces/faculty.add.slot.use-case.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import {
  toMinutes,
  validateOnCreate,
  type ISlots,
} from "../../../core/utils/validate.time.slot.js";

@injectable()
export class FacultyAddSlotUseCase implements IFacultyAddSlotUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,
  ) {}
  async execute(facultyId: string, dto: AddSlotRequestDto): Promise<void> {
    /* ---------- fetch faculty ---------- */
    let faculty = await this._facultyRepository.findById(facultyId);

    if (!faculty || faculty.isDeleted) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    /* ---------- valid time ---------- */
    const lastSlot = faculty.slots.at(-1);
    const slotsToValidate: ISlots[] = [
      ...(lastSlot ? [{ time: lastSlot.time }] : []),
      ...dto.slots,
    ];
    if (!validateOnCreate(slotsToValidate)) {
      throw new CustomError(
        ResponseMessages.SLOT_TIME_NOT_VALID,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    /* ---------- sort slot ---------- */
    const sortedSlots = [...dto.slots].sort(
      (a, b) => toMinutes(a.time) - toMinutes(b.time),
    );

    /* ---------- normalize times ---------- */
    const normalizedSlots = sortedSlots.map((s) => ({
      time: new Date(s.time),
    }));

    /* ---------- add slots via entity ---------- */

    faculty = faculty.addSlots(normalizedSlots);

    /* ---------- persist ---------- */
    await this._facultyRepository.save(faculty);
  }
}
