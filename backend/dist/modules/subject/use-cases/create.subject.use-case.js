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
import { Subject } from "../entities/subject.entity.js";
import { SubjectVariant } from "../../subject-variant/entities/subject.variant.entity.js";
let CreateSubjectUseCase = class CreateSubjectUseCase {
    _subjectRepository;
    _subjectVariantRepository;
    _classRepository;
    _syllabusRepository;
    constructor(_subjectRepository, _subjectVariantRepository, _classRepository, _syllabusRepository) {
        this._subjectRepository = _subjectRepository;
        this._subjectVariantRepository = _subjectVariantRepository;
        this._classRepository = _classRepository;
        this._syllabusRepository = _syllabusRepository;
    }
    async execute(dto) {
        // Normalize subject name to enforce case/whitespace–insensitive uniqueness
        const normalizedName = dto.name.trim();
        // Ensure subject with same name does not already exist
        const existing = await this._subjectRepository.findByName(normalizedName);
        if (existing && !existing.isDeleted) {
            throw new CustomError(ResponseMessages.SUBJECT_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
        }
        /**
         * Validation phase (read-only):
         * - ensure all referenced syllabuses exist
         * - ensure all referenced classes exist
         * No database mutations should occur in this phase.
         */
        for (const item of dto.syllabusAndClass) {
            if (!(await this._syllabusRepository.findById(item.syllabus))) {
                throw new CustomError(ResponseMessages.SYLLABUS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
            }
            for (const classId of item.classes) {
                if (!(await this._classRepository.findById(classId))) {
                    throw new CustomError(ResponseMessages.CLASS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
                }
            }
        }
        /**
         * Create subject first.
         * Variants depend on subject ID, so subject must exist before validation
         * of subject-variant combinations.
         */
        const subjectEntity = new Subject({
            id: null,
            name: normalizedName,
            isDeleted: false,
        });
        const subject = await this._subjectRepository.create(subjectEntity);
        if (!subject) {
            throw new CustomError(ResponseMessages.SUBJECT_CREATION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        /**
         * Mutation phase:
         * All validations have passed, safe to create subject variants.
         * Existing variants are skipped to keep operation idempotent.
         */
        for (const item of dto.syllabusAndClass) {
            for (const classId of item.classes) {
                const existingVariant = await this._subjectVariantRepository.findByCombination(subject.id, classId, item.syllabus);
                if (existingVariant && !existingVariant.isDeleted) {
                    continue;
                }
                const variant = new SubjectVariant({
                    id: null,
                    subjectId: subject.id,
                    classId,
                    syllabusId: item.syllabus,
                    isDeleted: false,
                });
                await this._subjectVariantRepository.create(variant);
            }
        }
    }
};
CreateSubjectUseCase = __decorate([
    injectable(),
    __param(0, inject("ISubjectRepository")),
    __param(1, inject("ISubjectVariantRepository")),
    __param(2, inject("IClassRepository")),
    __param(3, inject("ISyllabusRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CreateSubjectUseCase);
export { CreateSubjectUseCase };
//# sourceMappingURL=create.subject.use-case.js.map