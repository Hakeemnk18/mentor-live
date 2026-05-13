import type { DashboardMotivationSummary } from "../../type/analysis.type.js";

export interface IGetAllAnalysisMotivationUseCase {
  execute(): Promise<DashboardMotivationSummary>;
}
