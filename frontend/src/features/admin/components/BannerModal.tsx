import { useRef, useState } from "react";
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
  existingBanners: Banner[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: BannerPayload) => Promise<void>;
}

type FormState = {
  description: string;
  isShow: boolean;
  priority: number | "";
  imageFile: File | null;
  imageUrl: string | null;
  imagePayload: CloudinaryUploadResult | null;
  errors: Record<string, string>;
};

const emptyForm: FormState = {
  description: "",
  isShow: false,
  priority: "",
  imageFile: null,
  imageUrl: null,
  imagePayload: null,
  errors: {},
};

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
  const [form, setForm] = useState<FormState>(emptyForm);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [prevOpen, setPrevOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<Banner | undefined>(undefined);
  if (open !== prevOpen || (open && initialData !== prevInitialData)) {
    setPrevOpen(open);
    setPrevInitialData(initialData);
    if (open) {
      if (mode === "edit" && initialData) {
        setForm({
          description: initialData.description,
          isShow: initialData.isShow,
          priority: initialData.priority ?? "",
          imageFile: null,
          imageUrl: initialData.image.url,
          imagePayload: initialData.image,
          errors: {},
        });
      } else {
        setForm(emptyForm);
      }
    }
  }

  if (!open) return null;

  /* Priorities already taken by OTHER visible banners */
  const takenPriorities = new Set(
    existingBanners
      .filter((b) => b.isShow && b.priority != null && b.id !== initialData?.id)
      .map((b) => b.priority as number),
  );

  const availablePriorities = [1, 2, 3, 4, 5].filter(
    (p) => !takenPriorities.has(p),
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.imagePayload && !form.imageFile) e.image = "Banner image is required";
    if (!form.description.trim()) {
      e.description = "Description is required";
    } else if (form.description.trim().length < 5) {
      e.description = "Description must be at least 5 characters";
    } else if (form.description.trim().length > 200) {
      e.description = "Description must be under 200 characters";
    }
    if (form.isShow && form.priority === "") {
      e.priority = "Priority (1–5) is required when the banner is set to visible";
    }
    return e;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setForm((prev) => ({ ...prev, errors: { ...prev.errors, image: "Image must be under 5 MB" } }));
      e.target.value = "";
      return;
    }
    setForm((prev) => {
      const errors = { ...prev.errors };
      delete errors.image;
      return { ...prev, imageFile: file, imageUrl: URL.createObjectURL(file), errors };
    });
    setCropOpen(true);
    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    setForm((prev) => ({ ...prev, imageFile: croppedFile, imageUrl: URL.createObjectURL(croppedFile) }));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setForm((prev) => ({ ...prev, errors: errs })); return; }

    try {
      let finalImage = form.imagePayload;
      if (form.imageFile) {
        setUploading(true);
        finalImage = await uploadToCloudinary({
          file: form.imageFile,
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
        description: form.description.trim(),
        isShow: form.isShow,
        priority: form.isShow && form.priority !== "" ? Number(form.priority) : null,
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
      <div className="fixed inset-0 z-[100] bg-black/40" onClick={onClose} />

      <ImageCropModal
        open={cropOpen}
        image={form.imageUrl ?? ""}
        aspect={16 / 9}
        onClose={() => setCropOpen(false)}
        onCropComplete={handleCropComplete}
      />

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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer">
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
                  form.errors.image ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-[#DB313E]/60"
                }`}
              >
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="banner preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M12 15V3m0 0L8.25 6.75M12 3l3.75 3.75" />
                    </svg>
                    <span className="text-xs">Click to upload banner image</span>
                  </div>
                )}
              </div>
              {form.imageUrl && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 text-xs text-[#DB313E] hover:underline cursor-pointer">
                  Change image
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
              {form.errors.image && <p className="text-xs text-red-500 mt-0.5">{form.errors.image}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((prev) => {
                    const errors = { ...prev.errors };
                    delete errors.description;
                    return { ...prev, description: val, errors };
                  });
                }}
                maxLength={200}
                placeholder="Enter banner description…"
                className={inp(form.errors.description) + " resize-none"}
              />
              <div className="flex items-center justify-between mt-0.5">
                {form.errors.description
                  ? <p className="text-xs text-red-500">{form.errors.description}</p>
                  : <span />}
                <span className={`text-xs ${form.description.length > 185 ? "text-red-500" : "text-gray-400"}`}>
                  {form.description.length}/200
                </span>
              </div>
            </div>

            {/* isShow toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">Show to users</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {form.isShow ? "This banner will appear in the carousel" : "Banner is saved but hidden from users"}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => {
                    const errors = { ...prev.errors };
                    delete errors.priority;
                    return { ...prev, isShow: !prev.isShow, priority: !prev.isShow ? prev.priority : "", errors };
                  })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  form.isShow ? "bg-[#DB313E]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    form.isShow ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Priority — only when isShow=true */}
            {form.isShow && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Priority * <span className="text-gray-400">(1 = highest, 5 = lowest)</span>
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => {
                      const errors = { ...prev.errors };
                      delete errors.priority;
                      return { ...prev, priority: val === "" ? "" : Number(val), errors };
                    });
                  }}
                  className={inp(form.errors.priority)}
                >
                  <option value="">Select priority…</option>
                  {availablePriorities.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {availablePriorities.length === 0 && (
                  <p className="text-xs text-amber-600 mt-0.5">
                    All 5 priority slots are taken. Hide another banner first.
                  </p>
                )}
                {form.errors.priority && <p className="text-xs text-red-500 mt-0.5">{form.errors.priority}</p>}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-4 py-2 text-sm font-medium bg-[#DB313E] text-white rounded-md hover:bg-[#c02535] disabled:opacity-50 transition-colors cursor-pointer"
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
