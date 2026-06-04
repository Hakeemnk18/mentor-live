import type { IConfirmPoolingBookingUseCase } from "./interfaces/confirm.pooling.booking.use-case.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { ConfirmPoolingBookingDto } from "../dto/confirm.pooling.booking.dto.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
export declare class ConfirmPoolingBookingUseCase implements IConfirmPoolingBookingUseCase {
    private readonly _bookingRepo;
    private readonly _facultyRepo;
    constructor(_bookingRepo: IBookingRepository, _facultyRepo: IFacultyRepository);
    execute(dto: ConfirmPoolingBookingDto): Promise<void>;
}
//# sourceMappingURL=confirm.pooling.booking.use-case.d.ts.map