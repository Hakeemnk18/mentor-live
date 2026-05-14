import { container } from "tsyringe";
import { GetAnalysisTableUseCase } from "../modules/analysis/use-cases/get.analysis.table.use-case.js";
import type { IGetAnalysisTableUseCase } from "../modules/analysis/use-cases/interfaces/get.analysis.table.use-case.interface.js";
import type { IGetAnalysisKpiCardsUseCase } from "../modules/analysis/use-cases/interfaces/get.analysis.kpi.cards.use-case.interface.js";
import { GetAnalysisKpiCardsUseCase } from "../modules/analysis/use-cases/get.analysis.kpi.cards.use-case.js";
import type { IGetAllAnalysisMotivationUseCase } from "../modules/analysis/use-cases/interfaces/get.motivation.use-case.interface.js";
import { GetAllAnalysisMotivationUseCase } from "../modules/analysis/use-cases/get.motivation.use-case.js";
import type { IGetAnalysisChartUseCase } from "../modules/analysis/use-cases/interfaces/get.analysis.chart.use-case.interface.js";
import { GetAnalysisChartUseCase } from "../modules/analysis/use-cases/get.analysis.chart.use-case.js";
import type { IGetBookingStatusDistributionUseCase } from "../modules/analysis/use-cases/interfaces/get.booking.status.use-case.interface.js";
import { GetBookingStatusDistributionUseCase } from "../modules/analysis/use-cases/get.booking.status.use-case.js";

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

  container.register<IGetAnalysisChartUseCase>("IGetAnalysisChartUseCase", {
    useClass: GetAnalysisChartUseCase,
  });

  container.register<IGetBookingStatusDistributionUseCase>(
    "IGetBookingStatusDistributionUseCase",
    {
      useClass: GetBookingStatusDistributionUseCase,
    },
  );
};
