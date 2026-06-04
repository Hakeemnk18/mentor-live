import type { ConfirmOneToOneBookingDto } from "../dto/confirm.one.to.one.booking.dto.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
import type { IConfirmOneToOneBookingUseCase } from "./interfaces/confirm.one.to.one.booking.use-case.interface.js";
export declare class ConfirmOneToOneBookingUseCase implements IConfirmOneToOneBookingUseCase {
    private readonly _bookingRepo;
    private readonly _facultyRepo;
    constructor(_bookingRepo: IBookingRepository, _facultyRepo: IFacultyRepository);
    execute(dto: ConfirmOneToOneBookingDto): Promise<void>;
}
//# sourceMappingURL=confirm.one.to.one.booking.use-case.d.ts.map