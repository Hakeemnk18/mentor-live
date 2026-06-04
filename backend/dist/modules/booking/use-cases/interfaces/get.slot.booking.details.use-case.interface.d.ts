import type { GetSlotBookingDetailsDto } from "../../dto/slot.booking.details.dto.js";
import type { BookingStudentView } from "../../type/booking.type.js";
export interface IGetSlotBookingDetailsUseCase {
    execute(params: GetSlotBookingDetailsDto): Promise<BookingStudentView[]>;
}
//# sourceMappingURL=get.slot.booking.details.use-case.interface.d.ts.map