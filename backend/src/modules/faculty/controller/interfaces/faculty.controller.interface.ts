import type { Request, Response } from "express";

export interface IFacultyController {
  createFaculty(req: Request, res: Response): Promise<void>;
  GetAllFacultyForAdmin(req: Request, res: Response): Promise<void>;
  getFacultyDetailsForAdmin(req: Request, res: Response): Promise<void>;
  editFaculty(req: Request, res: Response): Promise<void>;
  facultyAddSlots(req: Request, res: Response): Promise<void>
  facultyAddChapterSlots(req: Request, res: Response): Promise<void>
}