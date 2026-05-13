import { inject, injectable } from "tsyringe";
import type { IAnalysisController } from "./interfaces/analysis.controller.interface.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import type { Request, Response } from "express";
import { handleError } from "../../../core/errors/custom.error.js";
import type { IGetAnalysisTableUseCase } from "../use-cases/interfaces/get.analysis.table.use-case.interface.js";

@injectable()
export class AnalysisController implements IAnalysisController {
  constructor(
    @inject("IGetAnalysisTableUseCase")
    private _getAnalysisTableUseCase: IGetAnalysisTableUseCase,
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
}
