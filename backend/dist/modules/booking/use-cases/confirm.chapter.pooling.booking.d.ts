import type { ConfirmChapterPoolingBookingDto } from "../dto/confirm.chapter.pooling.dto.js";
import type { IConfirmChapterPoolingBookingUseCase } from "./interfaces/confirm.chapter.pooling.booking.interface.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IFacultyRepository } from "../../faculty/repository/faculty.repository.interface.js";
export declare class ConfirmChapterPoolingBookingUseCase implements IConfirmChapterPoolingBookingUseCase {
    private readonly _bookingRepo;
    private readonly _facultyRepo;
    constructor(_bookingRepo: IBookingRepository, _facultyRepo: IFacultyRepository);
    execute(dto: ConfirmChapterPoolingBookingDto): Promise<void>;
}
//# sourceMappingURL=confirm.chapter.pooling.booking.d.ts.map