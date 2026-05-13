import type { Request, Response } from "express";

export interface IAnalysisController {
  getAnalysisTable(req: Request, res: Response): Promise<void>;
  getAnalysisKpiCards(req: Request, res: Response): Promise<void>;
  getAnalysisMotivation(req: Request, res: Response): Promise<void>;
}
