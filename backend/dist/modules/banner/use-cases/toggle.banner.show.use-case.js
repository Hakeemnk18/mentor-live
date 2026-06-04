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
let ToggleBannerShowUseCase = class ToggleBannerShowUseCase {
    _bannerRepository;
    constructor(_bannerRepository) {
        this._bannerRepository = _bannerRepository;
    }
    async execute(id, isShow, priority) {
        const existing = await this._bannerRepository.findById(id);
        if (!existing) {
            throw new CustomError(ResponseMessages.BANNER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        if (isShow) {
            /* Priority is required to show a banner */
            const effectivePriority = priority ?? existing.priority;
            if (effectivePriority === null || effectivePriority === undefined) {
                throw new CustomError("Priority (1–5) is required to make the banner visible", HttpStatusCode.BAD_REQUEST);
            }
            if (effectivePriority < 1 || effectivePriority > 5) {
                throw new CustomError(ResponseMessages.BANNER_PRIORITY_INVALID, HttpStatusCode.BAD_REQUEST);
            }
            /* Check uniqueness among other visible banners */
            const taken = await this._bannerRepository.getActivePriorities(id);
            if (taken.includes(effectivePriority)) {
                throw new CustomError(ResponseMessages.BANNER_PRIORITY_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
            }
            await this._bannerRepository.save(existing.show(effectivePriority));
        }
        else {
            await this._bannerRepository.save(existing.hide());
        }
    }
};
ToggleBannerShowUseCase = __decorate([
    injectable(),
    __param(0, inject("IBannerRepository")),
    __metadata("design:paramtypes", [Object])
], ToggleBannerShowUseCase);
export { ToggleBannerShowUseCase };
//# sourceMappingURL=toggle.banner.show.use-case.js.map