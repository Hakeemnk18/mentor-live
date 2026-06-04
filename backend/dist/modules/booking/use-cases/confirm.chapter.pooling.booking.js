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
let ConfirmChapterPoolingBookingUseCase = class ConfirmChapterPoolingBookingUseCase {
    _bookingRepo;
    _facultyRepo;
    constructor(_bookingRepo, _facultyRepo) {
        this._bookingRepo = _bookingRepo;
        this._facultyRepo = _facultyRepo;
    }
    async execute(dto) {
        const { slotId, facultyId, chapterId } = dto;
        // defensive chapter existence check
        const chapterSlot = await this._facultyRepo.getChapterSlot(facultyId, chapterId);
        if (!chapterSlot) {
            throw new CustomError(ResponseMessages.CHAPTER_SLOT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        // defensive slot existence and availability check
        const facultySlots = await this._facultyRepo.getAllSlots(facultyId);
        if (facultySlots.length === 0) {
            throw new CustomError(ResponseMessages.SLOT_TIME_NOT_AVAILABLE, HttpStatusCode.BAD_REQUEST);
        }
        // validate all selected slots
        for (const slotId of dto.slotId) {
            const slot = facultySlots.find((s) => String(s.id) === String(slotId));
            if (!slot || !slot.isAvailable) {
                throw new CustomError(ResponseMessages.SLOT_TIME_NOT_AVAILABLE, HttpStatusCode.CONFLICT);
            }
        }
        //fetch booking ids
        const bookingIds = await this._bookingRepo.getBookingIds({
            chapterId: chapterId,
            userIds: chapterSlot.pool,
            facultyId,
            mode: "chapter",
        });
        console.log("booking ids ", bookingIds);
        if (bookingIds.length !== chapterSlot.pool.length) {
            throw new CustomError(ResponseMessages.BOOKING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            //update bookings to confirmed
            const updatedCount = await this._bookingRepo.confirmPoolingBookings(bookingIds, session);
            if (updatedCount !== bookingIds.length) {
                throw new CustomError(ResponseMessages.BOOKING_UPDATE_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
            }
            console.log("booking updated");
            //add slots to bookings
            await this._bookingRepo.addSlotsToBookings(bookingIds, slotId, session);
            console.log("slots added to bookings");
            //consume slots
            await this._facultyRepo.consumeSlots(facultyId, slotId, session);
            console.log("slot consumed");
            //consume chapter slot
            await this._facultyRepo.consumeChapterSlot(facultyId, chapterId, session);
            console.log("chapter slot consumed");
            await this._bookingRepo.expireOtherBookingsForSlots({
                facultyId: facultyId,
                slotIds: slotId,
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
ConfirmChapterPoolingBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IFacultyRepository")),
    __metadata("design:paramtypes", [Object, Object])
], ConfirmChapterPoolingBookingUseCase);
export { ConfirmChapterPoolingBookingUseCase };
//# sourceMappingURL=confirm.chapter.pooling.booking.js.map