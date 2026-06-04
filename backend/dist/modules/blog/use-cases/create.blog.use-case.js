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
import { Blog } from "../entities/blog.entity.js";
import { generateSlug } from "../utils/slug.create.helper.js";
let CreateBlogUseCase = class CreateBlogUseCase {
    _blogRepository;
    constructor(_blogRepository) {
        this._blogRepository = _blogRepository;
    }
    async execute(dto) {
        /* ---------- slug generation + uniqueness ---------- */
        const slug = generateSlug(dto.heading);
        const existing = await this._blogRepository.findBySlug(slug);
        if (existing) {
            throw new CustomError(ResponseMessages.BLOG_SLUG_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
        }
        /* ---------- priority uniqueness ---------- */
        if (dto.priority != null) {
            const taken = await this._blogRepository.getActivePriorities();
            if (taken.includes(dto.priority)) {
                throw new CustomError("A blog with this priority already exists", HttpStatusCode.BAD_REQUEST);
            }
        }
        /* ---------- create ---------- */
        const blogEntity = new Blog({
            id: null,
            slug,
            author: dto.author,
            heading: dto.heading,
            description: dto.description,
            content: dto.content,
            image: dto.image ?? null,
            priority: dto.priority ?? null,
            topic: dto.topic ?? null,
            isFeatured: dto.isFeatured ?? false,
            isDeleted: false,
        });
        const blog = await this._blogRepository.create(blogEntity);
        if (!blog) {
            throw new CustomError(ResponseMessages.BLOG_CREATION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }
};
CreateBlogUseCase = __decorate([
    injectable(),
    __param(0, inject("IBlogRepository")),
    __metadata("design:paramtypes", [Object])
], CreateBlogUseCase);
export { CreateBlogUseCase };
//# sourceMappingURL=create.blog.use-case.js.map