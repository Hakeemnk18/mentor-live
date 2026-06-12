import { inject, injectable } from "tsyringe";

import type {
  ISetFacultySlotAvailabilityDto,
  ISetFacultySlotAvailabilityUseCase,
} from "./interfaces/set.faculty.slot.availability.usecase.interface.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { validateAgainstExisting } from "../../../core/utils/validate.time.slot.js";

@injectable()
export class SetFacultySlotAvailabilityUseCase
  implements ISetFacultySlotAvailabilityUseCase
{
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("IFacultySlotRepository")
    private readonly _facultySlotRepository: IFacultySlotRepository,
  ) {}

  async execute(dto: ISetFacultySlotAvailabilityDto): Promise<void> {
    const { mode, facultyId, isAvailable } = dto;

    /* ── Faculty must exist ── */
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

    /* ════════════════════════════════════════════════
     *  CHAPTER-SLOT MODE  (no cross-disable logic needed
     *  — chapter slots are already variant-scoped)
     * ════════════════════════════════════════════════ */
    if (mode === "chapter") {
      if (!dto.chapterId) {
        throw new CustomError("chapterId is required for chapter mode", HttpStatusCode.BAD_REQUEST);
      }

      const target = faculty.chapterSlots.find(
        (c) => c.chapterId.toString() === dto.chapterId,
      );
      if (!target) {
        throw new CustomError(
          ResponseMessages.SLOT_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }
      if (target.isAvailable === isAvailable) {
        throw new CustomError(
          isAvailable
            ? ResponseMessages.SLOT_ALREADY_UNBLOCKED
            : ResponseMessages.SLOT_ALREADY_BLOCKED,
          HttpStatusCode.BAD_REQUEST,
        );
      }
      if (!isAvailable && target.pool.length > 0) {
        throw new CustomError(
          ResponseMessages.SLOT_POOL_NOT_EMPTY,
          HttpStatusCode.CONFLICT,
        );
      }

      await this._facultyRepository.setChapterSlotAvailability(
        facultyId,
        dto.chapterId,
        isAvailable,
      );
      return;
    }

    /* ════════════════════════════════════════════════
     *  TIME-BASED SLOT MODE  (cross-disable / re-enable)
     * ════════════════════════════════════════════════ */
    if (!dto.slotId) {
      throw new CustomError("slotId is required for slot mode", HttpStatusCode.BAD_REQUEST);
    }

    const slot = await this._facultySlotRepository.findById(dto.slotId);
    if (!slot) {
      throw new CustomError(
        ResponseMessages.SLOT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (slot.isAvailable === isAvailable) {
      throw new CustomError(
        isAvailable
          ? ResponseMessages.SLOT_ALREADY_UNBLOCKED
          : ResponseMessages.SLOT_ALREADY_BLOCKED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (!isAvailable && slot.pool.length > 0) {
      throw new CustomError(
        ResponseMessages.SLOT_POOL_NOT_EMPTY,
        HttpStatusCode.CONFLICT,
      );
    }

    /* ── Unblocking: ensure a 1-hr gap from every other active slot ── */
    if (isAvailable) {
      const siblingSlots = await this._facultySlotRepository.findByFacultyAndVariant(
        slot.facultyId,
        slot.variantId,
      );
      const otherActiveTimes = siblingSlots
        .filter((s) => s.isAvailable && s.id !== slot.id)
        .map((s) => s.time);
      if (!validateAgainstExisting([{ time: slot.time }], otherActiveTimes)) {
        throw new CustomError(
          ResponseMessages.SLOT_UNBLOCK_TIME_CONFLICT,
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    /* Update the target slot */
    await this._facultySlotRepository.setAvailability(dto.slotId, isAvailable);

    /*
     * Cross-disable: when closing this slot, also close every other
     * slot for the same faculty at the same time (different variants).
     *
     * Cross-re-enable: when opening this slot, also re-open every
     * sibling slot at the same time.
     */
    if (!isAvailable) {
      await this._facultySlotRepository.crossDisable(
        slot.facultyId,
        slot.time,
        dto.slotId,
      );
    } else {
      await this._facultySlotRepository.crossEnable(
        slot.facultyId,
        slot.time,
        dto.slotId,
      );
    }
  }
}
