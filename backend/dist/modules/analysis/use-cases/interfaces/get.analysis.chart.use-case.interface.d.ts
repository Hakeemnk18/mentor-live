import type { GetAnalysisChartQueryDto } from "../../dto/get.analysis.chart.dto.js";
import type { AnalysisChartData } from "../../type/analysis.type.js";
export interface IGetAnalysisChartUseCase {
    execute(dto: GetAnalysisChartQueryDto): Promise<AnalysisChartData>;
}
//# sourceMappingURL=get.analysis.chart.use-case.interface.d.ts.map