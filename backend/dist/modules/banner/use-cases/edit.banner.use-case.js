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
import { Banner } from "../entities/banner.entity.js";
let EditBannerUseCase = class EditBannerUseCase {
    _bannerRepository;
    constructor(_bannerRepository) {
        this._bannerRepository = _bannerRepository;
    }
    async execute(id, dto) {
        const existing = await this._bannerRepository.findById(id);
        if (!existing) {
            throw new CustomError(ResponseMessages.BANNER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        /* If visible with a priority, check uniqueness (excluding self) */
        const newIsShow = dto.isShow ?? existing.isShow;
        const newPriority = dto.priority ?? existing.priority;
        if (newIsShow && newPriority != null) {
            const taken = await this._bannerRepository.getActivePriorities(id);
            if (taken.includes(newPriority)) {
                throw new CustomError(ResponseMessages.BANNER_PRIORITY_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
            }
        }
        const updated = new Banner({
            id: existing.id,
            image: dto.image,
            description: dto.description,
            priority: dto.priority ?? existing.priority,
            isShow: dto.isShow ?? existing.isShow,
            isClickable: dto.isClickable ?? existing.isClickable,
            buttonText: dto.buttonText ?? existing.buttonText,
            isDeleted: existing.isDeleted,
        });
        await this._bannerRepository.save(updated);
    }
};
EditBannerUseCase = __decorate([
    injectable(),
    __param(0, inject("IBannerRepository")),
    __metadata("design:paramtypes", [Object])
], EditBannerUseCase);
export { EditBannerUseCase };
//# sourceMappingURL=edit.banner.use-case.js.map