import type { IBookingRepository } from "../../booking/repositories/booking.repository.interface.js";
import type { BookingStatusDistribution } from "../type/analysis.type.js";
import type { IGetBookingStatusDistributionUseCase } from "./interfaces/get.booking.status.use-case.interface.js";
export declare class GetBookingStatusDistributionUseCase implements IGetBookingStatusDistributionUseCase {
    private readonly _bookingRepository;
    constructor(_bookingRepository: IBookingRepository);
    execute(): Promise<BookingStatusDistribution>;
}
//# sourceMappingURL=get.booking.status.use-case.d.ts.map