var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { CreateBookingSchema } from "../dto/create.booking.dto.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { GetAllBookingByOneToOneSchema } from "../dto/get.all.one.to.one.dto.js";
import { GetAdminPoolingStudentsSchema } from "../dto/get.pooling.students.dto.js";
import { ConfirmOneToOneBookingSchema } from "../dto/confirm.one.to.one.booking.dto.js";
import { ConfirmChapterOneToOneBookingSchema } from "../dto/confirm.chapter.one.to.one.dto.js";
import { ConfirmPoolingBookingSchema } from "../dto/confirm.pooling.booking.dto.js";
import { ConfirmChapterPoolingBookingSchema } from "../dto/confirm.chapter.pooling.dto.js";
import { RemoveUserFromPoolSchema } from "../dto/remove.student.from.pooling.dto.js";
import { log } from "node:console";
import { GetSlotBookingDetailsSchema } from "../dto/slot.booking.details.dto.js";
import { GetChapterBookingDetailsSchema } from "../dto/chapter.booking.details.dto.js";
import { GetAllBookingSchema } from "../dto/get.all.booking.dto.js";
let BookingController = class BookingController {
    _createBookingUseCase;
    _getOneToOneBookingUseCase;
    _getPoolingBookingUseCase;
    _getPoolingStudentsUseCase;
    _confirmOneToOneBookingUseCase;
    _confirmPoolingBookingUseCase;
    _confirmChapterOneToOneBookingUseCase;
    _confirmChapterPoolingBookingUseCase;
    _removeStudentFromPoolingUseCase;
    _getSlotBookingDetailsUseCase;
    _getChapterBookingDetailsUseCase;
    _getAllBookingUseCase;
    constructor(_createBookingUseCase, _getOneToOneBookingUseCase, _getPoolingBookingUseCase, _getPoolingStudentsUseCase, _confirmOneToOneBookingUseCase, _confirmPoolingBookingUseCase, _confirmChapterOneToOneBookingUseCase, _confirmChapterPoolingBookingUseCase, _removeStudentFromPoolingUseCase, _getSlotBookingDetailsUseCase, _getChapterBookingDetailsUseCase, _getAllBookingUseCase) {
        this._createBookingUseCase = _createBookingUseCase;
        this._getOneToOneBookingUseCase = _getOneToOneBookingUseCase;
        this._getPoolingBookingUseCase = _getPoolingBookingUseCase;
        this._getPoolingStudentsUseCase = _getPoolingStudentsUseCase;
        this._confirmOneToOneBookingUseCase = _confirmOneToOneBookingUseCase;
        this._confirmPoolingBookingUseCase = _confirmPoolingBookingUseCase;
        this._confirmChapterOneToOneBookingUseCase = _confirmChapterOneToOneBookingUseCase;
        this._confirmChapterPoolingBookingUseCase = _confirmChapterPoolingBookingUseCase;
        this._removeStudentFromPoolingUseCase = _removeStudentFromPoolingUseCase;
        this._getSlotBookingDetailsUseCase = _getSlotBookingDetailsUseCase;
        this._getChapterBookingDetailsUseCase = _getChapterBookingDetailsUseCase;
        this._getAllBookingUseCase = _getAllBookingUseCase;
    }
    async createBooking(req, res) {
        try {
            const dto = CreateBookingSchema.parse(req.body);
            await this._createBookingUseCase.execute(dto);
            console.log("booking created successfully");
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.BOOKING_CREATED,
                success: true,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in create booking ", error);
        }
    }
    async getAllOneToOneBooking(req, res) {
        try {
            const dto = GetAllBookingByOneToOneSchema.parse(req.query);
            const { data, total } = await this._getOneToOneBookingUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: data,
                total: total,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get all one to one booking ", error);
        }
    }
    async getAllPoolingBooking(req, res) {
        try {
            const dto = GetAllBookingByOneToOneSchema.parse(req.query);
            const { data, total } = await this._getPoolingBookingUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: data,
                total: total,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get all pooling booking ", error);
        }
    }
    async getAllBookings(req, res) {
        try {
            const dto = GetAllBookingSchema.parse(req.query);
            const result = await this._getAllBookingUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: result.data,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get all bookings", error);
        }
    }
    async getPoolingStudents(req, res) {
        try {
            const dto = GetAdminPoolingStudentsSchema.parse(req.query);
            const data = await this._getPoolingStudentsUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: data,
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get all pooling students  ", error);
        }
    }
    async confirmOneToOneBooking(req, res) {
        try {
            const dto = ConfirmOneToOneBookingSchema.parse(req.params);
            await this._confirmOneToOneBookingUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.BOOKING_STATUS_CHANGED,
            });
        }
        catch (error) {
            handleError(res, error);
        }
    }
    async confirmChapterOneToOneBooking(req, res) {
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
        }
        catch (error) {
            handleError(res, error);
        }
    }
    async confirmPoolingBookings(req, res) {
        try {
            const dto = ConfirmPoolingBookingSchema.parse(req.body);
            await this._confirmPoolingBookingUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.BOOKING_STATUS_CHANGED,
            });
        }
        catch (error) {
            handleError(res, error);
        }
    }
    async confirmChapterPoolingBooking(req, res) {
        try {
            const dto = ConfirmChapterPoolingBookingSchema.parse(req.body);
            await this._confirmChapterPoolingBookingUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
            });
        }
        catch (error) {
            handleError(res, error);
        }
    }
    async removeStudentFromPooling(req, res) {
        try {
            const dto = RemoveUserFromPoolSchema.parse(req.body);
            await this._removeStudentFromPoolingUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.REMOVE_STUDENT_FROM_POOLING_SUCCESS,
            });
        }
        catch (error) {
            console.log("error in remove student from pooling ", error);
            handleError(res, error);
        }
    }
    async getSlotBookingDetails(req, res) {
        try {
            const dto = GetSlotBookingDetailsSchema.parse(req.query);
            const data = await this._getSlotBookingDetailsUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data: data,
            });
        }
        catch (error) {
            handleError(res, error);
        }
    }
    async getChapterBookingDetails(req, res) {
        try {
            const dto = GetChapterBookingDetailsSchema.parse(req.query);
            const data = await this._getChapterBookingDetailsUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data: data,
            });
        }
        catch (error) {
            handleError(res, error);
        }
    }
};
BookingController = __decorate([
    injectable(),
    __param(0, inject("ICreateBookingUseCase")),
    __param(1, inject("IGetOneToOneBookingUseCase")),
    __param(2, inject("IGetPoolingBookingUseCase")),
    __param(3, inject("IGetPoolingStudentsUseCase")),
    __param(4, inject("IConfirmOneToOneBookingUseCase")),
    __param(5, inject("IConfirmPoolingBookingUseCase")),
    __param(6, inject("IConfirmChapterOneToOneBookingUseCase")),
    __param(7, inject("IConfirmChapterPoolingBookingUseCase")),
    __param(8, inject("IRemoveStudentFromPoolingUseCase")),
    __param(9, inject("IGetSlotBookingDetailsUseCase")),
    __param(10, inject("IGetChapterBookingDetailsUseCase")),
    __param(11, inject("IGetAllBookingUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], BookingController);
export { BookingController };
//# sourceMappingURL=booking.controller.js.map