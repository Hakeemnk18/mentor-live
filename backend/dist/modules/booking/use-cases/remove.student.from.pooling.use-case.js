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
let RemoveStudentFromPoolingUseCase = class RemoveStudentFromPoolingUseCase {
    _bookingRepository;
    _facultyRepository;
    constructor(_bookingRepository, _facultyRepository) {
        this._bookingRepository = _bookingRepository;
        this._facultyRepository = _facultyRepository;
    }
    async execute(dto) {
        //find the booking to ensure it exists
        const query = {
            userId: dto.userId,
            facultyId: dto.facultyId,
            type: "pooling",
            status: "interested",
            mode: dto.mode,
            isDeleted: false,
        };
        if (dto.mode === "slot") {
            query.slotId = [dto.slotId];
        }
        else if (dto.mode === "chapter") {
            query.chapterId = dto.chapterId;
        }
        const booking = await this._bookingRepository.findByQuery(query);
        if (!booking) {
            throw new CustomError(ResponseMessages.BOOKING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            await this._facultyRepository.removeUserFromPool(dto, session);
            await this._bookingRepository.cancelBookingsByIds([booking.id], session);
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
RemoveStudentFromPoolingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IFacultyRepository")),
    __metadata("design:paramtypes", [Object, Object])
], RemoveStudentFromPoolingUseCase);
export { RemoveStudentFromPoolingUseCase };
//# sourceMappingURL=remove.student.from.pooling.use-case.js.map