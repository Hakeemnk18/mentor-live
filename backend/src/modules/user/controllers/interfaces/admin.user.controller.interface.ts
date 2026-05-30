import type { Request, Response } from "express";

export interface IAdminUserController {
  createUser(req: Request, res: Response): Promise<void>;
  getAllUsers(req: Request, res: Response): Promise<void>;
  editUser(req: Request, res: Response): Promise<void>;
  blockUser(req: Request, res: Response): Promise<void>;
  unblockUser(req: Request, res: Response): Promise<void>;
}
