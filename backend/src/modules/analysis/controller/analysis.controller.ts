import { inject, injectable } from "tsyringe";
import type { IAnalysisController } from "./interfaces/analysis.controller.interface.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import type { Request, Response } from "express";
import { handleError } from "../../../core/errors/custom.error.js";
import type { IGetAnalysisTableUseCase } from "../use-cases/interfaces/get.analysis.table.use-case.interface.js";
import type { IGetAnalysisKpiCardsUseCase } from "../use-cases/interfaces/get.analysis.kpi.cards.use-case.interface.js";
import type { IGetAllAnalysisMotivationUseCase } from "../use-cases/interfaces/get.motivation.use-case.interface.js";
import type { IGetAnalysisChartUseCase } from "../use-cases/interfaces/get.analysis.chart.use-case.interface.js";
import { GetAnalysisChartQuerySchema } from "../dto/get.analysis.chart.dto.js";
import type { IGetBookingStatusDistributionUseCase } from "../use-cases/interfaces/get.booking.status.use-case.interface.js";

@injectable()
export class AnalysisController implements IAnalysisController {
  constructor(
    @inject("IGetAnalysisTableUseCase")
    private _getAnalysisTableUseCase: IGetAnalysisTableUseCase,

    @inject("IGetAnalysisKpiCardsUseCase")
    private _getAnalysisKpiCardsUseCase: IGetAnalysisKpiCardsUseCase,

    @inject("IGetAllAnalysisMotivationUseCase")
    private _getAnalysisMotivationUseCase: IGetAllAnalysisMotivationUseCase,

    @inject("IGetAnalysisChartUseCase")
    private _getAnalysisChartUseCase: IGetAnalysisChartUseCase,

    @inject("IGetBookingStatusDistributionUseCase")
    private _getBookingStatusDistributionUseCase: IGetBookingStatusDistributionUseCase,
  ) {}

  async getAnalysisTable(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._getAnalysisTableUseCase.execute();

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.ANALYSIS_TABLE_FETCHED,
        data: result,
        success: true,
      });
    } catch (error) {
      handleError(res, error);
      console.log("error in get analysis table ", error);
    }
  }

  async getAnalysisKpiCards(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._getAnalysisKpiCardsUseCase.execute();

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.ANALYSIS_KPI_CARDS_FETCHED,
        data: result,
        success: true,
      });
    } catch (error) {
      handleError(res, error);
      console.log("error in get analysis kpi cards ", error);
    }
  }

  async getAnalysisMotivation(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._getAnalysisMotivationUseCase.execute();

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.ANALYSIS_MOTIVATION_FETCHED,
        data: result,
        success: true,
      });
    } catch (error) {
      handleError(res, error);
      console.log("error in get analysis motivation ", error);
    }
  }

  async getAnalysisChart(req: Request, res: Response): Promise<void> {
    try {
      const range = GetAnalysisChartQuerySchema.parse(req.query);
      const result = await this._getAnalysisChartUseCase.execute(range);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.ANALYSIS_CHART_FETCHED,
        data: result,
        success: true,
      });
    } catch (error) {
      handleError(res, error);
      console.log("error in get analysis chart ", error);
    }
  }

  async getBookingStatusDistribution(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const result = await this._getBookingStatusDistributionUseCase.execute();

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.BOOKING_STATUS_DISTRIBUTION_FETCHED,
        data: result,
        success: true,
      });
    } catch (error) {
      handleError(res, error);
      console.log("error in get booking status distribution ", error);
    }
  }
}
