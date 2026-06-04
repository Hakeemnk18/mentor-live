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
let ConfirmPoolingBookingUseCase = class ConfirmPoolingBookingUseCase {
    _bookingRepo;
    _facultyRepo;
    constructor(_bookingRepo, _facultyRepo) {
        this._bookingRepo = _bookingRepo;
        this._facultyRepo = _facultyRepo;
    }
    async execute(dto) {
        const { slotId, facultyId } = dto;
        // defensive existence check
        const slot = await this._facultyRepo.getSlot(facultyId, slotId);
        if (!slot || !slot.isAvailable || slot.pool.length === 0) {
            throw new CustomError(ResponseMessages.SLOT_TIME_NOT_AVAILABLE, HttpStatusCode.BAD_REQUEST);
        }
        //fetch booking ids
        const bookingIds = await this._bookingRepo.getBookingIds({
            slotIds: [slotId],
            userIds: slot.pool,
            facultyId,
            mode: "slot",
        });
        if (bookingIds.length !== slot.pool.length) {
            throw new CustomError(ResponseMessages.BOOKING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const updatedCount = await this._bookingRepo.confirmPoolingBookings(bookingIds, session);
            if (updatedCount !== bookingIds.length) {
                throw new CustomError(ResponseMessages.BOOKING_UPDATE_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
            }
            await this._facultyRepo.consumeSlot(facultyId, slotId, session);
            await this._bookingRepo.expireOtherBookingsForSlots({
                facultyId: facultyId,
                slotIds: [slotId],
                excludeBookingIds: bookingIds,
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
ConfirmPoolingBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IFacultyRepository")),
    __metadata("design:paramtypes", [Object, Object])
], ConfirmPoolingBookingUseCase);
export { ConfirmPoolingBookingUseCase };
//# sourceMappingURL=confirm.pooling.booking.use-case.js.map