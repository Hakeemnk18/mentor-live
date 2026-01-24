import { inject, injectable } from "tsyringe";
import type { ICreateBookingUseCase } from "../use-cases/interfaces/create.booking.use-case.interface.js";
import type { IBookingController } from "./interfaces/booking.controller.interface.js";
import type { Request, Response } from "express";
import { CreateBookingSchema } from "../dto/create.booking.dto.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import type { IGetOneToOneBookingUseCase } from "../use-cases/interfaces/get.one.to.one.booking.use-case.interface.js";
import { GetAllBookingByOneToOneSchema } from "../dto/get.all.one.to.one.dto.js";
import type { IGetPoolingBookingUseCase } from "../use-cases/interfaces/get.pooling.booking.use-case.interfaces.js";


@injectable()
export class BookingController implements IBookingController {

    constructor(
        @inject("ICreateBookingUseCase") 
        private _createBookingUseCase: ICreateBookingUseCase,  
        
         @inject("IGetOneToOneBookingUseCase") 
        private _getOneToOneBookingUseCase: IGetOneToOneBookingUseCase,

         @inject("IGetPoolingBookingUseCase") 
        private _getPoolingBookingUseCase: IGetPoolingBookingUseCase,

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

    async getAllOneToOneBooking(req: Request, res: Response): Promise<void> {
        try {
            const dto = GetAllBookingByOneToOneSchema.parse(req.query)
           const { data, total } = await this._getOneToOneBookingUseCase.execute(dto)

            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: data,
                total: total
            })
        } catch (error) {
            handleError(res, error)
            console.log("error in get all one to one booking ", error)
        }
    }

    async getAllPoolingBooking(req: Request, res: Response): Promise<void> {
        try {
            const dto = GetAllBookingByOneToOneSchema.parse(req.query)
           const { data, total } = await this._getPoolingBookingUseCase.execute(dto)

            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: data,
                total: total
            })
        } catch (error) {
            handleError(res, error)
            console.log("error in get all pooling booking ", error)
        }
    }
}