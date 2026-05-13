import type { AnalysisKpiCard } from "../../type/analysis.type.js";

export interface IGetAnalysisKpiCardsUseCase {
  execute(): Promise<AnalysisKpiCard[]>;
}
