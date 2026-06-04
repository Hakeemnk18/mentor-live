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
import { buildFacultySort } from "../utils/faculty-sort.util.js";
let GetAllFacultyForAdminUseCase = class GetAllFacultyForAdminUseCase {
    _facultyRepository;
    constructor(_facultyRepository) {
        this._facultyRepository = _facultyRepository;
    }
    async execute(dto) {
        const { syllabusId, classId, subjectId, sortValue, limit, search, page, isDeleted, } = dto;
        const sort = buildFacultySort(sortValue);
        const { data, total } = await this._facultyRepository.findAllFacultyForAdmin({
            page,
            limit,
            search,
            subjectId,
            classId,
            syllabusId,
            sort,
            isDeleted,
        });
        return { data, total };
    }
};
GetAllFacultyForAdminUseCase = __decorate([
    injectable(),
    __param(0, inject("IFacultyRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllFacultyForAdminUseCase);
export { GetAllFacultyForAdminUseCase };
//# sourceMappingURL=get.all.faculty.for.admin.use-case.js.map