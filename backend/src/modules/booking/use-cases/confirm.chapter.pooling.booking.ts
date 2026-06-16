import { inject, injectable } from "tsyringe";
import type { ConfirmChapterPoolingBookingDto } from "../dto/confirm.chapter.pooling.dto.js";
import type { IConfirmChapterPoolingBookingUseCase } from "./interfaces/confirm.chapter.pooling.booking.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import mongoose from "mongoose";

@injectable()
export class ConfirmChapterPoolingBookingUseCase implements IConfirmChapterPoolingBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepo: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepo: IFacultyRepository,

    @inject("IFacultySlotRepository")
    private readonly _facultySlotRepo: IFacultySlotRepository,
  ) {}
  async execute(dto: ConfirmChapterPoolingBookingDto): Promise<void> {
    const { slotId, facultyId, chapterId } = dto;

    // defensive chapter existence check
    const chapterSlot = await this._facultyRepo.getChapterSlot(
      facultyId,
      chapterId,
    );
    if (!chapterSlot) {
      throw new CustomError(
        ResponseMessages.CHAPTER_SLOT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    // defensive slot existence and availability check — validate each
    // selected time slot belongs to this faculty and is available
    for (const id of slotId) {
      const slot = await this._facultySlotRepo.findById(id);

      if (!slot || slot.facultyId !== facultyId || !slot.isAvailable) {
        throw new CustomError(
          ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
          HttpStatusCode.CONFLICT,
        );
      }
    }

    //fetch booking ids
    const bookingIds = await this._bookingRepo.getBookingIds({
      chapterId: chapterId,
      userIds: chapterSlot.pool,
      facultyId,
      mode: "chapter",
    });
    console.log("booking ids ", bookingIds);

    if (bookingIds.length !== chapterSlot.pool.length) {
      throw new CustomError(
        ResponseMessages.BOOKING_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      //update bookings to confirmed
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
      console.log("booking updated");
      //add slots to bookings
      await this._bookingRepo.addSlotsToBookings(bookingIds, slotId, session);

      console.log("slots added to bookings");
      //consume slots
      for (const id of slotId) {
        await this._facultySlotRepo.consumeSlot(id, session);
      }
      console.log("slot consumed");

      //consume chapter slot
      await this._facultyRepo.consumeChapterSlot(facultyId, chapterId, session);
      console.log("chapter slot consumed");

      await this._bookingRepo.expireOtherBookingsForSlots(
        {
          facultyId: facultyId,
          slotIds: slotId,
          excludeBookingIds: bookingIds,
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
