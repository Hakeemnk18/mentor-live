import type { AnalysisTableResponse } from "../../type/analysis.type.js";

export interface IGetAnalysisTableUseCase {
  execute(): Promise<AnalysisTableResponse>;
}
