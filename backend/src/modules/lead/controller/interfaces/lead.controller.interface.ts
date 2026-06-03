import type { Request, Response } from "express";

export interface ILeadController {
  createLead(req: Request, res: Response): Promise<void>;
  getAllLeads(req: Request, res: Response): Promise<void>;
  updateLeadStatus(req: Request, res: Response): Promise<void>;
}
