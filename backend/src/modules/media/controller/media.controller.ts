import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IMediaController } from "./interfaces/media.controller.interface.js";
import type { IGenerateUploadSignatureUseCase } from "../use-cases/interfaces/generate.uploads.signature.use-case.interface.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";

@injectable()
export class MediaController implements IMediaController{
  constructor(
    @inject("IGenerateUploadSignatureUseCase")
    private readonly generateUploadSignatureUseCase: IGenerateUploadSignatureUseCase
  ) {}

  async UploadSignature(req: Request, res: Response): Promise<void> {
      try {
        const result = this.generateUploadSignatureUseCase.execute()

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: ResponseMessages.SUCCESS,
            data: result
        })
      } catch (error) {
        handleError(res, error)
        console.log("error in get cloudinary api")
      }
  }
}