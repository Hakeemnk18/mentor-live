import type { IBookingRepository } from "../../booking/repositories/booking.repository.interface.js";
import type { DashboardMotivationSummary } from "../type/analysis.type.js";
import type { IGetAllAnalysisMotivationUseCase } from "./interfaces/get.motivation.use-case.interface.js";
export declare class GetAllAnalysisMotivationUseCase implements IGetAllAnalysisMotivationUseCase {
    private readonly _bookingRepository;
    constructor(_bookingRepository: IBookingRepository);
    private formatNumber;
    private calculatePercentage;
    private calculateNextTarget;
    execute(): Promise<DashboardMotivationSummary>;
}
//# sourceMappingURL=get.motivation.use-case.d.ts.map