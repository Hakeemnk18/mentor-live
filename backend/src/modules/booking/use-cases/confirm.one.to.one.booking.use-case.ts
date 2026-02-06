import { inject, injectable } from "tsyringe";
import type { ConfirmOneToOneBookingDto } from "../dto/confirm.one.to.one.booking.dto.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { IConfirmOneToOneBookingUseCase } from "./interfaces/confirm.one.to.one.booking.use-case.interface.js";

@injectable()
export class ConfirmOneToOneBookingUseCase
  implements IConfirmOneToOneBookingUseCase {

  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepo: IBookingRepository,

    @inject("IFacultyRepository")
    private readonly _facultyRepo: IFacultyRepository,

   
  ) {}

  async execute(dto: ConfirmOneToOneBookingDto): Promise<void> {
    const booking = await this._bookingRepo.findById(dto.bookingId);

    if (!booking || booking.isDeleted) {
      throw new CustomError(
        ResponseMessages.BOOKING_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (booking.type !== "oneToOne"  || booking.mode !== "slot") {
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

    // defensive existence check
    const slot = await this._facultyRepo.getSlot(
      booking.facultyId,
      booking.slotId?.[0]!
    );
   
   
    if (!slot || !slot.isAvailable) {
      throw new CustomError(
        ResponseMessages.SLOT_TIME_NOT_AVAILABLE,
        HttpStatusCode.BAD_REQUEST
      );
    }

    // // mutations
    const updateBooking = booking.confirm(); 
    await this._bookingRepo.save(updateBooking);
    
    await this._facultyRepo.consumeSlot(booking.facultyId, booking.slotId?.[0]! )
    
    
    await this._bookingRepo.expireOtherBookingsForSlots({
      facultyId: booking.facultyId,
      slotIds:[ booking.slotId?.[0]!],
      excludeBookingIds: [booking.id!]
    })
    
    
  }
}