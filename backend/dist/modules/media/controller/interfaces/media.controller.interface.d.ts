import type { Request, Response } from "express";
export interface IMediaController {
    UploadSignature(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=media.controller.interface.d.ts.map