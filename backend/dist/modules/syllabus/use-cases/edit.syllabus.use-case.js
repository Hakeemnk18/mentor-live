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
let EditSyllabusUseCase = class EditSyllabusUseCase {
    _syllabusRepository;
    constructor(_syllabusRepository) {
        this._syllabusRepository = _syllabusRepository;
    }
    async execute(id, dto) {
        const normalizedName = dto.name.trim();
        // 1️⃣ Fetch syllabus
        const existingSyllabus = await this._syllabusRepository.findById(id);
        if (!existingSyllabus) {
            throw new CustomError(ResponseMessages.SYLLABUS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        // 2️⃣ If name is changing, check for duplicates
        if (existingSyllabus.name !== normalizedName) {
            const duplicate = await this._syllabusRepository.findByName(normalizedName);
            if (duplicate && !duplicate.isDeleted) {
                throw new CustomError(ResponseMessages.SYLLABUS_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
            }
        }
        // 3️⃣ Rename via domain
        const renamed = existingSyllabus.rename(normalizedName);
        // 4️⃣ Persist
        await this._syllabusRepository.save(renamed);
    }
};
EditSyllabusUseCase = __decorate([
    injectable(),
    __param(0, inject("ISyllabusRepository")),
    __metadata("design:paramtypes", [Object])
], EditSyllabusUseCase);
export { EditSyllabusUseCase };
//# sourceMappingURL=edit.syllabus.use-case.js.map