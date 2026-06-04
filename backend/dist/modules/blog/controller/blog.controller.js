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
import { CreateBlogSchema } from "../dto/create.blog.dto.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
let BlogController = class BlogController {
    _createBlogUseCase;
    _editBlogUseCase;
    _blockBlogUseCase;
    _unblockBlogUseCase;
    _getAllBlogUseCase;
    _getBlogDetailsUseCase;
    constructor(_createBlogUseCase, _editBlogUseCase, _blockBlogUseCase, _unblockBlogUseCase, _getAllBlogUseCase, _getBlogDetailsUseCase) {
        this._createBlogUseCase = _createBlogUseCase;
        this._editBlogUseCase = _editBlogUseCase;
        this._blockBlogUseCase = _blockBlogUseCase;
        this._unblockBlogUseCase = _unblockBlogUseCase;
        this._getAllBlogUseCase = _getAllBlogUseCase;
        this._getBlogDetailsUseCase = _getBlogDetailsUseCase;
    }
    async createBlog(req, res) {
        try {
            const dto = CreateBlogSchema.parse(req.body);
            await this._createBlogUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.BLOG_CREATED,
            });
        }
        catch (error) {
            console.log("Error in createBlog:", error);
            handleError(res, error);
        }
    }
    async editBlog(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const dto = CreateBlogSchema.parse(req.body);
            await this._editBlogUseCase.execute(id, dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.BLOG_UPDATED,
            });
        }
        catch (error) {
            console.log("Error in editBlog:", error);
            handleError(res, error);
        }
    }
    async blockBlog(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._blockBlogUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.BLOG_DELETED,
            });
        }
        catch (error) {
            console.log("Error in blockBlog:", error);
            handleError(res, error);
        }
    }
    async unblockBlog(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._unblockBlogUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.BLOG_UPDATED,
            });
        }
        catch (error) {
            console.log("Error in unblockBlog:", error);
            handleError(res, error);
        }
    }
    async getAllBlogForAdmin(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted", "isFeatured"]));
            const { data, total } = await this._getAllBlogUseCase.execute(dto, "admin");
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
            console.log("Error in getAllBlogForAdmin:", error);
            handleError(res, error);
        }
    }
    async getAllBlogForUser(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["isFeatured"]));
            const { data, total } = await this._getAllBlogUseCase.execute(dto, "user");
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data,
                total,
                currentPage: dto.page,
                totalPages: Math.ceil(total / dto.limit),
                /* keep legacy field so existing consumers don't break */
                totalPage: total,
            });
        }
        catch (error) {
            console.log("Error in getAllBlogForUser:", error);
            handleError(res, error);
        }
    }
    async getFullBlogDetails(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const blog = await this._getBlogDetailsUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data: blog,
            });
        }
        catch (error) {
            console.log("Error in getFullBlogDetails:", error);
            handleError(res, error);
        }
    }
};
BlogController = __decorate([
    injectable(),
    __param(0, inject("ICreateBlogUseCase")),
    __param(1, inject("IEditBlogUseCase")),
    __param(2, inject("IBlockBlogUseCase")),
    __param(3, inject("IUnblockBlogUseCase")),
    __param(4, inject("IGetAllBlogUseCase")),
    __param(5, inject("IGetBlogDetailsUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], BlogController);
export { BlogController };
//# sourceMappingURL=blog.controller.js.map