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
let EditClassUseCase = class EditClassUseCase {
    _classRepository;
    constructor(_classRepository) {
        this._classRepository = _classRepository;
    }
    async execute(id, dto) {
        const normalizedName = dto.name.trim();
        // 1️⃣ Fetch class
        const existingClass = await this._classRepository.findById(id);
        if (!existingClass) {
            throw new CustomError(ResponseMessages.CLASS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        // 2️⃣ If name is changing, check for duplicates
        if (existingClass.name !== normalizedName) {
            const duplicate = await this._classRepository.findByName(normalizedName);
            if (duplicate && !duplicate.isDeleted) {
                throw new CustomError(ResponseMessages.CLASS_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
            }
        }
        // 3️⃣ Rename via domain
        const renamed = existingClass.rename(normalizedName);
        // 4️⃣ Persist
        await this._classRepository.save(renamed);
    }
};
EditClassUseCase = __decorate([
    injectable(),
    __param(0, inject("IClassRepository")),
    __metadata("design:paramtypes", [Object])
], EditClassUseCase);
export { EditClassUseCase };
//# sourceMappingURL=edit.class.use-case.js.map