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
let DeleteSubjectVariantUseCase = class DeleteSubjectVariantUseCase {
    _subjectVariantRepository;
    constructor(_subjectVariantRepository) {
        this._subjectVariantRepository = _subjectVariantRepository;
    }
    async execute(subjectId, variantId) {
        const variant = await this._subjectVariantRepository.findOne({
            _id: variantId,
            subject: subjectId,
            isDeleted: false,
        });
        if (!variant) {
            throw new CustomError(ResponseMessages.SUBJECT_VARIANT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        // 2️⃣ Count how many variants this subject has
        const count = await this._subjectVariantRepository.countDocument({
            subject: subjectId,
            isDeleted: false,
        });
        if (count <= 1) {
            throw new CustomError(ResponseMessages.SUBJECT_VARIANT_CANNOT_DELETE_LAST, HttpStatusCode.BAD_REQUEST);
        }
        // 3️⃣ Delete safely (now guaranteed ownership)
        await this._subjectVariantRepository.delete(subjectId, variantId);
    }
};
DeleteSubjectVariantUseCase = __decorate([
    injectable(),
    __param(0, inject("ISubjectVariantRepository")),
    __metadata("design:paramtypes", [Object])
], DeleteSubjectVariantUseCase);
export { DeleteSubjectVariantUseCase };
//# sourceMappingURL=delete.subject.variant.use-case.js.map