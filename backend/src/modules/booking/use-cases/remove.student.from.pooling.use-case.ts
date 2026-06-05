import { inject, injectable } from "tsyringe";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { RemoveUserFromPoolDto } from "../dto/remove.student.from.pooling.dto.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import mongoose from "mongoose";
import type { IRemoveStudentFromPoolingUseCase } from "./interfaces/remove.student.from.pooling.use-case.interface.js";

@injectable()
export class RemoveStudentFromPoolingUseCase
  implements IRemoveStudentFromPoolingUseCase
{
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("IFacultySlotRepository")
    private readonly _slotRepository: IFacultySlotRepository,
  ) {}

  async execute(dto: RemoveUserFromPoolDto): Promise<void> {
    /* ── Find the booking ── */
    const query: Record<string, any> = {
      userId: dto.userId,
      facultyId: dto.facultyId,
      type: "pooling",
      status: "interested",
      mode: dto.mode,
      isDeleted: false,
    };

    if (dto.mode === "slot") {
      query.slotId = [dto.slotId];
    } else if (dto.mode === "chapter") {
      query.chapterId = dto.chapterId;
    }

    const booking = await this._bookingRepository.findByQuery(query);
    if (!booking) {
      throw new CustomError(ResponseMessages.BOOKING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      if (dto.mode === "slot") {
        /* Remove from FacultySlot pool */
        await this._slotRepository.removeFromPool(
          dto.slotId!,
          dto.userId,
          session,
        );
      } else {
        /* Remove from embedded chapter slot pool */
        await this._facultyRepository.removeUserFromPool(dto, session);
      }

      await this._bookingRepository.cancelBookingsByIds([booking.id!], session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
