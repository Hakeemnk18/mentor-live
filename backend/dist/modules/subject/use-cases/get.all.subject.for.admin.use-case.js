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
import { Subject } from "../entities/subject.entity.js";
let GetSubjectsForAdminUseCase = class GetSubjectsForAdminUseCase {
    _subjectRepository;
    constructor(_subjectRepository) {
        this._subjectRepository = _subjectRepository;
    }
    async execute(dto) {
        const { page, search, limit } = dto;
        let query = {};
        let sort = {
            createdAt: 1,
        };
        if (search && search.trim() !== "") {
            query.name = { $regex: `^${search.trim()}`, $options: "i" };
        }
        const allDoc = {
            page,
            limit,
            query,
            sort,
        };
        const [data, total] = await Promise.all([
            this._subjectRepository.findAllForAdmin(allDoc),
            this._subjectRepository.countDocument(query),
        ]);
        return { data, total };
    }
};
GetSubjectsForAdminUseCase = __decorate([
    injectable(),
    __param(0, inject("ISubjectRepository")),
    __metadata("design:paramtypes", [Object])
], GetSubjectsForAdminUseCase);
export { GetSubjectsForAdminUseCase };
//# sourceMappingURL=get.all.subject.for.admin.use-case.js.map