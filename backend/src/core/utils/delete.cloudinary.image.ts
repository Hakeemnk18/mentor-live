import cloudinary from "../../config/cloudinary.js";

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  if (!publicId) {
    throw new Error("publicId is required to delete image");
  }

  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("Failed to delete image from Cloudinary");
  }
}
