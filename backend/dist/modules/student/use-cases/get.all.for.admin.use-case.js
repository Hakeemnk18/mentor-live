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
let GetAllForAdminStudentUseCase = class GetAllForAdminStudentUseCase {
    _studentRepository;
    constructor(_studentRepository) {
        this._studentRepository = _studentRepository;
    }
    async execute(dto) {
        const { page, search, limit, filters } = dto;
        let query = {};
        let sort = {
            createdAt: 1,
        };
        if (search && search.trim() !== "") {
            const escapedSearch = search
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query.$or = [
                { name: { $regex: escapedSearch, $options: "i" } },
                { phoneNumber: { $regex: escapedSearch, $options: "i" } },
                { place: { $regex: escapedSearch, $options: "i" } },
                { school: { $regex: escapedSearch, $options: "i" } },
            ];
        }
        // ---- FILTERS ----
        if (filters && Object.keys(filters).length > 0) {
            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== null && value !== "") {
                    query[key] = value;
                }
            }
        }
        let allDoc = {
            page,
            limit,
            query,
            sort,
        };
        const [data, total] = await Promise.all([
            this._studentRepository.findAllForAdmin(allDoc),
            this._studentRepository.countDocument(query)
        ]);
        return { data, total };
    }
};
GetAllForAdminStudentUseCase = __decorate([
    injectable(),
    __param(0, inject("IStudentRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllForAdminStudentUseCase);
export { GetAllForAdminStudentUseCase };
//# sourceMappingURL=get.all.for.admin.use-case.js.map