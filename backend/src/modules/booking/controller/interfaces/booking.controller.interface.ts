import type { Request, Response } from "express";

export interface IBookingController {
  createBooking(req: Request, res: Response): Promise<void>;
  getAllOneToOneBooking(req: Request, res: Response): Promise<void>;
  getAllPoolingBooking(req: Request, res: Response): Promise<void>;
  getPoolingStudents(req: Request, res: Response): Promise<void>;
  confirmOneToOneBooking(req: Request, res: Response): Promise<void>;
  confirmPoolingBookings(req: Request, res: Response): Promise<void>;
  confirmChapterOneToOneBooking(req: Request, res: Response): Promise<void>;
  confirmChapterPoolingBooking(req: Request, res: Response): Promise<void>;
  removeStudentFromPooling(req: Request, res: Response): Promise<void>;
  getSlotBookingDetails(req: Request, res: Response): Promise<void>;
  getChapterBookingDetails(req: Request, res: Response): Promise<void>;
  getAllBookings(req: Request, res: Response): Promise<void>;
  markBookingContacted(req: Request, res: Response): Promise<void>;
  exportOneToOneBookings(req: Request, res: Response): Promise<void>;
  exportPoolingBookings(req: Request, res: Response): Promise<void>;
}
