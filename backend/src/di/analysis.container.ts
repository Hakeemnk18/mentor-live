import { container } from "tsyringe";
import { GetAnalysisTableUseCase } from "../modules/analysis/use-cases/get.analysis.table.use-case.js";
import type { IGetAnalysisTableUseCase } from "../modules/analysis/use-cases/interfaces/get.analysis.table.use-case.interface.js";
import type { IGetAnalysisKpiCardsUseCase } from "../modules/analysis/use-cases/interfaces/get.analysis.kpi.cards.use-case.interface.js";
import { GetAnalysisKpiCardsUseCase } from "../modules/analysis/use-cases/get.analysis.kpi.cards.use-case.js";
import type { IGetAllAnalysisMotivationUseCase } from "../modules/analysis/use-cases/interfaces/get.motivation.use-case.interface.js";
import { GetAllAnalysisMotivationUseCase } from "../modules/analysis/use-cases/get.motivation.use-case.js";

export const registerAnalysisDependencies = () => {
  container.register<IGetAnalysisTableUseCase>("IGetAnalysisTableUseCase", {
    useClass: GetAnalysisTableUseCase,
  });

  container.register<IGetAnalysisKpiCardsUseCase>(
    "IGetAnalysisKpiCardsUseCase",
    {
      useClass: GetAnalysisKpiCardsUseCase,
    },
  );

  container.register<IGetAllAnalysisMotivationUseCase>(
    "IGetAllAnalysisMotivationUseCase",
    {
      useClass: GetAllAnalysisMotivationUseCase,
    },
  );
};
