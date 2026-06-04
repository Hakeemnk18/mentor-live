var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import cloudinary from "../../../config/cloudinary.js";
let GenerateUploadSignatureUseCase = class GenerateUploadSignatureUseCase {
    execute() {
        const timestamp = Math.round(Date.now() / 1000);
        const signature = cloudinary.utils.api_sign_request({
            timestamp,
            folder: "mentor-live",
        }, process.env.CLOUDINARY_API_SECRET);
        return {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            timestamp,
            signature,
        };
    }
};
GenerateUploadSignatureUseCase = __decorate([
    injectable()
], GenerateUploadSignatureUseCase);
export { GenerateUploadSignatureUseCase };
//# sourceMappingURL=generate.uploads.signature.use-case.js.map