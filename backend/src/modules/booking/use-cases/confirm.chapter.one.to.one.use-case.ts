import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IConfirmChapterOneToOneBookingUseCase } from "./interfaces/confirm.chapter.one.to.one.booking.use-case.interface.js";
import type { ConfirmChapterOneToOneBookingDto } from "../dto/confirm.chapter.one.to.one.dto.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";

@injectable()
export class ConfirmChapterOneToOneBookingUseCase
  implements IConfirmChapterOneToOneBookingUseCase {

  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepo: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepo: IFacultyRepository,
  ) {}

  async execute(dto: ConfirmChapterOneToOneBookingDto): Promise<void> {
    const booking = await this._bookingRepo.findById(dto.bookingId);

    if (!booking || booking.isDeleted) {
      throw new CustomError(
        ResponseMessages.BOOKING_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (booking.type !== "oneToOne" || booking.mode !== "chapter") {
      throw new CustomError(
        ResponseMessages.INVALID_BOOKING_TYPE,
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (booking.status !== "interested") {
      throw new CustomError(
        ResponseMessages.INVALID_BOOKING_STATE,
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (!booking.chapterId) {
      throw new CustomError(
        ResponseMessages.BOOKING_CHAPTER_ID_INVALID,
        HttpStatusCode.BAD_REQUEST
      );
    }

    // validate chapter slot exists
    const chapterSlot = await this._facultyRepo.getChapterSlot(
      booking.facultyId,
      booking.chapterId
    );
    

    if (!chapterSlot || !chapterSlot.isAvailable) {
      throw new CustomError(
        ResponseMessages.CHAPTER_SLOT_NOT_AVAILABLE,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const facultySlots = await this._facultyRepo.getAllSlots(booking.facultyId)

    if(facultySlots.length === 0){
        throw new CustomError(
        ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
        HttpStatusCode.BAD_REQUEST
      );
    }

    // validate all selected slots
    for (const slotId of dto.slotId) {
      const slot = facultySlots.find(
        (s) => String(s.id) === String(slotId)
      );

      if (!slot || !slot.isAvailable) {
        throw new CustomError(
          ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
          HttpStatusCode.CONFLICT
        );
      }
    }

    // mutation: booking
    const updatedBooking = booking.confirmWithSlots(dto.slotId);
    await this._bookingRepo.save(updatedBooking);

    // mutation: consume slots (atomic, repo-level)
    await this._facultyRepo.consumeSlots(
      booking.facultyId,
      dto.slotId
    );

    await this._bookingRepo.expireOtherBookingsForSlots({
      facultyId: booking.facultyId,
      slotIds:dto.slotId,
      excludeBookingIds: [booking.id!]
    })
  }
}
