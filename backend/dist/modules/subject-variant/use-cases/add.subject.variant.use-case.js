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
import { SubjectVariant } from "../entities/subject.variant.entity.js";
let AddSubjectVariantUseCase = class AddSubjectVariantUseCase {
    _subjectVariantRepository;
    _subjectRepository;
    _classRepository;
    _syllabusRepository;
    constructor(_subjectVariantRepository, _subjectRepository, _classRepository, _syllabusRepository) {
        this._subjectVariantRepository = _subjectVariantRepository;
        this._subjectRepository = _subjectRepository;
        this._classRepository = _classRepository;
        this._syllabusRepository = _syllabusRepository;
    }
    async execute(subjectId, dto) {
        // Track duplicate (classId + syllabusId) within the same request
        const seen = new Set();
        // Ensure subject exists and is active
        const subject = await this._subjectRepository.findById(subjectId);
        if (!subject || subject.isDeleted) {
            throw new CustomError(ResponseMessages.SUBJECT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        /**
         * Validation phase:
         * - prevent duplicate variants in request
         * - ensure referenced class and syllabus exist
         * - ensure variant does not already exist for subject
         * No database mutations should happen here.
         */
        for (const { classId, syllabusId } of dto.variants) {
            const key = `${classId}:${syllabusId}`;
            if (seen.has(key)) {
                throw new CustomError(ResponseMessages.DUPLICATE_SUBJECT_VARIANT_IN_REQUEST, HttpStatusCode.BAD_REQUEST);
            }
            seen.add(key);
            if (!(await this._classRepository.findById(classId))) {
                throw new CustomError(ResponseMessages.CLASS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
            }
            if (!(await this._syllabusRepository.findById(syllabusId))) {
                throw new CustomError(ResponseMessages.SYLLABUS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
            }
            if (await this._subjectVariantRepository.findByCombination(subjectId, classId, syllabusId)) {
                throw new CustomError(ResponseMessages.SUBJECT_VARIANT_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
            }
        }
        /**
         * Mutation phase:
         * All validations have passed, safe to create variants.
         */
        for (const { classId, syllabusId } of dto.variants) {
            const variant = new SubjectVariant({
                id: null,
                subjectId,
                classId,
                syllabusId,
                isDeleted: false,
            });
            await this._subjectVariantRepository.create(variant);
        }
    }
};
AddSubjectVariantUseCase = __decorate([
    injectable(),
    __param(0, inject("ISubjectVariantRepository")),
    __param(1, inject("ISubjectRepository")),
    __param(2, inject("IClassRepository")),
    __param(3, inject("ISyllabusRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AddSubjectVariantUseCase);
export { AddSubjectVariantUseCase };
//# sourceMappingURL=add.subject.variant.use-case.js.map