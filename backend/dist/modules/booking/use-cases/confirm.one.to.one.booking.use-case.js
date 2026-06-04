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
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import mongoose from "mongoose";
let ConfirmOneToOneBookingUseCase = class ConfirmOneToOneBookingUseCase {
    _bookingRepo;
    _facultyRepo;
    constructor(_bookingRepo, _facultyRepo) {
        this._bookingRepo = _bookingRepo;
        this._facultyRepo = _facultyRepo;
    }
    async execute(dto) {
        const booking = await this._bookingRepo.findById(dto.bookingId);
        if (!booking || booking.isDeleted) {
            throw new CustomError(ResponseMessages.BOOKING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        if (booking.type !== "oneToOne" || booking.mode !== "slot") {
            throw new CustomError(ResponseMessages.INVALID_BOOKING_TYPE, HttpStatusCode.BAD_REQUEST);
        }
        if (booking.status !== "interested") {
            throw new CustomError(ResponseMessages.INVALID_BOOKING_STATE, HttpStatusCode.BAD_REQUEST);
        }
        // defensive existence check
        const slot = await this._facultyRepo.getSlot(booking.facultyId, booking.slotId?.[0]);
        if (!slot || !slot.isAvailable) {
            throw new CustomError(ResponseMessages.SLOT_TIME_NOT_AVAILABLE, HttpStatusCode.BAD_REQUEST);
        }
        // // mutations
        const updateBooking = booking.confirm();
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            await this._bookingRepo.save(updateBooking, session);
            await this._facultyRepo.consumeSlot(booking.facultyId, booking.slotId?.[0], session);
            await this._bookingRepo.expireOtherBookingsForSlots({
                facultyId: booking.facultyId,
                slotIds: [booking.slotId?.[0]],
                excludeBookingIds: [booking.id],
            }, session);
            await session.commitTransaction();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
};
ConfirmOneToOneBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IFacultyRepository")),
    __metadata("design:paramtypes", [Object, Object])
], ConfirmOneToOneBookingUseCase);
export { ConfirmOneToOneBookingUseCase };
//# sourceMappingURL=confirm.one.to.one.booking.use-case.js.map