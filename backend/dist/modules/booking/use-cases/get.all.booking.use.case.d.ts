import type { GetAllBookingDto } from "../dto/get.all.booking.dto.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { IGetAllBookingUseCase } from "./interfaces/get.all.booking.use.case.interface.js";
export declare class GetAllBookingUseCase implements IGetAllBookingUseCase {
    private readonly _bookingRepository;
    constructor(_bookingRepository: IBookingRepository);
    execute(dto: GetAllBookingDto): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
//# sourceMappingURL=get.all.booking.use.case.d.ts.map