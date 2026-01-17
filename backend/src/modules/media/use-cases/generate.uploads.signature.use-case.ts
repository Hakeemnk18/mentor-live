import { injectable } from "tsyringe";
import cloudinary from "../../../config/cloudinary.js";
import type { IGenerateUploadSignatureUseCase } from "./interfaces/generate.uploads.signature.use-case.interface.js";



@injectable()
export class GenerateUploadSignatureUseCase
  implements IGenerateUploadSignatureUseCase
{
  execute () {
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "mentor-live",
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      timestamp,
      signature,
    };
  }
}
