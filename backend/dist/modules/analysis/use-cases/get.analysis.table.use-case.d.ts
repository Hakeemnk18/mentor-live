import type { IBookingRepository } from "../../booking/repositories/booking.repository.interface.js";
import type { AnalysisTableResponse } from "../type/analysis.type.js";
import type { IGetAnalysisTableUseCase } from "./interfaces/get.analysis.table.use-case.interface.js";
export declare class GetAnalysisTableUseCase implements IGetAnalysisTableUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(): Promise<AnalysisTableResponse>;
}
//# sourceMappingURL=get.analysis.table.use-case.d.ts.map