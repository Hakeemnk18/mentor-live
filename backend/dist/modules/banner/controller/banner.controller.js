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
import { z } from "zod";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
import { CreateBannerSchema } from "../dto/create.banner.dto.js";
const ToggleShowSchema = z.object({
    isShow: z.boolean(),
    priority: z.number().int().min(1).max(5).optional(),
});
let BannerController = class BannerController {
    _createBannerUseCase;
    _editBannerUseCase;
    _deleteBannerUseCase;
    _getAllBannerUseCase;
    _getAllBannerForAdminUseCase;
    _toggleBannerShowUseCase;
    constructor(_createBannerUseCase, _editBannerUseCase, _deleteBannerUseCase, _getAllBannerUseCase, _getAllBannerForAdminUseCase, _toggleBannerShowUseCase) {
        this._createBannerUseCase = _createBannerUseCase;
        this._editBannerUseCase = _editBannerUseCase;
        this._deleteBannerUseCase = _deleteBannerUseCase;
        this._getAllBannerUseCase = _getAllBannerUseCase;
        this._getAllBannerForAdminUseCase = _getAllBannerForAdminUseCase;
        this._toggleBannerShowUseCase = _toggleBannerShowUseCase;
    }
    async createBanner(req, res) {
        try {
            const dto = CreateBannerSchema.parse(req.body);
            await this._createBannerUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.BANNER_CREATED,
            });
        }
        catch (error) {
            console.log("Error in createBanner:", error);
            handleError(res, error);
        }
    }
    async editBanner(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const dto = CreateBannerSchema.parse(req.body);
            await this._editBannerUseCase.execute(id, dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.BANNER_UPDATED,
            });
        }
        catch (error) {
            console.log("Error in editBanner:", error);
            handleError(res, error);
        }
    }
    async deleteBanner(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._deleteBannerUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.BANNER_DELETED,
            });
        }
        catch (error) {
            console.log("Error in deleteBanner:", error);
            handleError(res, error);
        }
    }
    async toggleBannerShow(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const { isShow, priority } = ToggleShowSchema.parse(req.body);
            await this._toggleBannerShowUseCase.execute(id, isShow, priority);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: isShow
                    ? "Banner is now visible to users"
                    : "Banner is now hidden from users",
            });
        }
        catch (error) {
            console.log("Error in toggleBannerShow:", error);
            handleError(res, error);
        }
    }
    async getAllBannerForAdmin(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["isShow"]));
            const { data: banners, total } = await this._getAllBannerForAdminUseCase.execute(dto);
            const data = banners.map((b) => ({
                id: b.id,
                image: b.image,
                description: b.description,
                priority: b.priority,
                isShow: b.isShow,
                isClickable: b.isClickable,
                buttonText: b.buttonText,
                isDeleted: b.isDeleted,
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
            console.log("Error in getAllBannerForAdmin:", error);
            handleError(res, error);
        }
    }
    async getAllBannerForUser(req, res) {
        try {
            const banners = await this._getAllBannerUseCase.execute();
            const data = banners.map((b) => ({
                image: b.image.url,
                description: b.description,
                priority: b.priority,
                isClickable: b.isClickable,
                buttonText: b.buttonText,
            }));
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data,
            });
        }
        catch (error) {
            console.log("Error in getAllBannerForUser:", error);
            handleError(res, error);
        }
    }
};
BannerController = __decorate([
    injectable(),
    __param(0, inject("ICreateBannerUseCase")),
    __param(1, inject("IEditBannerUseCase")),
    __param(2, inject("IDeleteBannerUseCase")),
    __param(3, inject("IGetAllBannerUseCase")),
    __param(4, inject("IGetAllBannerForAdminUseCase")),
    __param(5, inject("IToggleBannerShowUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], BannerController);
export { BannerController };
//# sourceMappingURL=banner.controller.js.map