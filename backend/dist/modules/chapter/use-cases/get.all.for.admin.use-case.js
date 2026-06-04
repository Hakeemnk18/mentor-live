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
import { Chapter } from "../entities/chapter.entity.js";
let GetChaptersForAdminUseCase = class GetChaptersForAdminUseCase {
    _chapterRepository;
    _subjectVariantRepository;
    constructor(_chapterRepository, _subjectVariantRepository) {
        this._chapterRepository = _chapterRepository;
        this._subjectVariantRepository = _subjectVariantRepository;
    }
    async execute(dto) {
        const { page, search, limit, sortValue, filters } = dto;
        let filteredSubjectVariantIds = [];
        let match = {};
        let query = {};
        let sort = {
            createdAt: 1,
        };
        if (search && search.trim() !== "") {
            query.name = { $regex: `^${search.trim()}`, $options: "i" };
        }
        if (filters && Object.keys(filters).length > 0) {
            if (filters.classId) {
                match.class = filters.classId;
            }
            if (filters.subjectId) {
                match.subject = filters.subjectId;
            }
            if (filters.syllabusId) {
                match.syllabus = filters.syllabusId;
            }
            if (filters.isDeleted !== undefined) {
                query.isDeleted = filters.isDeleted;
            }
            if (match && Object.keys(match).length > 0) {
                filteredSubjectVariantIds =
                    await this._subjectVariantRepository.findAllIds(match);
            }
        }
        if (filters && Object.keys(match).length > 0) {
            if (filteredSubjectVariantIds.length === 0) {
                return { data: [], total: 0 };
            }
            query.subjectVariant = { $in: filteredSubjectVariantIds };
        }
        if (sortValue === "price_asc") {
            sort = { price: 1 };
        }
        else if (sortValue === "price_desc") {
            sort = { price: -1 };
        }
        const allDoc = {
            page,
            limit,
            query,
            sort,
        };
        const [chapters, total] = await Promise.all([
            this._chapterRepository.findAllForAdmin(allDoc),
            this._chapterRepository.countDocument(query),
        ]);
        const subjectVariantIds = [
            ...new Set(chapters.map((c) => c.subjectVariant.toString())),
        ];
        const subjectVariants = await this._subjectVariantRepository.findAllWithPopulatedSUbject({
            _id: { $in: subjectVariantIds },
        });
        const subjectVariantMap = new Map(subjectVariants.map((v) => [v.id, v]));
        const data = chapters.map((chapter) => ({
            ...chapter,
            subjectVariant: subjectVariantMap.get(chapter.subjectVariant.toString()),
        }));
        return { data, total };
    }
};
GetChaptersForAdminUseCase = __decorate([
    injectable(),
    __param(0, inject("IChapterRepository")),
    __param(1, inject("ISubjectVariantRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GetChaptersForAdminUseCase);
export { GetChaptersForAdminUseCase };
//# sourceMappingURL=get.all.for.admin.use-case.js.map