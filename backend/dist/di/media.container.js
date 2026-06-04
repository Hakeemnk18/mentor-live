import { container } from "tsyringe";
import { GenerateUploadSignatureUseCase } from "../modules/media/use-cases/generate.uploads.signature.use-case.js";
export const registerMediaDependencies = () => {
    container.register("IGenerateUploadSignatureUseCase", {
        useClass: GenerateUploadSignatureUseCase,
    });
};
//# sourceMappingURL=media.container.js.map