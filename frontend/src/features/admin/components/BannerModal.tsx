import { useEffect, useRef, useState } from "react";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import toast from "react-hot-toast";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { CloudinaryUploadResult } from "../../../shared/types/common.types";
import type { Banner, BannerPayload } from "../../../shared/types/banner.types";
interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Banner;
  existingBanners: Banner[];   // to compute free priority slots
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: BannerPayload) => Promise<void>;
}

export default function BannerModal({
  open,
  mode,
  initialData,
  existingBanners,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePayload, setImagePayload] = useState<CloudinaryUploadResult | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setDescription(initialData.description);
      setPriority(initialData.priority);
      setImagePayload(initialData.image);
      setImageUrl(initialData.image.url);
      setImageFile(null);
    } else if (open && mode === "create") {
      setDescription("");
      setPriority("");
      setImagePayload(null);
      setImageUrl(null);
      setImageFile(null);
    }
    setErrors({});
  }, [open, mode, initialData]);

  if (!open) return null;

  // Priorities already taken by OTHER banners (in edit mode, exclude self)
  const takenPriorities = new Set(
    existingBanners
      .filter((b) => b.id !== initialData?.id)
      .map((b) => b.priority)
  );

  // Offer 1 … (max existing priority + 1), minimum 5 slots
  const maxPriority = Math.max(
    ...existingBanners.map((b) => b.priority),
    4
  );
  const availablePriorities = Array.from(
    { length: maxPriority + 1 },
    (_, i) => i + 1
  ).filter((p) => !takenPriorities.has(p));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!imagePayload && !imageFile) e.image = "Banner image is required";
    if (!description.trim()) {
      e.description = "Description is required";
    } else if (description.trim().length < 10) {
      e.description = "Description must be at least 10 characters";
    } else if (description.trim().length > 200) {
      e.description = "Description must be under 200 characters";
    }
    if (priority === "") e.priority = "Please select a priority";
    return e;
  };

  const clearFieldError = (field: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 5 MB" }));
      e.target.value = "";
      return;
    }
    clearFieldError("image");
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setCropOpen(true);
    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    setImageFile(croppedFile);
    setImageUrl(URL.createObjectURL(croppedFile));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      let finalImage = imagePayload;
      if (imageFile) {
        setUploading(true);
        finalImage = await uploadToCloudinary({
          file: imageFile,
          uploadPreset: "banners",
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
        });
        setUploading(false);
      }
      if (!finalImage) {
        toast.error("Image upload failed");
        return;
      }
      await onSubmit({
        image: finalImage,
        description: description.trim(),
        priority: Number(priority),
      });
    } catch (err) {
      setUploading(false);
      handleApiError(err);
    }
  };

  const inp = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 ${
      err ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/40" onClick={onClose} />

      {/* Crop Modal */}
      <ImageCropModal
        open={cropOpen}
        image={imageUrl ?? ""}
        aspect={16 / 9}
        onClose={() => setCropOpen(false)}
        onCropComplete={handleCropComplete}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-lg bg-white rounded-xl shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              {mode === "create" ? "Add Banner" : "Edit Banner"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Image */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Banner Image <span className="text-gray-400">(16:9)</span> *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-40 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors ${
                  errors.image ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-[#DB313E]/60"
                }`}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="banner preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M12 15V3m0 0L8.25 6.75M12 3l3.75 3.75" />
                    </svg>
                    <span className="text-xs">Click to upload banner image</span>
                  </div>
                )}
              </div>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 text-xs text-[#DB313E] hover:underline"
                >
                  Change image
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
              {errors.image && <p className="text-xs text-red-500 mt-0.5">{errors.image}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => { setDescription(e.target.value); clearFieldError("description"); }}
                maxLength={200}
                placeholder="Enter banner description…"
                className={inp(errors.description) + " resize-none"}
              />
              <div className="flex items-center justify-between mt-0.5">
                {errors.description
                  ? <p className="text-xs text-red-500">{errors.description}</p>
                  : <span />}
                <span className={`text-xs ${description.length > 185 ? "text-red-500" : "text-gray-400"}`}>
                  {description.length}/200
                </span>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority *</label>
              <select
                value={priority}
                onChange={(e) => { setPriority(e.target.value === "" ? "" : Number(e.target.value)); clearFieldError("priority"); }}
                className={inp(errors.priority)}
              >
                <option value="">Select priority…</option>
                {availablePriorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.priority && <p className="text-xs text-red-500 mt-0.5">{errors.priority}</p>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-4 py-2 text-sm font-medium bg-[#DB313E] text-white rounded-md hover:bg-[#c02535] disabled:opacity-50 transition-colors"
              >
                {uploading ? "Uploading…" : loading ? "Saving…" : mode === "create" ? "Add Banner" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
