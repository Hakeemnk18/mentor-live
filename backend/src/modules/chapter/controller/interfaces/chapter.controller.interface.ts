import type { Request, Response } from "express";

export interface IChapterController {
  createChapter(req: Request, res: Response): Promise<void>;
  editChapter(req: Request, res: Response): Promise<void>;
  getChaptersForUser(req: Request, res: Response): Promise<void>;
  getChaptersForAdmin(req: Request, res: Response): Promise<void>;
  blockChapter(req: Request, res: Response): Promise<void>;
  unblockChapter(req: Request, res: Response): Promise<void>;
}
