import type { Request, Response } from "express";

export interface ISubjectController {
  createSubject(req: Request, res: Response): Promise<void>;

}