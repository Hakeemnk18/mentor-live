type CropArea = { x: number; y: number; width: number; height: number };

type CropOptions = {
  /** Fixed output width in px (height follows the crop's ratio). Omit to keep the crop's native size. */
  outputWidth?: number;
  /** JPEG quality 0–1. Omit for the browser default. */
  quality?: number;
};

export async function getCroppedImage(
  imageSrc: string,
  crop: CropArea,
  options: CropOptions = {}
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const outW = options.outputWidth ?? crop.width;
  const outH = options.outputWidth
    ? Math.round((options.outputWidth * crop.height) / crop.width)
    : crop.height;

  canvas.width = outW;
  canvas.height = outH;

  if (options.outputWidth) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outW,
    outH
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(
          new File([blob!], "cropped.jpg", { type: "image/jpeg" })
        );
      },
      "image/jpeg",
      options.quality
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
  });
}
