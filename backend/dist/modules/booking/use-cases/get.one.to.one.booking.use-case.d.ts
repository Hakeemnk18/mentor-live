import type { GetAllOneToOneBookingDto } from "../dto/get.all.one.to.one.dto.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
import type { AdminBookingView } from "../type/booking.type.js";
import type { IGetOneToOneBookingUseCase } from "./interfaces/get.one.to.one.booking.use-case.interface.js";
export declare class GetOneToOneBookingUseCase implements IGetOneToOneBookingUseCase {
    private readonly _bookingRepository;
    constructor(_bookingRepository: IBookingRepository);
    execute(dto: GetAllOneToOneBookingDto): Promise<{
        data: AdminBookingView[];
        total: number;
    }>;
}
//# sourceMappingURL=get.one.to.one.booking.use-case.d.ts.map