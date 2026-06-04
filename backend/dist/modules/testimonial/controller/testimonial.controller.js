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
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { CreateTestimonialSchema } from "../dto/create.testimonial.dto.js";
let TestimonialController = class TestimonialController {
    _createTestimonialUseCase;
    _editTestimonialUseCase;
    _deleteTestimonialUseCase;
    _getAllTestimonialUseCase;
    constructor(_createTestimonialUseCase, _editTestimonialUseCase, _deleteTestimonialUseCase, _getAllTestimonialUseCase) {
        this._createTestimonialUseCase = _createTestimonialUseCase;
        this._editTestimonialUseCase = _editTestimonialUseCase;
        this._deleteTestimonialUseCase = _deleteTestimonialUseCase;
        this._getAllTestimonialUseCase = _getAllTestimonialUseCase;
    }
    async createTestimonial(req, res) {
        try {
            const dto = CreateTestimonialSchema.parse(req.body);
            await this._createTestimonialUseCase.execute(dto);
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.TESTIMONIAL_CREATED,
            });
        }
        catch (error) {
            console.log("Error in create Testimonial:", error);
            handleError(res, error);
        }
    }
    async editTestimonial(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            const dto = CreateTestimonialSchema.parse(req.body);
            await this._editTestimonialUseCase.execute(id, dto);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.TESTIMONIAL_UPDATED,
            });
        }
        catch (error) {
            console.log("Error in edit testimonial :", error);
            handleError(res, error);
        }
    }
    async deleteTestimonial(req, res) {
        try {
            const { id } = req.params;
            validateObjectId(id);
            await this._deleteTestimonialUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.TESTIMONIAL_DELETED,
            });
        }
        catch (error) {
            console.log("Error in delete testimonial :", error);
            handleError(res, error);
        }
    }
    async getAllTestimonialForAdmin(req, res) {
        try {
            const data = await this._getAllTestimonialUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data,
            });
        }
        catch (error) {
            console.log("Error in get testimonial for admin:", error);
            handleError(res, error);
        }
    }
    async getAllTestimonialForUser(req, res) {
        try {
            const testimonials = await this._getAllTestimonialUseCase.execute();
            //  User-specific response mapping
            const data = testimonials.map((testimonial) => ({
                comment: testimonial.comment,
                designation: testimonial.designation,
                author: testimonial.author
            }));
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data,
            });
        }
        catch (error) {
            console.log("Error in get testimonial for user:", error);
            handleError(res, error);
        }
    }
};
TestimonialController = __decorate([
    injectable(),
    __param(0, inject("ICreateTestimonialUseCase")),
    __param(1, inject("IEditTestimonialUseCase")),
    __param(2, inject("IDeleteTestimonialUseCase")),
    __param(3, inject("IGetAllTestimonialUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], TestimonialController);
export { TestimonialController };
//# sourceMappingURL=testimonial.controller.js.map