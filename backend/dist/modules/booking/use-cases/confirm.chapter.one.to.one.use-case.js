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
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
let ConfirmChapterOneToOneBookingUseCase = class ConfirmChapterOneToOneBookingUseCase {
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
        if (booking.type !== "oneToOne" || booking.mode !== "chapter") {
            throw new CustomError(ResponseMessages.INVALID_BOOKING_TYPE, HttpStatusCode.BAD_REQUEST);
        }
        if (booking.status !== "interested") {
            throw new CustomError(ResponseMessages.INVALID_BOOKING_STATE, HttpStatusCode.BAD_REQUEST);
        }
        if (!booking.chapterId) {
            throw new CustomError(ResponseMessages.BOOKING_CHAPTER_ID_INVALID, HttpStatusCode.BAD_REQUEST);
        }
        // validate chapter slot exists
        const chapterSlot = await this._facultyRepo.getChapterSlot(booking.facultyId, booking.chapterId);
        if (!chapterSlot || !chapterSlot.isAvailable) {
            throw new CustomError(ResponseMessages.CHAPTER_SLOT_NOT_AVAILABLE, HttpStatusCode.BAD_REQUEST);
        }
        const facultySlots = await this._facultyRepo.getAllSlots(booking.facultyId);
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
        // mutation: booking
        const updatedBooking = booking.confirmWithSlots(dto.slotId);
        await this._bookingRepo.save(updatedBooking);
        // mutation: consume slots (atomic, repo-level)
        await this._facultyRepo.consumeSlots(booking.facultyId, dto.slotId);
        await this._bookingRepo.expireOtherBookingsForSlots({
            facultyId: booking.facultyId,
            slotIds: dto.slotId,
            excludeBookingIds: [booking.id]
        });
    }
};
ConfirmChapterOneToOneBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IFacultyRepository")),
    __metadata("design:paramtypes", [Object, Object])
], ConfirmChapterOneToOneBookingUseCase);
export { ConfirmChapterOneToOneBookingUseCase };
//# sourceMappingURL=confirm.chapter.one.to.one.use-case.js.map