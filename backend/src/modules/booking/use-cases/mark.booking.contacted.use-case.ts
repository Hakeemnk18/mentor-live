import { inject, injectable } from "tsyringe";
import type { MarkBookingContactedDto } from "../dto/mark.booking.contacted.dto.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IMarkBookingContactedUseCase } from "./interfaces/mark.booking.contacted.use-case.interface.js";

@injectable()
export class MarkBookingContactedUseCase
  implements IMarkBookingContactedUseCase
{
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepo: IBookingRepository,
  ) {}

  async execute(dto: MarkBookingContactedDto): Promise<void> {
    const booking = await this._bookingRepo.findById(dto.bookingId);

    if (!booking || booking.isDeleted) {
      throw new CustomError(ResponseMessages.BOOKING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (booking.isContacted) {
      throw new CustomError(ResponseMessages.BOOKING_ALREADY_CONTACTED, HttpStatusCode.BAD_REQUEST);
    }

    await this._bookingRepo.save(booking.markAsContacted());
  }
}
