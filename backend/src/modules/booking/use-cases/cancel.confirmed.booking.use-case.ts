import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import type { ICancelConfirmedBookingUseCase } from "./interfaces/cancel.confirmed.booking.use-case.interface.js";
import mongoose from "mongoose";

@injectable()
export class CancelConfirmedBookingUseCase
  implements ICancelConfirmedBookingUseCase
{
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepo: IBookingRepository,

    @inject("IFacultySlotRepository")
    private readonly _slotRepo: IFacultySlotRepository,
  ) {}

  async execute(bookingId: string): Promise<void> {
    const booking = await this._bookingRepo.findById(bookingId);

    if (!booking || booking.isDeleted) {
      throw new CustomError(ResponseMessages.BOOKING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (booking.status !== "confirmed") {
      throw new CustomError(
        "Only confirmed bookings can be cancelled via this route",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (booking.mode !== "slot") {
      throw new CustomError(
        "Chapter bookings do not require slot re-enable",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const slotId = booking.slotId?.[0];
    if (!slotId) {
      throw new CustomError(ResponseMessages.SLOT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      /* 1. Cancel the booking */
      const cancelled = booking.delete();
      await this._bookingRepo.save(
        new (booking.constructor as any)({ ...cancelled, status: "cancelled" }),
        session,
      );

      /*
       * 2. Re-open the slot (isAvailable → true).
       *    reOpenSlot returns the slot's time + facultyId so we can cross-enable.
       */
      const { time, facultyId } = await this._slotRepo.reOpenSlot(slotId, session);

      /*
       * 3. Cross-re-enable: open all sibling slots at the same time
       *    (the ones that were cross-disabled when this booking was confirmed).
       */
      await this._slotRepo.crossEnable(facultyId, time, slotId);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
