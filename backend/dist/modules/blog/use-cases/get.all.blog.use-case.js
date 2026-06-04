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
let GetAllBlogUseCase = class GetAllBlogUseCase {
    _blogRepository;
    constructor(_blogRepository) {
        this._blogRepository = _blogRepository;
    }
    async execute(dto, role) {
        const { page, search, limit, sortValue, filters } = dto;
        let query = {};
        let sort = { createdAt: -1 };
        if (role === "user") {
            query.isDeleted = false;
        }
        /* ---------- filters (isDeleted, isFeatured from parseReq) ---------- */
        if (filters && Object.keys(filters).length > 0) {
            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== null && value !== "") {
                    query[key] = value;
                }
            }
        }
        /* ---------- sort ---------- */
        if (sortValue === "oldest") {
            sort = { createdAt: 1 };
        }
        else if (sortValue === "newest") {
            sort = { createdAt: -1 };
        }
        else if (sortValue === "priority") {
            sort = { priority: 1, createdAt: -1 };
        }
        else if (sortValue === "featured") {
            sort = { isFeatured: -1, priority: 1, createdAt: -1 };
        }
        /* ---------- search (heading + author) ---------- */
        if (search && search.trim() !== "") {
            const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query.$or = [
                { heading: { $regex: escaped, $options: "i" } },
                { author: { $regex: escaped, $options: "i" } },
                { topic: { $regex: escaped, $options: "i" } },
            ];
        }
        const allDoc = { page, limit, query, sort };
        const [data, total] = await Promise.all([
            this._blogRepository.findAllForAdmin(allDoc),
            this._blogRepository.countDocument(query),
        ]);
        return { data, total };
    }
};
GetAllBlogUseCase = __decorate([
    injectable(),
    __param(0, inject("IBlogRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllBlogUseCase);
export { GetAllBlogUseCase };
//# sourceMappingURL=get.all.blog.use-case.js.map