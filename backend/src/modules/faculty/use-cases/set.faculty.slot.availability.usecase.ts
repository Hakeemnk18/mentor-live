import { inject, injectable } from "tsyringe";

import type { ISetFacultySlotAvailabilityUseCase } from "./interfaces/set.faculty.slot.availability.usecase.interface.js";
import type { SetSlotAvailabilityDto } from "../types/faculty.type.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

@injectable()
export class SetFacultySlotAvailabilityUseCase implements ISetFacultySlotAvailabilityUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,
  ) {}

  async execute(
    dto: SetSlotAvailabilityDto
  ): Promise<void> {
    const { facultyId, mode, slotId, chapterId, isAvailable } = dto;

    const faculty = await this._facultyRepository.findById(facultyId);

    if (!faculty) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (faculty.isDeleted) {
      throw new CustomError(
        ResponseMessages.FACULTY_BLOCKED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // 🔹 Extract slot safely (read-only)
    
    const target =
      mode === "slot"
        ? faculty.slots.find((s) => s.id === slotId)
        : faculty.chapterSlots.find(
            (c) => c.chapterId.toString() === chapterId,
          );
    
    if (!target) {
      throw new CustomError(
        ResponseMessages.SLOT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    // ✅ Validation 1: already blocked / unblocked
    if (target.isAvailable === isAvailable) {
      throw new CustomError(
        isAvailable
          ? ResponseMessages.SLOT_ALREADY_UNBLOCKED
          : ResponseMessages.SLOT_ALREADY_BLOCKED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // ✅ Validation 2: pool must be empty when blocking
    if (!isAvailable && target.pool.length > 0) {
      throw new CustomError(
        ResponseMessages.SLOT_POOL_NOT_EMPTY,
        HttpStatusCode.CONFLICT,
      );
    }

    // 🔹 Atomic update
    await this._facultyRepository.setSlotAvailability(dto);
  }
}