import { container } from "tsyringe";
import { GetAnalysisTableUseCase } from "../modules/analysis/use-cases/get.analysis.table.use-case.js";
import type { IGetAnalysisTableUseCase } from "../modules/analysis/use-cases/interfaces/get.analysis.table.use-case.interface.js";

export const registerAnalysisDependencies = () => {
  container.register<IGetAnalysisTableUseCase>("IGetAnalysisTableUseCase", {
    useClass: GetAnalysisTableUseCase,
  });
};
