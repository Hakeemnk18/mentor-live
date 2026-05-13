import { inject, injectable } from "tsyringe";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { BookingStudentView } from "../type/booking.type.js";
import type { IGetSlotBookingDetailsUseCase } from "./interfaces/get.slot.booking.details.use-case.interface.js";
import type { GetSlotBookingDetailsDto } from "../dto/slot.booking.details.dto.js";

@injectable()
export class GetSlotBookingDetailsUseCase implements IGetSlotBookingDetailsUseCase {
    constructor(
        @inject("IBookingRepository")
        private readonly bookingRepository: IBookingRepository,
    ) { }

    async execute(params: GetSlotBookingDetailsDto): Promise<BookingStudentView[]> {
        return await this.bookingRepository.getSlotBookingDetails(params);
    }
}