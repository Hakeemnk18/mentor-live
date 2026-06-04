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
import { CreateUserSchema } from "../dtos/create.user.dto.js";
import { EditUserSchema } from "../dtos/edit.user.dto.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
let AdminUserController = class AdminUserController {
    _createUserUseCase;
    _editUserUseCase;
    _blockUserUseCase;
    _unblockUserUseCase;
    _getAllUsersUseCase;
    constructor(_createUserUseCase, _editUserUseCase, _blockUserUseCase, _unblockUserUseCase, _getAllUsersUseCase) {
        this._createUserUseCase = _createUserUseCase;
        this._editUserUseCase = _editUserUseCase;
        this._blockUserUseCase = _blockUserUseCase;
        this._unblockUserUseCase = _unblockUserUseCase;
        this._getAllUsersUseCase = _getAllUsersUseCase;
    }
    async createUser(req, res) {
        try {
            const dto = CreateUserSchema.parse(req.body);
            const user = await this._createUserUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.USER_CREATED,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isBlocked: user.isBlocked,
                    isVerified: user.isVerified,
                },
            });
        }
        catch (error) {
            console.log("Error in createUser:", error);
            handleError(res, error);
        }
    }
    async getAllUsers(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["isBlocked", "role"]));
            const { data: users, total } = await this._getAllUsersUseCase.execute(dto);
            const data = users.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                isBlocked: u.isBlocked,
                isVerified: u.isVerified,
            }));
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
            console.log("Error in getAllUsers:", error);
            handleError(res, error);
        }
    }
    async editUser(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const dto = EditUserSchema.parse(req.body);
            const user = await this._editUserUseCase.execute(id, dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.USER_UPDATED,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isBlocked: user.isBlocked,
                    isVerified: user.isVerified,
                },
            });
        }
        catch (error) {
            console.log("Error in editUser:", error);
            handleError(res, error);
        }
    }
    async blockUser(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._blockUserUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.USER_BLOCKED,
            });
        }
        catch (error) {
            console.log("Error in blockUser:", error);
            handleError(res, error);
        }
    }
    async unblockUser(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._unblockUserUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.USER_UNBLOCKED,
            });
        }
        catch (error) {
            console.log("Error in unblockUser:", error);
            handleError(res, error);
        }
    }
};
AdminUserController = __decorate([
    injectable(),
    __param(0, inject("ICreateUserUseCase")),
    __param(1, inject("IEditUserUseCase")),
    __param(2, inject("IBlockUserUseCase")),
    __param(3, inject("IUnblockUserUseCase")),
    __param(4, inject("IGetAllUsersUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AdminUserController);
export { AdminUserController };
//# sourceMappingURL=admin.user.controller.js.map