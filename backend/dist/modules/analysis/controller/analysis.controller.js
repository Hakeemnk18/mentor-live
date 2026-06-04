var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { GetAnalysisChartQuerySchema } from "../dto/get.analysis.chart.dto.js";
let AnalysisController = class AnalysisController {
    _getAnalysisTableUseCase;
    _getAnalysisKpiCardsUseCase;
    _getAnalysisMotivationUseCase;
    _getAnalysisChartUseCase;
    _getBookingStatusDistributionUseCase;
    constructor(_getAnalysisTableUseCase, _getAnalysisKpiCardsUseCase, _getAnalysisMotivationUseCase, _getAnalysisChartUseCase, _getBookingStatusDistributionUseCase) {
        this._getAnalysisTableUseCase = _getAnalysisTableUseCase;
        this._getAnalysisKpiCardsUseCase = _getAnalysisKpiCardsUseCase;
        this._getAnalysisMotivationUseCase = _getAnalysisMotivationUseCase;
        this._getAnalysisChartUseCase = _getAnalysisChartUseCase;
        this._getBookingStatusDistributionUseCase = _getBookingStatusDistributionUseCase;
    }
    async getAnalysisTable(req, res) {
        try {
            const result = await this._getAnalysisTableUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.ANALYSIS_TABLE_FETCHED,
                data: result,
                success: true,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get analysis table ", error);
        }
    }
    async getAnalysisKpiCards(req, res) {
        try {
            const result = await this._getAnalysisKpiCardsUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.ANALYSIS_KPI_CARDS_FETCHED,
                data: result,
                success: true,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get analysis kpi cards ", error);
        }
    }
    async getAnalysisMotivation(req, res) {
        try {
            const result = await this._getAnalysisMotivationUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.ANALYSIS_MOTIVATION_FETCHED,
                data: result,
                success: true,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get analysis motivation ", error);
        }
    }
    async getAnalysisChart(req, res) {
        try {
            const range = GetAnalysisChartQuerySchema.parse(req.query);
            const result = await this._getAnalysisChartUseCase.execute(range);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.ANALYSIS_CHART_FETCHED,
                data: result,
                success: true,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get analysis chart ", error);
        }
    }
    async getBookingStatusDistribution(req, res) {
        try {
            const result = await this._getBookingStatusDistributionUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.BOOKING_STATUS_DISTRIBUTION_FETCHED,
                data: result,
                success: true,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get booking status distribution ", error);
        }
    }
};
AnalysisController = __decorate([
    injectable(),
    __param(0, inject("IGetAnalysisTableUseCase")),
    __param(1, inject("IGetAnalysisKpiCardsUseCase")),
    __param(2, inject("IGetAllAnalysisMotivationUseCase")),
    __param(3, inject("IGetAnalysisChartUseCase")),
    __param(4, inject("IGetBookingStatusDistributionUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AnalysisController);
export { AnalysisController };
//# sourceMappingURL=analysis.controller.js.map