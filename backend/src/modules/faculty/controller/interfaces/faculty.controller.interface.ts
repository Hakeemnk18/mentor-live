import type { Request, Response } from "express";

export interface IFacultyController {
  createFaculty(req: Request, res: Response): Promise<void>;
}