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
let FindSubjectVariantWithSubjectUseCase = class FindSubjectVariantWithSubjectUseCase {
    _subjectVariantRepository;
    constructor(_subjectVariantRepository) {
        this._subjectVariantRepository = _subjectVariantRepository;
    }
    async execute(dto) {
        const { classId, syllabusId } = dto;
        const query = {
            class: classId,
            syllabus: syllabusId
        };
        return await this._subjectVariantRepository.findAllWithSubject(query);
    }
};
FindSubjectVariantWithSubjectUseCase = __decorate([
    injectable(),
    __param(0, inject("ISubjectVariantRepository")),
    __metadata("design:paramtypes", [Object])
], FindSubjectVariantWithSubjectUseCase);
export { FindSubjectVariantWithSubjectUseCase };
//# sourceMappingURL=find.subject.vatiant.with.subject.use-case.js.map