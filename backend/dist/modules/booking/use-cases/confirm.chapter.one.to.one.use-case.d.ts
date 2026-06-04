import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IConfirmChapterOneToOneBookingUseCase } from "./interfaces/confirm.chapter.one.to.one.booking.use-case.interface.js";
import type { ConfirmChapterOneToOneBookingDto } from "../dto/confirm.chapter.one.to.one.dto.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
export declare class ConfirmChapterOneToOneBookingUseCase implements IConfirmChapterOneToOneBookingUseCase {
    private readonly _bookingRepo;
    private readonly _facultyRepo;
    constructor(_bookingRepo: IBookingRepository, _facultyRepo: IFacultyRepository);
    execute(dto: ConfirmChapterOneToOneBookingDto): Promise<void>;
}
//# sourceMappingURL=confirm.chapter.one.to.one.use-case.d.ts.map