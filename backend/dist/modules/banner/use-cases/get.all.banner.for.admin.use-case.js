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
let GetAllBannerForAdminUseCase = class GetAllBannerForAdminUseCase {
    _bannerRepository;
    constructor(_bannerRepository) {
        this._bannerRepository = _bannerRepository;
    }
    async execute(dto) {
        const { page, limit, search, sortValue, filters } = dto;
        const query = {};
        if (search && search.trim() !== "") {
            const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query.description = { $regex: escaped, $options: "i" };
        }
        if (filters && Object.keys(filters).length > 0) {
            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== null && value !== "") {
                    query[key] = value;
                }
            }
        }
        let sort = { createdAt: -1 };
        if (sortValue === "priority")
            sort = { priority: 1, createdAt: -1 };
        const [data, total] = await Promise.all([
            this._bannerRepository.findAllForAdmin({ page, limit, query, sort }),
            this._bannerRepository.countDocument(query),
        ]);
        return { data, total };
    }
};
GetAllBannerForAdminUseCase = __decorate([
    injectable(),
    __param(0, inject("IBannerRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllBannerForAdminUseCase);
export { GetAllBannerForAdminUseCase };
//# sourceMappingURL=get.all.banner.for.admin.use-case.js.map