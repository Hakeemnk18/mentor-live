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
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
let UpdateLeadStatusUseCase = class UpdateLeadStatusUseCase {
    _leadRepository;
    constructor(_leadRepository) {
        this._leadRepository = _leadRepository;
    }
    async execute(id, status) {
        const existing = await this._leadRepository.findById(id);
        if (!existing) {
            throw new CustomError("Lead not found", HttpStatusCode.NOT_FOUND);
        }
        const updated = existing.updateStatus(status);
        await this._leadRepository.save(updated);
    }
};
UpdateLeadStatusUseCase = __decorate([
    injectable(),
    __param(0, inject("ILeadRepository")),
    __metadata("design:paramtypes", [Object])
], UpdateLeadStatusUseCase);
export { UpdateLeadStatusUseCase };
//# sourceMappingURL=update.lead.status.use-case.js.map