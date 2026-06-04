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
import { Class } from "../entities/class.entity.js";
let GetClassesForAdminUseCase = class GetClassesForAdminUseCase {
    _classRepository;
    constructor(_classRepository) {
        this._classRepository = _classRepository;
    }
    async execute(dto) {
        const { page, search, limit } = dto;
        let query = {};
        let sort = {
            createdAt: 1
        };
        if (search && search.trim() !== "") {
            query.name = { $regex: `^${search.trim()}`, $options: "i" };
        }
        let allDoc = {
            page,
            limit,
            query,
            sort,
        };
        const [data, total] = await Promise.all([
            this._classRepository.findAllForAdmin(allDoc),
            this._classRepository.countDocument(query)
        ]);
        return { data, total };
    }
};
GetClassesForAdminUseCase = __decorate([
    injectable(),
    __param(0, inject("IClassRepository")),
    __metadata("design:paramtypes", [Object])
], GetClassesForAdminUseCase);
export { GetClassesForAdminUseCase };
//# sourceMappingURL=get.all.for.admin.use-case.js.map