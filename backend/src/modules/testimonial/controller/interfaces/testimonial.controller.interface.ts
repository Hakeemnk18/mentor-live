import type { Request, Response } from "express";

export interface ITestimonialController {
  createTestimonial(req: Request, res: Response): Promise<void>;
  editTestimonial(req: Request, res: Response): Promise<void>;
  deleteTestimonial(req: Request, res: Response): Promise<void>;
  getAllTestimonialForAdmin(req: Request, res: Response): Promise<void>;
  getAllTestimonialForUser(req: Request, res: Response): Promise<void>;
}