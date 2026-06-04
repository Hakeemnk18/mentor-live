import { container } from "tsyringe";
import { GetAnalysisTableUseCase } from "../modules/analysis/use-cases/get.analysis.table.use-case.js";
import { GetAnalysisKpiCardsUseCase } from "../modules/analysis/use-cases/get.analysis.kpi.cards.use-case.js";
import { GetAllAnalysisMotivationUseCase } from "../modules/analysis/use-cases/get.motivation.use-case.js";
import { GetAnalysisChartUseCase } from "../modules/analysis/use-cases/get.analysis.chart.use-case.js";
import { GetBookingStatusDistributionUseCase } from "../modules/analysis/use-cases/get.booking.status.use-case.js";
export const registerAnalysisDependencies = () => {
    container.register("IGetAnalysisTableUseCase", {
        useClass: GetAnalysisTableUseCase,
    });
    container.register("IGetAnalysisKpiCardsUseCase", {
        useClass: GetAnalysisKpiCardsUseCase,
    });
    container.register("IGetAllAnalysisMotivationUseCase", {
        useClass: GetAllAnalysisMotivationUseCase,
    });
    container.register("IGetAnalysisChartUseCase", {
        useClass: GetAnalysisChartUseCase,
    });
    container.register("IGetBookingStatusDistributionUseCase", {
        useClass: GetBookingStatusDistributionUseCase,
    });
};
//# sourceMappingURL=analysis.container.js.map