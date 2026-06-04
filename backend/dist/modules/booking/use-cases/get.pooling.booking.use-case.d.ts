import type { GetAllOneToOneBookingDto } from "../dto/get.all.one.to.one.dto.js";
import type { AdminPoolingView } from "../type/booking.type.js";
import type { IGetPoolingBookingUseCase } from "./interfaces/get.pooling.booking.use-case.interfaces.js";
import type { IBookingRepository } from "../repositories/booking.repository.interface.js";
export declare class GetPoolingBookingUseCase implements IGetPoolingBookingUseCase {
    private readonly _bookingRepository;
    constructor(_bookingRepository: IBookingRepository);
    execute(dto: GetAllOneToOneBookingDto): Promise<{
        data: AdminPoolingView[];
        total: number;
    }>;
}
//# sourceMappingURL=get.pooling.booking.use-case.d.ts.map