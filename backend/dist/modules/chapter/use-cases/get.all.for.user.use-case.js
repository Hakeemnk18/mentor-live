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
let GetChaptersForUserUseCase = class GetChaptersForUserUseCase {
    _chapterRepository;
    _subjectVariantRepository;
    constructor(_chapterRepository, _subjectVariantRepository) {
        this._chapterRepository = _chapterRepository;
        this._subjectVariantRepository = _subjectVariantRepository;
    }
    async execute(dto) {
        const { syllabusId, classId, subjectId, sortValue, limit, search } = dto;
        let page = 1;
        let sort = {
            createdAt: 1,
        };
        if (sortValue === "price_asc") {
            sort = { price: 1, createdAt: 1 };
        }
        else if (sortValue === "price_desc") {
            sort = { price: -1, createdAt: 1 };
        }
        const data = await this._chapterRepository.findAllForUser({
            page,
            limit,
            search,
            subjectId,
            classId,
            syllabusId,
            sort,
            isDeleted: false
        });
        return data;
    }
};
GetChaptersForUserUseCase = __decorate([
    injectable(),
    __param(0, inject("IChapterRepository")),
    __param(1, inject("ISubjectVariantRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GetChaptersForUserUseCase);
export { GetChaptersForUserUseCase };
//# sourceMappingURL=get.all.for.user.use-case.js.map