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
import type { IGetPoolingStudentsUseCase } from "../use-cases/interfaces/get.pooling.students.use-case.interface.js";
import { GetAdminPoolingStudentsSchema } from "../dto/get.pooling.students.dto.js";
import { ConfirmOneToOneBookingSchema } from "../dto/confirm.one.to.one.booking.dto.js";
import type { IConfirmOneToOneBookingUseCase } from "../use-cases/interfaces/confirm.one.to.one.booking.use-case.interface.js";
import type { IConfirmPoolingBookingUseCase } from "../use-cases/interfaces/confirm.pooling.booking.use-case.interface.js";
import { ConfirmChapterOneToOneBookingSchema } from "../dto/confirm.chapter.one.to.one.dto.js";
import type { IConfirmChapterOneToOneBookingUseCase } from "../use-cases/interfaces/confirm.chapter.one.to.one.booking.use-case.interface.js";
import { ConfirmPoolingBookingSchema } from "../dto/confirm.pooling.booking.dto.js";
import type { IConfirmChapterPoolingBookingUseCase } from "../use-cases/interfaces/confirm.chapter.pooling.booking.interface.js";
import { ConfirmChapterPoolingBookingSchema } from "../dto/confirm.chapter.pooling.dto.js";
import type { IRemoveStudentFromPoolingUseCase } from "../use-cases/interfaces/remove.student.from.pooling.use-case.interface.js";
import { RemoveUserFromPoolSchema } from "../dto/remove.student.from.pooling.dto.js";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject("ICreateBookingUseCase")
    private _createBookingUseCase: ICreateBookingUseCase,

    @inject("IGetOneToOneBookingUseCase")
    private _getOneToOneBookingUseCase: IGetOneToOneBookingUseCase,

    @inject("IGetPoolingBookingUseCase")
    private _getPoolingBookingUseCase: IGetPoolingBookingUseCase,

    @inject("IGetPoolingStudentsUseCase")
    private _getPoolingStudentsUseCase: IGetPoolingStudentsUseCase,

    @inject("IConfirmOneToOneBookingUseCase")
    private _confirmOneToOneBookingUseCase: IConfirmOneToOneBookingUseCase,

    @inject("IConfirmPoolingBookingUseCase")
    private _confirmPoolingBookingUseCase: IConfirmPoolingBookingUseCase,

    @inject("IConfirmChapterOneToOneBookingUseCase")
    private readonly _confirmChapterOneToOneBookingUseCase: IConfirmChapterOneToOneBookingUseCase,

    @inject("IConfirmChapterPoolingBookingUseCase")
    private readonly _confirmChapterPoolingBookingUseCase: IConfirmChapterPoolingBookingUseCase,

    @inject("IRemoveStudentFromPoolingUseCase")
    private readonly _removeStudentFromPoolingUseCase: IRemoveStudentFromPoolingUseCase,
  ) {}

  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const dto = CreateBookingSchema.parse(req.body);
      await this._createBookingUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.BOOKING_CREATED,
        success: true,
      });
    } catch (error) {
      handleError(res, error);
      console.log("error in create booking ", error);
    }
  }

  async getAllOneToOneBooking(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllBookingByOneToOneSchema.parse(req.query);
      const { data, total } =
        await this._getOneToOneBookingUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SUCCESS,
        success: true,
        data: data,
        total: total,
      });
    } catch (error) {
      handleError(res, error);
      console.log("error in get all one to one booking ", error);
    }
  }

  async getAllPoolingBooking(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllBookingByOneToOneSchema.parse(req.query);
      const { data, total } = await this._getPoolingBookingUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SUCCESS,
        success: true,
        data: data,
        total: total,
      });
    } catch (error) {
      handleError(res, error);
      console.log("error in get all pooling booking ", error);
    }
  }

  async getPoolingStudents(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAdminPoolingStudentsSchema.parse(req.query);
      const data = await this._getPoolingStudentsUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SUCCESS,
        success: true,
        data: data,
      });
    } catch (error) {
      handleError(res, error);
      console.log("error in get all pooling students  ", error);
    }
  }

  async confirmOneToOneBooking(req: Request, res: Response): Promise<void> {
    try {
      const dto = ConfirmOneToOneBookingSchema.parse(req.params);
      await this._confirmOneToOneBookingUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.BOOKING_STATUS_CHANGED,
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  async confirmChapterOneToOneBooking(req: Request,res: Response,): Promise<void> {
    try {
      const dto = ConfirmChapterOneToOneBookingSchema.parse({
        bookingId: req.params.bookingId,
        slotId: req.body.slotId,
      });

      await this._confirmChapterOneToOneBookingUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  async confirmPoolingBookings(req: Request, res: Response): Promise<void> {
      try {
        const dto = ConfirmPoolingBookingSchema.parse(req.body);
        await this._confirmPoolingBookingUseCase.execute(dto);
        res.status(HttpStatusCode.OK).json({
          success: true,
          message: ResponseMessages.BOOKING_STATUS_CHANGED,
        });
      } catch (error) {
        handleError(res, error);
      }
  }

  async confirmChapterPoolingBooking(req: Request,res: Response,): Promise<void> {
    try {
      const dto = ConfirmChapterPoolingBookingSchema.parse(req.body);
      await this._confirmChapterPoolingBookingUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  async removeStudentFromPooling(req: Request, res: Response): Promise<void> {
    try {
      const dto = RemoveUserFromPoolSchema.parse(req.body);
      await this._removeStudentFromPoolingUseCase.execute(dto);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.REMOVE_STUDENT_FROM_POOLING_SUCCESS,
      });
    } catch (error) {
      console.log("error in remove student from pooling ", error);
      handleError(res, error);
    }

  }
}
