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
import { deleteCloudinaryImage } from "../../../core/utils/delete.cloudinary.image.js";
let EditBlogUseCase = class EditBlogUseCase {
    _blogRepository;
    constructor(_blogRepository) {
        this._blogRepository = _blogRepository;
    }
    async execute(id, dto) {
        const existing = await this._blogRepository.findById(id);
        if (!existing) {
            throw new CustomError(ResponseMessages.BLOG_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        /* ---------- priority uniqueness (exclude self) ---------- */
        if (dto.priority != null && dto.priority !== existing.priority) {
            const taken = await this._blogRepository.getActivePriorities(id);
            if (taken.includes(dto.priority)) {
                throw new CustomError("A blog with this priority already exists", HttpStatusCode.BAD_REQUEST);
            }
        }
        /* ---------- persist ---------- */
        const updated = new Blog({
            id: existing.id,
            slug: existing.slug, // slug never changes on edit
            author: dto.author,
            heading: dto.heading,
            description: dto.description,
            content: dto.content,
            image: dto.image !== undefined ? (dto.image ?? null) : existing.image,
            priority: dto.priority !== undefined ? (dto.priority ?? null) : existing.priority,
            topic: dto.topic !== undefined ? (dto.topic ?? null) : existing.topic,
            isFeatured: dto.isFeatured ?? existing.isFeatured,
            isDeleted: existing.isDeleted,
        });
        await this._blogRepository.save(updated);
        /* ---------- delete old Cloudinary image if replaced ---------- */
        const oldPublicId = existing.image?.publicId;
        const newPublicId = updated.image?.publicId;
        if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
            try {
                await deleteCloudinaryImage(oldPublicId);
            }
            catch {
                /* non-fatal — log and continue */
                console.warn(`Failed to delete old blog image from Cloudinary: ${oldPublicId}`);
            }
        }
        /* ---------- if image was removed entirely, delete from Cloudinary ---------- */
        if (oldPublicId && !newPublicId) {
            try {
                await deleteCloudinaryImage(oldPublicId);
            }
            catch {
                console.warn(`Failed to delete removed blog image from Cloudinary: ${oldPublicId}`);
            }
        }
    }
};
EditBlogUseCase = __decorate([
    injectable(),
    __param(0, inject("IBlogRepository")),
    __metadata("design:paramtypes", [Object])
], EditBlogUseCase);
export { EditBlogUseCase };
//# sourceMappingURL=edit.blog.use-case.js.map