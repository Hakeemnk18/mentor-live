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
import { CreateSyllabusSchema } from "../dtos/syllabus.create.dto.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
let SyllabusController = class SyllabusController {
    _createSyllabusUseCase;
    _editSyllabusUseCase;
    _getSyllabusesForUserUseCase;
    _getSyllabusesForAdminUseCase;
    constructor(_createSyllabusUseCase, _editSyllabusUseCase, _getSyllabusesForUserUseCase, _getSyllabusesForAdminUseCase) {
        this._createSyllabusUseCase = _createSyllabusUseCase;
        this._editSyllabusUseCase = _editSyllabusUseCase;
        this._getSyllabusesForUserUseCase = _getSyllabusesForUserUseCase;
        this._getSyllabusesForAdminUseCase = _getSyllabusesForAdminUseCase;
    }
    /** 🏗️ Create syllabus (Admin) */
    async createSyllabus(req, res) {
        try {
            const dto = CreateSyllabusSchema.parse(req.body);
            await this._createSyllabusUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.SYLLABUS_CREATED,
            });
        }
        catch (error) {
            console.log("Error in createSyllabus:", error);
            handleError(res, error);
        }
    }
    /** ✏️ Edit syllabus (Admin) */
    async editSyllabus(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const dto = CreateSyllabusSchema.parse(req.body);
            await this._editSyllabusUseCase.execute(id, dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SYLLABUS_UPDATED,
            });
        }
        catch (error) {
            console.log("Error in editSyllabus:", error);
            handleError(res, error);
        }
    }
    /** 👤 User: get active syllabuses for dropdown */
    async getSyllabusesForUser(req, res) {
        try {
            const syllabuses = await this._getSyllabusesForUserUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                success: true,
                data: syllabuses,
            });
        }
        catch (error) {
            console.log("Error in getSyllabusesForUser:", error);
            handleError(res, error);
        }
    }
    /** 🛠️ Admin: get all syllabuses (including deleted) */
    async getSyllabusesForAdmin(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted"]));
            const { data, total } = await this._getSyllabusesForAdminUseCase.execute(dto);
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
            console.log("Error in getSyllabusesForAdmin:", error);
            handleError(res, error);
        }
    }
};
SyllabusController = __decorate([
    injectable(),
    __param(0, inject("ICreateSyllabusUseCase")),
    __param(1, inject("IEditSyllabusUseCase")),
    __param(2, inject("IGetSyllabusesForUserUseCase")),
    __param(3, inject("IGetSyllabusesForAdminUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], SyllabusController);
export { SyllabusController };
//# sourceMappingURL=syllabus.controller.js.map