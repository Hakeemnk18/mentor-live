import type { UploadSignature } from "../../type/medea.type.js";

export interface IGenerateUploadSignatureUseCase {
  execute(): UploadSignature;
}