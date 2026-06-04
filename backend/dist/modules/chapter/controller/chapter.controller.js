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
import { CreateChapterSchema } from "../dtos/create.chapter.dto.js";
import { FindByClassSyllabusQuerySchema } from "../../../core/shared/dtos/get.by.class.and.subject.dto.js";
import { parseListQuery } from "../../../core/utils/parse.list.query.helper.js";
import { ChapterListQuerySchema } from "../dtos/get.chapter.dto.js";
let ChapterController = class ChapterController {
    _createChapterUseCase;
    _editChapterUseCase;
    _getChaptersForUserUseCase;
    _getChaptersForAdminUseCase;
    _blockChapterUseCase;
    _unblockChapterUseCase;
    _getChapterNameUseCase;
    constructor(_createChapterUseCase, _editChapterUseCase, _getChaptersForUserUseCase, _getChaptersForAdminUseCase, _blockChapterUseCase, _unblockChapterUseCase, _getChapterNameUseCase) {
        this._createChapterUseCase = _createChapterUseCase;
        this._editChapterUseCase = _editChapterUseCase;
        this._getChaptersForUserUseCase = _getChaptersForUserUseCase;
        this._getChaptersForAdminUseCase = _getChaptersForAdminUseCase;
        this._blockChapterUseCase = _blockChapterUseCase;
        this._unblockChapterUseCase = _unblockChapterUseCase;
        this._getChapterNameUseCase = _getChapterNameUseCase;
    }
    /** 🏗️ Create chapter (Admin) */
    async createChapter(req, res) {
        try {
            const dto = CreateChapterSchema.parse(req.body);
            await this._createChapterUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.CHAPTER_CREATED,
            });
        }
        catch (error) {
            console.log("Error in createChapter:", error);
            handleError(res, error);
        }
    }
    /** ✏️ Edit chapter (Admin) */
    async editChapter(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const dto = CreateChapterSchema.parse(req.body);
            console.log("DTO in editChapter:", dto);
            await this._editChapterUseCase.execute(id, dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.CHAPTER_UPDATED,
            });
        }
        catch (error) {
            console.log("Error in editChapter:", error);
            handleError(res, error);
        }
    }
    /** 👤 User: get chapters for a subject variant */
    async getChaptersForUser(req, res) {
        try {
            const dto = ChapterListQuerySchema.parse(parseListQuery(req));
            const chapters = await this._getChaptersForUserUseCase.execute(dto);
            res.status(HttpStatusCode.OK).json({
                message: ResponseMessages.SUCCESS,
                success: true,
                data: chapters,
            });
        }
        catch (error) {
            console.log("Error in getChaptersForUser:", error);
            handleError(res, error);
        }
    }
    /** 🛠️ Admin: get all chapters (including deleted) */
    async getChaptersForAdmin(req, res) {
        try {
            const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted", "classId", "syllabusId", "subjectId"]));
            const { data, total } = await this._getChaptersForAdminUseCase.execute(dto);
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
            console.log("Error in getChaptersForAdmin:", error);
            handleError(res, error);
        }
    }
    /** 🚫 Block (soft-delete) chapter */
    async blockChapter(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._blockChapterUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.CHAPTER_DELETED,
            });
        }
        catch (error) {
            console.log("Error in blockChapter:", error);
            handleError(res, error);
        }
    }
    /** ♻️ Unblock (restore) chapter */
    async unblockChapter(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._unblockChapterUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.CHAPTER_RESTORED,
            });
        }
        catch (error) {
            console.log("Error in unblockChapter:", error);
            handleError(res, error);
        }
    }
    async getChapterNameAndId(req, res) {
        try {
            const chapters = await this._getChapterNameUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data: chapters,
            });
        }
        catch (error) {
            console.log("Error in getChapterNameAndId:", error);
            handleError(res, error);
        }
    }
};
ChapterController = __decorate([
    injectable(),
    __param(0, inject("ICreateChapterUseCase")),
    __param(1, inject("IEditChapterUseCase")),
    __param(2, inject("IGetChaptersForUserUseCase")),
    __param(3, inject("IGetChaptersForAdminUseCase")),
    __param(4, inject("IBlockChapterUseCase")),
    __param(5, inject("IUnblockChapterUseCase")),
    __param(6, inject("IGetChapterNameUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], ChapterController);
export { ChapterController };
//# sourceMappingURL=chapter.controller.js.map