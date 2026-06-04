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
import { Chapter } from "../entities/chapter.entity.js";
import { deleteCloudinaryImage } from "../../../core/utils/delete.cloudinary.image.js";
let EditChapterUseCase = class EditChapterUseCase {
    _chapterRepository;
    _subjectVariantRepository;
    constructor(_chapterRepository, _subjectVariantRepository) {
        this._chapterRepository = _chapterRepository;
        this._subjectVariantRepository = _subjectVariantRepository;
    }
    async execute(id, dto) {
        const normalizedName = dto.name.trim();
        //  Fetch existing chapter
        const existing = await this._chapterRepository.findById(id);
        if (!existing) {
            throw new CustomError(ResponseMessages.CHAPTER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        //  If name or variant changes, check for duplicates
        if (existing.name !== normalizedName ||
            existing.subjectVariant !== dto.subjectVariant) {
            const duplicate = await this._chapterRepository.findByNameAndVariant(normalizedName, dto.subjectVariant);
            if (duplicate && !duplicate.isDeleted && duplicate.id !== id) {
                throw new CustomError(ResponseMessages.CHAPTER_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
            }
        }
        //  Validate Subject Variant existence
        const subjectVariant = await this._subjectVariantRepository.findById(dto.subjectVariant);
        if (!subjectVariant || subjectVariant.isDeleted) {
            throw new CustomError(ResponseMessages.SUBJECT_VARIANT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        // delete image if image changed
        if (dto.icon?.publicId && existing.icon.publicId !== dto.icon.publicId) {
            await deleteCloudinaryImage(existing.icon.publicId);
        }
        //  Rebuild domain entity (immutable update)
        const updated = new Chapter({
            id: existing.id,
            icon: dto.icon,
            name: normalizedName,
            price: dto.price,
            subjectVariant: dto.subjectVariant,
            isDeleted: existing.isDeleted,
        });
        //  Persist
        await this._chapterRepository.save(updated);
    }
};
EditChapterUseCase = __decorate([
    injectable(),
    __param(0, inject("IChapterRepository")),
    __param(1, inject("ISubjectVariantRepository")),
    __metadata("design:paramtypes", [Object, Object])
], EditChapterUseCase);
export { EditChapterUseCase };
//# sourceMappingURL=edit.chapter.use-case.js.map