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
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
let StudentController = class StudentController {
    _getStudentsForAdminUseCase;
    _blockStudentUseCase;
    _unblockStudentUseCase;
    constructor(_getStudentsForAdminUseCase, _blockStudentUseCase, _unblockStudentUseCase) {
        this._getStudentsForAdminUseCase = _getStudentsForAdminUseCase;
        this._blockStudentUseCase = _blockStudentUseCase;
        this._unblockStudentUseCase = _unblockStudentUseCase;
    }
    /** 🛠️ Admin: get all students */
    async getStudentsForAdmin(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted", "syllabus", "class"]));
            const { data, total } = await this._getStudentsForAdminUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data,
                total,
                currentPage: dto.page,
                totalPages: Math.ceil(total / dto.limit),
            });
        }
        catch (error) {
            console.log("Error in getStudentsForAdmin:", error);
            handleError(res, error);
        }
    }
    /** 🚫 Admin: block student */
    async blockStudent(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._blockStudentUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.STUDENT_BLOCKED,
            });
        }
        catch (error) {
            console.log("Error in blockStudent:", error);
            handleError(res, error);
        }
    }
    /** ✅ Admin: unblock student */
    async unblockStudent(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._unblockStudentUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.STUDENT_UNBLOCKED,
            });
        }
        catch (error) {
            console.log("Error in unblockStudent:", error);
            handleError(res, error);
        }
    }
};
StudentController = __decorate([
    injectable(),
    __param(0, inject("IGetAllForAdminStudentUseCase")),
    __param(1, inject("IBlockStudentUseCase")),
    __param(2, inject("IUnblockStudentUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], StudentController);
export { StudentController };
//# sourceMappingURL=student.controller.js.map