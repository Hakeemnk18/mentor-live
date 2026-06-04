import type { IBookingRepository } from "../../booking/repositories/booking.repository.interface.js";
import type { GetAnalysisChartQueryDto } from "../dto/get.analysis.chart.dto.js";
import type { IGetAnalysisChartUseCase } from "./interfaces/get.analysis.chart.use-case.interface.js";
import type { AnalysisChartData } from "../type/analysis.type.js";
export declare class GetAnalysisChartUseCase implements IGetAnalysisChartUseCase {
    private readonly _bookingRepository;
    constructor(_bookingRepository: IBookingRepository);
    execute(dto: GetAnalysisChartQueryDto): Promise<AnalysisChartData>;
}
//# sourceMappingURL=get.analysis.chart.use-case.d.ts.map