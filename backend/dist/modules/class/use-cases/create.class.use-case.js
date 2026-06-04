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
import { Class } from "../entities/class.entity.js";
let CreateClassUseCase = class CreateClassUseCase {
    _classRepository;
    constructor(_classRepository) {
        this._classRepository = _classRepository;
    }
    async execute(dto) {
        const normalizedName = dto.name.trim();
        // 1️⃣ Check duplicate
        const existing = await this._classRepository.findByName(normalizedName);
        if (existing && !existing.isDeleted) {
            throw new CustomError(ResponseMessages.CLASS_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
        }
        // 2️⃣ If class exists but deleted → restore instead of creating
        if (existing && existing.isDeleted) {
            const restored = existing.restore();
            await this._classRepository.save(restored);
            return;
        }
        // 3️⃣ Create domain entity
        const classEntity = new Class({
            id: null,
            name: normalizedName,
            isDeleted: false,
        });
        // 4️⃣ Persist
        const createdClass = await this._classRepository.create(classEntity);
        if (!createdClass) {
            throw new CustomError(ResponseMessages.CLASS_CREATION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }
};
CreateClassUseCase = __decorate([
    injectable(),
    __param(0, inject("IClassRepository")),
    __metadata("design:paramtypes", [Object])
], CreateClassUseCase);
export { CreateClassUseCase };
//# sourceMappingURL=create.class.use-case.js.map