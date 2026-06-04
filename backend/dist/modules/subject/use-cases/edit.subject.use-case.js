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
let EditSubjectUseCase = class EditSubjectUseCase {
    _subjectRepository;
    constructor(_subjectRepository) {
        this._subjectRepository = _subjectRepository;
    }
    async execute(id, name) {
        const normalizedName = name.trim();
        // 1️⃣ Fetch subject
        const existingSubject = await this._subjectRepository.findById(id);
        if (!existingSubject) {
            throw new CustomError(ResponseMessages.SUBJECT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        // 2️⃣ If name is changing, check for duplicates
        if (existingSubject.name !== normalizedName) {
            const duplicate = await this._subjectRepository.findByName(normalizedName);
            if (duplicate && !duplicate.isDeleted) {
                throw new CustomError(ResponseMessages.SUBJECT_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
            }
        }
        // 3️⃣ Rename via domain
        const renamed = existingSubject.rename(normalizedName);
        // 4️⃣ Persist
        await this._subjectRepository.save(renamed);
    }
};
EditSubjectUseCase = __decorate([
    injectable(),
    __param(0, inject("ISubjectRepository")),
    __metadata("design:paramtypes", [Object])
], EditSubjectUseCase);
export { EditSubjectUseCase };
//# sourceMappingURL=edit.subject.use-case.js.map