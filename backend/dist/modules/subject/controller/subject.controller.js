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
import { CreateSubjectSchema, } from "../dtos/subject.create.dto.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { EditSubjectSchema, } from "../dtos/edit.subject.dto.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
let SubjectController = class SubjectController {
    _createSubjectUseCase;
    _editSubjectUseCase;
    _getSubjectsForAdminUseCase;
    _getSubjectDetailsUseCase;
    _getAllSubjectForUserUseCase;
    constructor(_createSubjectUseCase, _editSubjectUseCase, _getSubjectsForAdminUseCase, _getSubjectDetailsUseCase, _getAllSubjectForUserUseCase) {
        this._createSubjectUseCase = _createSubjectUseCase;
        this._editSubjectUseCase = _editSubjectUseCase;
        this._getSubjectsForAdminUseCase = _getSubjectsForAdminUseCase;
        this._getSubjectDetailsUseCase = _getSubjectDetailsUseCase;
        this._getAllSubjectForUserUseCase = _getAllSubjectForUserUseCase;
    }
    async createSubject(req, res) {
        try {
            const dto = CreateSubjectSchema.parse(req.body);
            await this._createSubjectUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.SUBJECT_CREATED,
            });
        }
        catch (error) {
            console.log("Error in createSubject:", error);
            handleError(res, error);
        }
    }
    async editSubjectName(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const dto = EditSubjectSchema.parse(req.body);
            await this._editSubjectUseCase.execute(id, dto.name);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.SUBJECT_UPDATED,
            });
        }
        catch (error) {
            console.log("Error in Edit Subject:", error);
            handleError(res, error);
        }
    }
    async getAllSubjectForAdmin(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted"]));
            const { data, total } = await this._getSubjectsForAdminUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data: data,
                total: total,
                currentPage: dto.page,
                totalPages: Math.ceil(total / dto.limit),
            });
        }
        catch (error) {
            console.log("Error in get subject for admin", error);
            handleError(res, error);
        }
    }
    async getSubjectDetails(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const data = await this._getSubjectDetailsUseCase.execute(id);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data: data
            });
        }
        catch (error) {
            console.log("Error in get subject details for admin", error);
            handleError(res, error);
        }
    }
    async getAllSubjectForUser(req, res) {
        try {
            const data = await this._getAllSubjectForUserUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data: data,
            });
        }
        catch (error) {
            console.log("Error in get subject for user", error);
            handleError(res, error);
        }
    }
};
SubjectController = __decorate([
    injectable(),
    __param(0, inject("ICreateSubjectUseCase")),
    __param(1, inject("IEditSubjectUseCase")),
    __param(2, inject("IGetSubjectsForAdminUseCase")),
    __param(3, inject("IGetSubjectDetailsUseCase")),
    __param(4, inject("IGetAllSubjectForUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], SubjectController);
export { SubjectController };
//# sourceMappingURL=subject.controller.js.map