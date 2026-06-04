import type { GetChapterBookingDetailsDto } from "../../dto/chapter.booking.details.dto.js";
import type { BookingStudentView } from "../../type/booking.type.js";
export interface IGetChapterBookingDetailsUseCase {
    execute(params: GetChapterBookingDetailsDto): Promise<BookingStudentView[]>;
}
//# sourceMappingURL=get.chapter.booking.details.use-case.interface.d.ts.map