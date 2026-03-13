import { inject, injectable } from "tsyringe";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { GetChapterBookingDetailsDto } from "../dto/chapter.booking.details.dto.js";
import type { BookingStudentView } from "../type/booking.type.js";
import type { IGetChapterBookingDetailsUseCase } from "./interfaces/get.chapter.booking.details.use-case.interface.js";

@injectable()
export class GetChapterBookingDetailsUseCase implements IGetChapterBookingDetailsUseCase {
    constructor(
        @inject("IBookingRepository")
        private readonly bookingRepository: IBookingRepository,
    ) { }
    async execute(params: GetChapterBookingDetailsDto): Promise<BookingStudentView[]> {
        return await this.bookingRepository.getChapterBookingDetails(params);
    }
}