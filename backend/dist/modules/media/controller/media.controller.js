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
let MediaController = class MediaController {
    generateUploadSignatureUseCase;
    constructor(generateUploadSignatureUseCase) {
        this.generateUploadSignatureUseCase = generateUploadSignatureUseCase;
    }
    async UploadSignature(req, res) {
        try {
            const result = this.generateUploadSignatureUseCase.execute();
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: ResponseMessages.SUCCESS,
                data: result
            });
        }
        catch (error) {
            handleError(res, error);
            console.log("error in get cloudinary api");
        }
    }
};
MediaController = __decorate([
    injectable(),
    __param(0, inject("IGenerateUploadSignatureUseCase")),
    __metadata("design:paramtypes", [Object])
], MediaController);
export { MediaController };
//# sourceMappingURL=media.controller.js.map