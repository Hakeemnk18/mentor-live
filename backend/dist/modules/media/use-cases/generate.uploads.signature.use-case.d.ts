import type { IGenerateUploadSignatureUseCase } from "./interfaces/generate.uploads.signature.use-case.interface.js";
export declare class GenerateUploadSignatureUseCase implements IGenerateUploadSignatureUseCase {
    execute(): {
        cloudName: string;
        apiKey: string;
        timestamp: number;
        signature: string;
    };
}
//# sourceMappingURL=generate.uploads.signature.use-case.d.ts.map