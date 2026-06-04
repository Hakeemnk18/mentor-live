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
let SetFacultySlotAvailabilityUseCase = class SetFacultySlotAvailabilityUseCase {
    _facultyRepository;
    constructor(_facultyRepository) {
        this._facultyRepository = _facultyRepository;
    }
    async execute(dto) {
        const { facultyId, mode, slotId, chapterId, isAvailable } = dto;
        const faculty = await this._facultyRepository.findById(facultyId);
        if (!faculty) {
            throw new CustomError(ResponseMessages.FACULTY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        if (faculty.isDeleted) {
            throw new CustomError(ResponseMessages.FACULTY_BLOCKED, HttpStatusCode.BAD_REQUEST);
        }
        // 🔹 Extract slot safely (read-only)
        const target = mode === "slot"
            ? faculty.slots.find((s) => s.id === slotId)
            : faculty.chapterSlots.find((c) => c.chapterId.toString() === chapterId);
        if (!target) {
            throw new CustomError(ResponseMessages.SLOT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        // ✅ Validation 1: already blocked / unblocked
        if (target.isAvailable === isAvailable) {
            throw new CustomError(isAvailable
                ? ResponseMessages.SLOT_ALREADY_UNBLOCKED
                : ResponseMessages.SLOT_ALREADY_BLOCKED, HttpStatusCode.BAD_REQUEST);
        }
        // ✅ Validation 2: pool must be empty when blocking
        if (!isAvailable && target.pool.length > 0) {
            throw new CustomError(ResponseMessages.SLOT_POOL_NOT_EMPTY, HttpStatusCode.CONFLICT);
        }
        // 🔹 Atomic update
        await this._facultyRepository.setSlotAvailability(dto);
    }
};
SetFacultySlotAvailabilityUseCase = __decorate([
    injectable(),
    __param(0, inject("IFacultyRepository")),
    __metadata("design:paramtypes", [Object])
], SetFacultySlotAvailabilityUseCase);
export { SetFacultySlotAvailabilityUseCase };
//# sourceMappingURL=set.faculty.slot.availability.usecase.js.map