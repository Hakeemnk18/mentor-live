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
import { Syllabus } from "../entities/syllabus.entity.js";
let CreateSyllabusUseCase = class CreateSyllabusUseCase {
    _syllabusRepository;
    constructor(_syllabusRepository) {
        this._syllabusRepository = _syllabusRepository;
    }
    async execute(dto) {
        const normalizedName = dto.name.trim();
        // 1️⃣ Check duplicate
        const existing = await this._syllabusRepository.findByName(normalizedName);
        if (existing && !existing.isDeleted) {
            throw new CustomError(ResponseMessages.SYLLABUS_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
        }
        // 2️⃣ If syllabus exists but deleted → restore instead of creating
        if (existing && existing.isDeleted) {
            const restored = existing.restore();
            await this._syllabusRepository.save(restored);
            return;
        }
        // 3️⃣ Create domain entity
        const syllabusEntity = new Syllabus({
            id: null,
            name: normalizedName,
            isDeleted: false,
        });
        // 4️⃣ Persist
        const createdSyllabus = await this._syllabusRepository.create(syllabusEntity);
        if (!createdSyllabus) {
            throw new CustomError(ResponseMessages.SYLLABUS_CREATION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }
};
CreateSyllabusUseCase = __decorate([
    injectable(),
    __param(0, inject("ISyllabusRepository")),
    __metadata("design:paramtypes", [Object])
], CreateSyllabusUseCase);
export { CreateSyllabusUseCase };
//# sourceMappingURL=create.syllabus.use-case.js.map