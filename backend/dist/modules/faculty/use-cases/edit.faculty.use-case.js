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
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { validateOnCreate } from "../../../core/utils/validate.time.slot.js";
let EditFacultyUseCase = class EditFacultyUseCase {
    _facultyRepository;
    _subjectVariantRepository;
    _chapterRepository;
    constructor(_facultyRepository, _subjectVariantRepository, _chapterRepository) {
        this._facultyRepository = _facultyRepository;
        this._subjectVariantRepository = _subjectVariantRepository;
        this._chapterRepository = _chapterRepository;
    }
    async execute(id, dto) {
        /* ---------- fetch faculty ---------- */
        const faculty = await this._facultyRepository.findById(id);
        if (!faculty || faculty.isDeleted) {
            throw new CustomError(ResponseMessages.FACULTY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        /* ---------- normalize & validate name ---------- */
        const normalizedName = dto.name.trim();
        if (normalizedName !== faculty.name) {
            const existing = await this._facultyRepository.findByName(normalizedName);
            if (existing && !existing.isDeleted && existing.id !== faculty.id) {
                throw new CustomError(ResponseMessages.FACULTY_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
            }
        }
        /* ---------- validate subject variants ---------- */
        for (const offering of dto.subjects) {
            const variant = await this._subjectVariantRepository.findById(offering.variantId);
            if (!variant || variant.isDeleted) {
                throw new CustomError(ResponseMessages.SUBJECT_VARIANT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
            }
        }
        /* ---------- apply edits (no slots touched) ---------- */
        const updateFaculty = faculty.updateProfile({
            name: normalizedName,
            qualifications: dto.qualifications,
            description: dto.description,
            demoClass: dto.demoClass,
            image: dto.image,
            subjectOffering: dto.subjects.map((s) => ({
                variantId: s.variantId,
                price: s.price,
            })),
        });
        /* ---------- persist ---------- */
        await this._facultyRepository.save(updateFaculty);
    }
};
EditFacultyUseCase = __decorate([
    injectable(),
    __param(0, inject("IFacultyRepository")),
    __param(1, inject("ISubjectVariantRepository")),
    __param(2, inject("IChapterRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], EditFacultyUseCase);
export { EditFacultyUseCase };
//# sourceMappingURL=edit.faculty.use-case.js.map