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
let GetAllLeadsUseCase = class GetAllLeadsUseCase {
    _leadRepository;
    constructor(_leadRepository) {
        this._leadRepository = _leadRepository;
    }
    async execute(dto) {
        const { page, search, limit, sortValue, filters } = dto;
        let query = {};
        let sort = { createdAt: -1 };
        /* ---------- filters (type, status) ---------- */
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
        /* ---------- search (name, phone) ---------- */
        if (search && search.trim() !== "") {
            const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query.$or = [
                { name: { $regex: escaped, $options: "i" } },
                { phone: { $regex: escaped, $options: "i" } },
                { purpose: { $regex: escaped, $options: "i" } },
            ];
        }
        const allDoc = { page, limit, query, sort };
        const [data, total] = await Promise.all([
            this._leadRepository.findAllForAdmin(allDoc),
            this._leadRepository.countDocument(query),
        ]);
        return { data, total };
    }
};
GetAllLeadsUseCase = __decorate([
    injectable(),
    __param(0, inject("ILeadRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllLeadsUseCase);
export { GetAllLeadsUseCase };
//# sourceMappingURL=get.all.leads.use-case.js.map