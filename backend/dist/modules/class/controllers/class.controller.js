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
import { CreateClassSchema } from "../dtos/class.create.dto.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
let ClassController = class ClassController {
    _createClassUseCase;
    _editClassUseCase;
    _getClassesForUserUseCase;
    _getClassesForAdminUseCase;
    constructor(_createClassUseCase, _editClassUseCase, _getClassesForUserUseCase, _getClassesForAdminUseCase) {
        this._createClassUseCase = _createClassUseCase;
        this._editClassUseCase = _editClassUseCase;
        this._getClassesForUserUseCase = _getClassesForUserUseCase;
        this._getClassesForAdminUseCase = _getClassesForAdminUseCase;
    }
    /** 🏗️ Create class (Admin) */
    async createClass(req, res) {
        try {
            const dto = CreateClassSchema.parse(req.body);
            await this._createClassUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.CLASS_CREATED,
            });
        }
        catch (error) {
            console.log("Error in createClass:", error);
            handleError(res, error);
        }
    }
    /** ✏️ Edit class (Admin) */
    async editClass(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const dto = CreateClassSchema.parse(req.body);
            await this._editClassUseCase.execute(id, dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.CLASS_UPDATED,
            });
        }
        catch (error) {
            console.log("Error in editClass:", error);
            handleError(res, error);
        }
    }
    /** 👤 User: get active classes for dropdown */
    async getClassesForUser(req, res) {
        try {
            const classes = await this._getClassesForUserUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                success: true,
                data: classes,
            });
        }
        catch (error) {
            console.log("Error in getClassesForUser:", error);
            handleError(res, error);
        }
    }
    /** 🛠️ Admin: get all classes (including deleted) */
    async getClassesForAdmin(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted"]));
            const { data, total } = await this._getClassesForAdminUseCase.execute(dto);
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
            console.log("Error in getClassesForAdmin:", error);
            handleError(res, error);
        }
    }
};
ClassController = __decorate([
    injectable(),
    __param(0, inject("ICreateClassUseCase")),
    __param(1, inject("IEditClassUseCase")),
    __param(2, inject("IGetClassesForUserUseCase")),
    __param(3, inject("IGetClassesForAdminUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ClassController);
export { ClassController };
//# sourceMappingURL=class.controller.js.map