import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { useCallback, useState } from "react";
import { getCroppedImage } from "../../../shared/components/ImageCropModal/cropImage";
import { AdminButton } from "./ui";
import type { CropShapeSpec } from "./cropShapes";

type Props = {
  open: boolean;
  image: string;
  /** Locked shape, output size and quality hints */
  spec: CropShapeSpec;
  onClose: () => void;
  onCropComplete: (file: File) => void;
};

/** Cropper locked to one shape. The bright area is exactly what users will see. */
export default function ShapeCropModal({ open, image, spec, onClose, onCropComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const handleApply = useCallback(async () => {
    if (!area) return;
    setSaving(true);
    try {
      const file = await getCroppedImage(image, area, {
        // never upscale a small image — that only adds blur and weight
        outputWidth: Math.min(spec.outputWidth, Math.round(area.width)),
        quality: 0.9,
      });
      onCropComplete(file);
      onClose();
    } finally {
      setSaving(false);
    }
  }, [area, image, onClose, onCropComplete, spec.outputWidth]);

  if (!open) return null;

  const outW = area ? Math.min(spec.outputWidth, Math.round(area.width)) : null;
  const outH = outW ? Math.round(outW / spec.aspect) : null;
  const lowRes = area != null && area.width < spec.minSharpWidth;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EFE9FA]">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Crop {spec.name.toLowerCase()}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Drag to position, scroll or use the slider to zoom. The bright area is exactly what {spec.audience} will see.
            </p>
          </div>
          <span className="shrink-0 ml-3 px-2.5 py-1 rounded-full bg-[#F4F1FA] text-[#6D35D9] text-xs font-semibold">
            {spec.ratioLabel}
          </span>
        </div>

        <div className="relative w-full h-[min(56vh,440px)] bg-[#1b1030]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={spec.aspect}
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, px) => setArea(px)}
            style={{ cropAreaStyle: { border: "2px solid #fff", borderRadius: 14 } }}
          />
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-10">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-[#6D35D9]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={`text-xs ${lowRes ? "text-amber-600" : "text-gray-500"}`}>
              {outW
                ? lowRes
                  ? `Low resolution (${outW}×${outH}) — may look blurry. ${spec.recommended} or larger is best.`
                  : `Output: ${outW}×${outH} px`
                : " "}
            </p>
            <div className="flex gap-2 ml-auto">
              <AdminButton variant="outline" onClick={onClose}>
                Cancel
              </AdminButton>
              <AdminButton onClick={handleApply} disabled={!area} loading={saving}>
                {saving ? "Cropping…" : "Crop & Use"}
              </AdminButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
