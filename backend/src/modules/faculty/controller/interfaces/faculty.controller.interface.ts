import type { Request, Response } from "express";

export interface IFacultyController {
  createFaculty(req: Request, res: Response): Promise<void>;
  GetAllFacultyForAdmin(req: Request, res: Response): Promise<void>;
  getFacultyDetailsForAdmin(req: Request, res: Response): Promise<void>;
  editFaculty(req: Request, res: Response): Promise<void>;
  facultyAddSlots(req: Request, res: Response): Promise<void>
  facultyAddChapterSlots(req: Request, res: Response): Promise<void>
  findAllFacultyForUser(req: Request, res: Response): Promise<void>
  getFacultyDetailsByChapter(req: Request, res: Response): Promise<void>
  getFacultyDetailsBySlot(req: Request, res: Response): Promise<void>
  updateSlotAvailability(req: Request, res: Response): Promise<void>
  updateChapterSlotAvailability(req: Request, res: Response): Promise<void>
  blockFaculty(req: Request, res: Response): Promise<void>
  unblockFaculty(req: Request, res: Response): Promise<void>
  getAvailableSlots(req: Request, res: Response): Promise<void>
  getUserSlotDetails(req: Request, res: Response): Promise<void>
  getFacultyPublicProfile(req: Request, res: Response): Promise<void>
}