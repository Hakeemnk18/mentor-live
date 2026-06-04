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
let BlockBlogUseCase = class BlockBlogUseCase {
    _blogRepository;
    constructor(_blogRepository) {
        this._blogRepository = _blogRepository;
    }
    async execute(id) {
        const blog = await this._blogRepository.findById(id);
        if (!blog) {
            throw new CustomError(ResponseMessages.BLOG_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        if (blog.isDeleted) {
            throw new CustomError(ResponseMessages.BLOG_ALREADY_DELETED, HttpStatusCode.BAD_REQUEST);
        }
        const deleted = blog.delete();
        await this._blogRepository.save(deleted);
    }
};
BlockBlogUseCase = __decorate([
    injectable(),
    __param(0, inject("IBlogRepository")),
    __metadata("design:paramtypes", [Object])
], BlockBlogUseCase);
export { BlockBlogUseCase };
//# sourceMappingURL=block.blog.use-case.js.map