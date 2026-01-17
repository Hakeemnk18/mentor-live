import { container } from "tsyringe";
import type { IGenerateUploadSignatureUseCase } from "../modules/media/use-cases/interfaces/generate.uploads.signature.use-case.interface.js";
import { GenerateUploadSignatureUseCase } from "../modules/media/use-cases/generate.uploads.signature.use-case.js";

export const registerMediaDependencies = () => {
  
    container.register<IGenerateUploadSignatureUseCase>("IGenerateUploadSignatureUseCase", {
        useClass: GenerateUploadSignatureUseCase,
      });

};