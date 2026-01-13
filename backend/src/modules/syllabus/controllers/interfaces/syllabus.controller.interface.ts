import type { Request, Response } from "express";

export interface ISyllabusController {
  createSyllabus(req: Request, res: Response): Promise<void>;
  editSyllabus(req: Request, res: Response): Promise<void>;
  getSyllabusesForUser(req: Request, res: Response): Promise<void>;
  getSyllabusesForAdmin(req: Request, res: Response): Promise<void>;
}