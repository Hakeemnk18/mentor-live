import type { Request, Response } from "express";

export interface ISubjectController {
  createSubject(req: Request, res: Response): Promise<void>;
  editSubjectName(req: Request, res: Response): Promise<void>;
  getAllSubjectForAdmin(req: Request, res: Response): Promise<void>
  getSubjectDetails(req: Request, res: Response): Promise<void>
}