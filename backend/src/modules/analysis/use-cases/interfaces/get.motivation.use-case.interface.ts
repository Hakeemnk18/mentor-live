import type { DashboardMotivationSummary } from "../../type/analysis.type.js";

export interface IGetMotivationUseCase {
  execute(): Promise<DashboardMotivationSummary>;
}
