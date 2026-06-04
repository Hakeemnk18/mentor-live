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
import { Testimonial } from "../entities/testimonial.entity.js";
let EditTestimonialUseCase = class EditTestimonialUseCase {
    _testimonialRepository;
    constructor(_testimonialRepository) {
        this._testimonialRepository = _testimonialRepository;
    }
    async execute(id, dto) {
        //  Fetch existing testimonial
        const existing = await this._testimonialRepository.findById(id);
        if (!existing) {
            throw new CustomError(ResponseMessages.TESTIMONIAL_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        //  Author uniqueness check (exclude self)
        if (existing.author !== dto.author) {
            const authorExists = await this._testimonialRepository.findByAuthor(dto.author);
            if (authorExists) {
                throw new CustomError(ResponseMessages.TESTIMONIAL_AUTHOR_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST);
            }
        }
        //  Rebuild domain entity (immutable update)
        const updated = new Testimonial({
            id: existing.id,
            author: dto.author,
            designation: dto.designation,
            comment: dto.comment,
            isDeleted: existing.isDeleted,
        });
        //  Persist
        await this._testimonialRepository.save(updated);
    }
};
EditTestimonialUseCase = __decorate([
    injectable(),
    __param(0, inject("ITestimonialRepository")),
    __metadata("design:paramtypes", [Object])
], EditTestimonialUseCase);
export { EditTestimonialUseCase };
//# sourceMappingURL=edit.testimonial.use-case.js.map