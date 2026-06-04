import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { BookingStudentView } from "../type/booking.type.js";
import type { IGetSlotBookingDetailsUseCase } from "./interfaces/get.slot.booking.details.use-case.interface.js";
import type { GetSlotBookingDetailsDto } from "../dto/slot.booking.details.dto.js";
export declare class GetSlotBookingDetailsUseCase implements IGetSlotBookingDetailsUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(params: GetSlotBookingDetailsDto): Promise<BookingStudentView[]>;
}
//# sourceMappingURL=get.slot.booking.details.use-case.d.ts.map