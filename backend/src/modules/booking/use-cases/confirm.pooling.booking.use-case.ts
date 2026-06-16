import { inject, injectable } from "tsyringe";
import type { IConfirmPoolingBookingUseCase } from "./interfaces/confirm.pooling.booking.use-case.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { ConfirmPoolingBookingDto } from "../dto/confirm.pooling.booking.dto.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import mongoose from "mongoose";

@injectable()
export class ConfirmPoolingBookingUseCase
  implements IConfirmPoolingBookingUseCase
{
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepo: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepo: IFacultyRepository,

    @inject("IFacultySlotRepository")
    private readonly _slotRepo: IFacultySlotRepository,
  ) {}

  async execute(dto: ConfirmPoolingBookingDto): Promise<void> {
    const { slotId, facultyId } = dto;

    /* ── Slot must exist, be available, and have students ── */
    const slot = await this._slotRepo.findById(slotId);

    if (!slot || !slot.isAvailable || slot.pool.length === 0) {
      throw new CustomError(
        ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    /* ── Fetch booking IDs for this pool ── */
    const bookingIds = await this._bookingRepo.getBookingIds({
      slotIds: [slotId],
      userIds: slot.pool,
      facultyId,
      mode: "slot",
    });

    if (bookingIds.length !== slot.pool.length) {
      throw new CustomError(ResponseMessages.BOOKING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      /* 1. Confirm all bookings in this pool */
      const updatedCount = await this._bookingRepo.confirmPoolingBookings(
        bookingIds,
        session,
      );
      if (updatedCount !== bookingIds.length) {
        throw new CustomError(
          ResponseMessages.BOOKING_UPDATE_FAILED,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
      }

      /* 2. Consume the slot (isAvailable → false, pool → []) */
      const { time } = await this._slotRepo.consumeSlot(slotId, session);

      /* 3. Cross-disable: close every other variant's slot at the same time */
      const crossDisabledIds = await this._slotRepo.crossDisable(
        facultyId,
        time,
        slotId,
      );

      /* 4. Expire interested bookings for cross-disabled slots */
      if (crossDisabledIds.length > 0) {
        await this._bookingRepo.expireOtherBookingsForSlots(
          {
            facultyId,
            slotIds: crossDisabledIds,
            excludeBookingIds: bookingIds,
          },
          session,
        );
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
