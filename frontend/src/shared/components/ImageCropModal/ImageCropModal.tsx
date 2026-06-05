import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { useCallback, useState } from "react";
import { getCroppedImage } from "./cropImage";

type Props = {
  open: boolean;
  image: string; // image URL / base64
  aspect?: number; // e.g. 1, 16/9
  onClose: () => void;
  onCropComplete: (file: File) => void;
};

export default function ImageCropModal({
  open,
  image,
  aspect = 1,
  onClose,
  onCropComplete,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const onCropDone = useCallback(async () => {
    if (!croppedAreaPixels) return;
    const file = await getCroppedImage(image, croppedAreaPixels);
    onCropComplete(file);
    onClose();
  }, [croppedAreaPixels, image, onClose, onCropComplete]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-lg p-4 shadow-lg">
        <div className="relative w-full h-[300px] bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedPixels) =>
              setCroppedAreaPixels(croppedPixels)
            }
          />
        </div>

        {/* Controls */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-gray-600">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={onCropDone}
              className="px-4 py-2 text-sm rounded bg-[#DB313E] text-white hover:bg-[#c72b36]"
            >
              Crop & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
