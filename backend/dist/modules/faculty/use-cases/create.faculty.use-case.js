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
import { Faculty } from "../entities/faculty.entity.js";
import { toMinutes, validateOnCreate } from "../../../core/utils/validate.time.slot.js";
let CreateFacultyUseCase = class CreateFacultyUseCase {
    _facultyRepository;
    _subjectVariantRepository;
    _chapterRepository;
    constructor(_facultyRepository, _subjectVariantRepository, _chapterRepository) {
        this._facultyRepository = _facultyRepository;
        this._subjectVariantRepository = _subjectVariantRepository;
        this._chapterRepository = _chapterRepository;
    }
    async execute(dto) {
        /* ---------- normalize name ---------- */
        const normalizedName = dto.name.trim();
        /* ---------- uniqueness check ---------- */
        const existing = await this._facultyRepository.findByName(normalizedName);
        if (existing && !existing.isDeleted) {
            throw new CustomError(ResponseMessages.FACULTY_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
        }
        /**
         * Validation phase (read-only)
         * - validate subject variants
         * - validate chapters (if provided)
         */
        for (const offering of dto.subjects) {
            const variant = await this._subjectVariantRepository.findById(offering.variantId);
            if (!variant || variant.isDeleted) {
                throw new CustomError(ResponseMessages.SUBJECT_VARIANT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
            }
        }
        if (dto.chapterSlots) {
            for (const slot of dto.chapterSlots) {
                const chapter = await this._chapterRepository.findById(slot.chapter);
                if (!chapter || chapter.isDeleted) {
                    throw new CustomError(ResponseMessages.CHAPTER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
                }
            }
        }
        if (!validateOnCreate(dto.slots)) {
            throw new CustomError(ResponseMessages.SLOT_TIME_NOT_VALID, HttpStatusCode.BAD_REQUEST);
        }
        /**
         * Create Faculty entity
         */
        const sortedSlots = [...dto.slots].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
        const facultyEntity = new Faculty({
            id: null,
            name: normalizedName,
            qualifications: dto.qualifications,
            description: dto.description,
            demoClass: dto.demoClass,
            image: dto.image,
            subjectOffering: dto.subjects.map((s) => ({
                variantId: s.variantId,
                price: s.price,
            })),
            slots: sortedSlots.map((slot) => ({
                time: slot.time,
                isAvailable: true,
                pool: [],
                poolLimit: 5,
            })),
            chapterSlots: (dto.chapterSlots ?? []).map((slot) => ({
                chapterId: slot.chapter,
                isAvailable: true,
                pool: [],
                poolLimit: 5,
            })),
            isDeleted: false,
        });
        const faculty = await this._facultyRepository.create(facultyEntity);
        if (!faculty) {
            throw new CustomError(ResponseMessages.FACULTY_CREATION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }
};
CreateFacultyUseCase = __decorate([
    injectable(),
    __param(0, inject("IFacultyRepository")),
    __param(1, inject("ISubjectVariantRepository")),
    __param(2, inject("IChapterRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateFacultyUseCase);
export { CreateFacultyUseCase };
//# sourceMappingURL=create.faculty.use-case.js.map