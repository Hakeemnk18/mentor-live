import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { GetChapterBookingDetailsDto } from "../dto/chapter.booking.details.dto.js";
import type { BookingStudentView } from "../type/booking.type.js";
import type { IGetChapterBookingDetailsUseCase } from "./interfaces/get.chapter.booking.details.use-case.interface.js";
export declare class GetChapterBookingDetailsUseCase implements IGetChapterBookingDetailsUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(params: GetChapterBookingDetailsDto): Promise<BookingStudentView[]>;
}
//# sourceMappingURL=get.chapter.booking.details.use-case.d.ts.map