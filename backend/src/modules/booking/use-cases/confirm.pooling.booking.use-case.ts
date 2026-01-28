import { inject, injectable } from "tsyringe";
import type { IConfirmPoolingBookingUseCase } from "./interfaces/confirm.pooling.booking.use-case.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { ConfirmPoolingBookingDto } from "../dto/confirm.pooling.booking.dto.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import mongoose, { Types } from "mongoose";
const { ObjectId } = Types;

@injectable()
export class ConfirmPoolingBookingUseCase implements IConfirmPoolingBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepo: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepo: IFacultyRepository,
  ) {}

  async execute(dto: ConfirmPoolingBookingDto): Promise<void> {
    const { slotId, facultyId } = dto;

    // defensive existence check
    const slot = await this._facultyRepo.getSlot(facultyId, slotId);

    if (!slot || !slot.isAvailable || slot.pool.length === 0) {
      throw new CustomError(
        ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    
    //fetch booking ids
    const bookingIds = await this._bookingRepo.getBookingIds({
      slotIds: [slotId],
      userIds: slot.pool,
      facultyId,
    });
    console.log("booking ids ", bookingIds);

    if (bookingIds.length !== slot.pool.length) {
      throw new CustomError(
        ResponseMessages.BOOKING_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }
    const session = await mongoose.startSession();
    try {
      
      session.startTransaction();
      const updatedCount =
        await this._bookingRepo.confirmPoolingBookings(bookingIds, session);

      if (updatedCount !== bookingIds.length) {
        throw new CustomError(
          ResponseMessages.BOOKING_UPDATE_FAILED,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
      }
      console.log("booking updated")
      await this._facultyRepo.consumeSlot(facultyId, slotId, session);
      console.log("slot consumed")

      await this._bookingRepo.expireOtherBookingsForSlots({
        facultyId: facultyId,
        slotIds: [slotId],
        excludeBookingIds: bookingIds,
        
      }, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
