import type { Request, Response } from "express";
import type { IMediaController } from "./interfaces/media.controller.interface.js";
import type { IGenerateUploadSignatureUseCase } from "../use-cases/interfaces/generate.uploads.signature.use-case.interface.js";
export declare class MediaController implements IMediaController {
    private readonly generateUploadSignatureUseCase;
    constructor(generateUploadSignatureUseCase: IGenerateUploadSignatureUseCase);
    UploadSignature(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=media.controller.d.ts.map