import { inject, injectable } from "tsyringe";
import type { ConfirmOneToOneBookingDto } from "../dto/confirm.one.to.one.booking.dto.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import type { IConfirmOneToOneBookingUseCase } from "./interfaces/confirm.one.to.one.booking.use-case.interface.js";
import mongoose from "mongoose";

@injectable()
export class ConfirmOneToOneBookingUseCase
  implements IConfirmOneToOneBookingUseCase
{
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepo: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepo: IFacultyRepository,

    @inject("IFacultySlotRepository")
    private readonly _slotRepo: IFacultySlotRepository,
  ) {}

  async execute(dto: ConfirmOneToOneBookingDto): Promise<void> {
    const booking = await this._bookingRepo.findById(dto.bookingId);

    if (!booking || booking.isDeleted) {
      throw new CustomError(ResponseMessages.BOOKING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (booking.type !== "oneToOne" || booking.mode !== "slot") {
      throw new CustomError(ResponseMessages.INVALID_BOOKING_TYPE, HttpStatusCode.BAD_REQUEST);
    }

    if (booking.status !== "interested") {
      throw new CustomError(ResponseMessages.INVALID_BOOKING_STATE, HttpStatusCode.BAD_REQUEST);
    }

    const slotId = booking.slotId?.[0]!;
    const slot = await this._slotRepo.findById(slotId);

    if (!slot || !slot.isAvailable) {
      throw new CustomError(ResponseMessages.SLOT_TIME_NOT_AVAILABLE, HttpStatusCode.BAD_REQUEST);
    }

    const confirmedBooking = booking.confirm();

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      /* 1. Confirm the booking */
      await this._bookingRepo.save(confirmedBooking, session);

      /* 2. Consume the slot (isAvailable → false, pool → []) */
      const { time, facultyId } = await this._slotRepo.consumeSlot(slotId, session);

      /* 3. Cross-disable: close all other variant slots at the same time */
      const crossDisabledIds = await this._slotRepo.crossDisable(
        facultyId,
        time,
        slotId,
      );

      /* 4. Expire interested bookings for THIS slot (other students who were
            interested in the same one-to-one slot) */
      await this._bookingRepo.expireOtherBookingsForSlots(
        {
          facultyId,
          slotIds: [slotId, ...crossDisabledIds],
          excludeBookingIds: [booking.id!],
        },
        session,
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
