import type { Request, Response } from "express";

export interface ISubjectVariantController {
  addSubjectVariant(req: Request, res: Response): Promise<void>;
  removeSubjectVariant(req: Request, res: Response): Promise<void>;
}