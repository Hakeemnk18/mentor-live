import { inject, injectable } from "tsyringe";
import type { ICreateBookingUseCase } from "../use-cases/interfaces/create.booking.use-case.interface.js";
import type { IBookingController } from "./interfaces/booking.controller.interface.js";
import type { Request, Response } from "express";
import { CreateBookingSchema } from "../dto/create.booking.dto.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";


@injectable()
export class BookingController implements IBookingController {

    constructor(
        @inject("ICreateBookingUseCase") 
        private _createBookingUseCase: ICreateBookingUseCase,   
    ){}

    async createBooking(req: Request, res: Response): Promise<void> {
        try {
            const dto = CreateBookingSchema.parse(req.body)
           await this._createBookingUseCase.execute(dto)

            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.BOOKING_CREATED,
                success: true
            })
        } catch (error) {
            handleError(res, error)
            console.log("error in create booking ", error)
        }
    }
}