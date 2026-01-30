import type { Request, Response } from "express";

export interface IBlogController {
  createBlog(req: Request, res: Response): Promise<void>;
  editBlog(req: Request, res: Response): Promise<void>;
  blockBlog(req: Request, res: Response): Promise<void>;
  unblockBlog(req: Request, res: Response): Promise<void>;
  getAllBlogForAdmin(req: Request, res: Response): Promise<void>;
  getAllBlogForUser(req: Request, res: Response): Promise<void>;
  getFullBlogDetails(req: Request, res: Response): Promise<void>;
}