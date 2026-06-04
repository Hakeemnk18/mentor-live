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
let FacultyAddChapterSlotUseCase = class FacultyAddChapterSlotUseCase {
    _facultyRepository;
    _chapterRepository;
    constructor(_facultyRepository, _chapterRepository) {
        this._facultyRepository = _facultyRepository;
        this._chapterRepository = _chapterRepository;
    }
    async execute(facultyId, dto) {
        /* ---------- fetch faculty ---------- */
        let faculty = await this._facultyRepository.findById(facultyId);
        if (!faculty || faculty.isDeleted) {
            throw new CustomError(ResponseMessages.FACULTY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        for (const slot of dto.chapterSlots) {
            const chapter = await this._chapterRepository.findById(slot.chapter);
            if (!chapter || chapter.isDeleted) {
                throw new CustomError(ResponseMessages.CHAPTER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
            }
        }
        faculty.addChapterSlots(dto.chapterSlots);
        await this._facultyRepository.addChapterSlots(facultyId, dto);
    }
};
FacultyAddChapterSlotUseCase = __decorate([
    injectable(),
    __param(0, inject("IFacultyRepository")),
    __param(1, inject("IChapterRepository")),
    __metadata("design:paramtypes", [Object, Object])
], FacultyAddChapterSlotUseCase);
export { FacultyAddChapterSlotUseCase };
//# sourceMappingURL=faculty.add.chapter.slot.use-case.js.map