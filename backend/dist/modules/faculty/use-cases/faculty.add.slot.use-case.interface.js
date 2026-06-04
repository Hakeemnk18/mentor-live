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
import { toMinutes, validateOnCreate, } from "../../../core/utils/validate.time.slot.js";
let FacultyAddSlotUseCase = class FacultyAddSlotUseCase {
    _facultyRepository;
    constructor(_facultyRepository) {
        this._facultyRepository = _facultyRepository;
    }
    async execute(facultyId, dto) {
        /* ---------- fetch faculty ---------- */
        let faculty = await this._facultyRepository.findById(facultyId);
        if (!faculty || faculty.isDeleted) {
            throw new CustomError(ResponseMessages.FACULTY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        /* ---------- valid time ---------- */
        const lastSlot = faculty.slots.at(-1);
        const slotsToValidate = [
            ...(lastSlot ? [{ time: lastSlot.time }] : []),
            ...dto.slots,
        ];
        if (!validateOnCreate(slotsToValidate)) {
            throw new CustomError(ResponseMessages.SLOT_TIME_NOT_VALID, HttpStatusCode.BAD_REQUEST);
        }
        /* ---------- sort slot ---------- */
        const sortedSlots = [...dto.slots].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
        /* ---------- normalize times ---------- */
        const normalizedSlots = sortedSlots.map((s) => ({
            time: new Date(s.time),
        }));
        /* ---------- add slots via entity ---------- */
        faculty.addSlots(normalizedSlots);
        await this._facultyRepository.addSlots(facultyId, normalizedSlots);
    }
};
FacultyAddSlotUseCase = __decorate([
    injectable(),
    __param(0, inject("IFacultyRepository")),
    __metadata("design:paramtypes", [Object])
], FacultyAddSlotUseCase);
export { FacultyAddSlotUseCase };
//# sourceMappingURL=faculty.add.slot.use-case.interface.js.map