import type { Request, Response } from 'express';

export interface IBookingController {
    createBooking(req: Request, res: Response): Promise<void>;
    getAllOneToOneBooking(req: Request, res: Response): Promise<void>;
}