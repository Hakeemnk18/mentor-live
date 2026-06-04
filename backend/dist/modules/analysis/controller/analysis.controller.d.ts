import type { IAnalysisController } from "./interfaces/analysis.controller.interface.js";
import type { Request, Response } from "express";
import type { IGetAnalysisTableUseCase } from "../use-cases/interfaces/get.analysis.table.use-case.interface.js";
import type { IGetAnalysisKpiCardsUseCase } from "../use-cases/interfaces/get.analysis.kpi.cards.use-case.interface.js";
import type { IGetAllAnalysisMotivationUseCase } from "../use-cases/interfaces/get.motivation.use-case.interface.js";
import type { IGetAnalysisChartUseCase } from "../use-cases/interfaces/get.analysis.chart.use-case.interface.js";
import type { IGetBookingStatusDistributionUseCase } from "../use-cases/interfaces/get.booking.status.use-case.interface.js";
export declare class AnalysisController implements IAnalysisController {
    private _getAnalysisTableUseCase;
    private _getAnalysisKpiCardsUseCase;
    private _getAnalysisMotivationUseCase;
    private _getAnalysisChartUseCase;
    private _getBookingStatusDistributionUseCase;
    constructor(_getAnalysisTableUseCase: IGetAnalysisTableUseCase, _getAnalysisKpiCardsUseCase: IGetAnalysisKpiCardsUseCase, _getAnalysisMotivationUseCase: IGetAllAnalysisMotivationUseCase, _getAnalysisChartUseCase: IGetAnalysisChartUseCase, _getBookingStatusDistributionUseCase: IGetBookingStatusDistributionUseCase);
    getAnalysisTable(req: Request, res: Response): Promise<void>;
    getAnalysisKpiCards(req: Request, res: Response): Promise<void>;
    getAnalysisMotivation(req: Request, res: Response): Promise<void>;
    getAnalysisChart(req: Request, res: Response): Promise<void>;
    getBookingStatusDistribution(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=analysis.controller.d.ts.map