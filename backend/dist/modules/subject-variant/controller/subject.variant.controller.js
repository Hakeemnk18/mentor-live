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
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { AddSubjectVariantSchema, } from "../dtos/add.subject.variant.dto.js";
import { GetSubjectVariantsByClassAndSyllabusQuerySchema } from "../dtos/get.all.variant.with.subject.dto.js";
let SubjectVariantController = class SubjectVariantController {
    _addSubjectVariantUseCase;
    _deleteSubjectVariantUseCase;
    _findSubjectVariantWithSubjectUseCase;
    constructor(_addSubjectVariantUseCase, _deleteSubjectVariantUseCase, _findSubjectVariantWithSubjectUseCase) {
        this._addSubjectVariantUseCase = _addSubjectVariantUseCase;
        this._deleteSubjectVariantUseCase = _deleteSubjectVariantUseCase;
        this._findSubjectVariantWithSubjectUseCase = _findSubjectVariantWithSubjectUseCase;
    }
    async addSubjectVariant(req, res) {
        try {
            const { subjectId } = req.params;
            validateObjectId(subjectId);
            const dto = AddSubjectVariantSchema.parse(req.body);
            await this._addSubjectVariantUseCase.execute(subjectId, dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.SUBJECT_VARIANT_CREATED,
            });
        }
        catch (error) {
            console.log("Error in addSubjectVariant:", error);
            handleError(res, error);
        }
    }
    async removeSubjectVariant(req, res) {
        try {
            const { subjectId, id } = req.params;
            validateObjectId(subjectId);
            validateObjectId(id);
            await this._deleteSubjectVariantUseCase.execute(subjectId, id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUBJECT_VARIANT_DELETED,
            });
        }
        catch (error) {
            console.log("Error in removeSubjectVariant:", error);
            handleError(res, error);
        }
    }
    async findAllSubjectVariantWithSubject(req, res) {
        try {
            const classId = req.query.classId;
            const syllabusId = req.query.syllabusId;
            const dto = GetSubjectVariantsByClassAndSyllabusQuerySchema.parse({ classId, syllabusId });
            const data = await this._findSubjectVariantWithSubjectUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data: data
            });
        }
        catch (error) {
            console.log("Error in get subject variant with subject name:", error);
            handleError(res, error);
        }
    }
};
SubjectVariantController = __decorate([
    injectable(),
    __param(0, inject("IAddSubjectVariantUseCase")),
    __param(1, inject("IDeleteSubjectVariantUseCase")),
    __param(2, inject("IFindSubjectVariantWithSubjectUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], SubjectVariantController);
export { SubjectVariantController };
//# sourceMappingURL=subject.variant.controller.js.map