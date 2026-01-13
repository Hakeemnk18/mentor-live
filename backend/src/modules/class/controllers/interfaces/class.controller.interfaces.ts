import type { Request, Response } from "express";

export interface IClassController {
  createClass(req: Request, res: Response): Promise<void>;
  editClass(req: Request, res: Response): Promise<void>;
  getClassesForUser(req: Request, res: Response): Promise<void>;
  getClassesForAdmin(req: Request, res: Response): Promise<void>;
}