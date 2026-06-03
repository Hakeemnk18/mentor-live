import { useRef, useState } from "react";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import type { CloudinaryUploadResult } from "../../../shared/types/common.types";
import type { Blog, BlogImage, BlogPayload } from "../../../shared/types/blog.types";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Blog & { content?: string };
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: BlogPayload) => Promise<void>;
}

type FormState = {
  author: string;
  heading: string;
  description: string;
  content: string;
  topic: string;
  priority: number | "";
  isFeatured: boolean;
  imageFile: File | null;
  imageUrl: string | null;
  imagePayload: CloudinaryUploadResult | null;
  errors: Record<string, string>;
};

const emptyForm: FormState = {
  author: "",
  heading: "",
  description: "",
  content: "",
  topic: "",
  priority: "",
  isFeatured: false,
  imageFile: null,
  imageUrl: null,
  imagePayload: null,
  errors: {},
};

export default function BlogModal({
  open,
  mode,
  initialData,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [prevOpen, setPrevOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<
    (Blog & { content?: string }) | undefined
  >(undefined);

  if (open !== prevOpen || (open && initialData !== prevInitialData)) {
    setPrevOpen(open);
    setPrevInitialData(initialData);
    if (open) {
      if (mode === "edit" && initialData) {
        setForm({
          author: initialData.author,
          heading: initialData.heading,
          description: initialData.description,
          content: initialData.content ?? "",
          topic: initialData.topic ?? "",
          priority: initialData.priority ?? "",
          isFeatured: initialData.isFeatured ?? false,
          imageFile: null,
          imageUrl: initialData.image?.url ?? null,
          imagePayload: initialData.image ?? null,
          errors: {},
        });
      } else {
        setForm(emptyForm);
      }
    }
  }

  if (!open) return null;

  /* ── Validation ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.author.trim()) {
      e.author = "Author is required";
    } else if (form.author.trim().length < 2) {
      e.author = "Author must be at least 2 characters";
    } else if (form.author.trim().length > 100) {
      e.author = "Author must be under 100 characters";
    }
    if (!form.heading.trim()) {
      e.heading = "Heading is required";
    } else if (form.heading.trim().length < 5) {
      e.heading = "Heading must be at least 5 characters";
    } else if (form.heading.trim().length > 150) {
      e.heading = "Heading must be under 150 characters";
    }
    if (!form.description.trim()) {
      e.description = "Description is required";
    } else if (form.description.trim().length < 20) {
      e.description = "Description must be at least 20 characters";
    } else if (form.description.trim().length > 300) {
      e.description = "Description must be under 300 characters";
    }
    if (!form.content.trim()) {
      e.content = "Content is required";
    } else if (form.content.trim().length < 50) {
      e.content = "Content must be at least 50 characters";
    }
    if (form.priority !== "" && (Number(form.priority) < 1 || !Number.isInteger(Number(form.priority)))) {
      e.priority = "Priority must be a positive integer";
    }
    return e;
  };

  /* ── Image handlers — same pattern as BannerModal ── */
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
    setForm((prev) => ({
      ...prev,
      imageFile: croppedFile,
      imageUrl: URL.createObjectURL(croppedFile),
    }));
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, imageFile: null, imageUrl: null, imagePayload: null }));
  };

  /* ── Submit ── */
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setForm((prev) => ({ ...prev, errors: errs }));
      return;
    }
    try {
      let finalImage: BlogImage | null = form.imagePayload as BlogImage | null;
      if (form.imageFile) {
        setUploading(true);
        const uploaded = await uploadToCloudinary({
          file: form.imageFile,
          uploadPreset: "banners",
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
        });
        setUploading(false);
        finalImage = { url: uploaded.url, publicId: uploaded.publicId };
      }
      await onSubmit({
        author: form.author.trim(),
        heading: form.heading.trim(),
        description: form.description.trim(),
        content: form.content.trim(),
        topic: form.topic.trim() || null,
        priority: form.priority !== "" ? Number(form.priority) : null,
        isFeatured: form.isFeatured,
        image: finalImage,
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

  const setField = (field: string, val: string) =>
    setForm((prev) => {
      const errors = { ...prev.errors };
      delete errors[field];
      return { ...prev, [field]: val, errors };
    });

  const isLoading = loading || uploading;

  return (
    <>
      {/* Backdrop — z-[100] so ImageCropModal (z-[1000]) renders above it */}
      <div className="fixed inset-0 z-[100] bg-black/40" onClick={!isLoading ? onClose : undefined} />

      {/* Crop modal — must come before Panel in DOM; its own z-[1000] sits above z-[101] panel */}
      <ImageCropModal
        open={cropOpen}
        image={form.imageUrl ?? ""}
        aspect={16 / 9}
        onClose={() => setCropOpen(false)}
        onCropComplete={handleCropComplete}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-2xl bg-white rounded-xl shadow-xl flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
            <h2 className="text-base font-semibold text-gray-900">
              {mode === "create" ? "New Blog Post" : "Edit Blog Post"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer">
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Cover Image <span className="text-gray-400">(16:9, optional)</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-40 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors ${
                  form.errors.image ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-[#DB313E]/60"
                }`}
              >
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="cover preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M12 15V3m0 0L8.25 6.75M12 3l3.75 3.75" />
                    </svg>
                    <span className="text-xs">Click to upload cover image</span>
                  </div>
                )}
              </div>
              {form.imageUrl && (
                <div className="flex gap-3 mt-1">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-[#DB313E] hover:underline cursor-pointer">
                    Change image
                  </button>
                  <button type="button" onClick={handleRemoveImage} className="text-xs text-gray-400 hover:text-red-500 cursor-pointer">
                    Remove
                  </button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
              {form.errors.image && <p className="text-xs text-red-500 mt-0.5">{form.errors.image}</p>}
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Author *</label>
              <input
                value={form.author}
                onChange={(e) => setField("author", e.target.value)}
                maxLength={100}
                placeholder="e.g. Muhammed Hakeem"
                className={inp(form.errors.author)}
              />
              {form.errors.author && <p className="text-xs text-red-500 mt-0.5">{form.errors.author}</p>}
            </div>

            {/* Heading */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Heading *</label>
              <input
                value={form.heading}
                onChange={(e) => setField("heading", e.target.value)}
                maxLength={150}
                placeholder="e.g. Understanding Node.js"
                className={inp(form.errors.heading)}
              />
              {form.errors.heading && <p className="text-xs text-red-500 mt-0.5">{form.errors.heading}</p>}
            </div>

            {/* Topic + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Topic <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  value={form.topic}
                  onChange={(e) => setField("topic", e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Physics, Mathematics"
                  className={inp()}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Priority <span className="text-gray-400">(optional, unique)</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.priority}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((prev) => {
                      const errors = { ...prev.errors };
                      delete errors.priority;
                      return { ...prev, priority: v === "" ? "" : Number(v), errors };
                    });
                  }}
                  placeholder="e.g. 1"
                  className={inp(form.errors.priority)}
                />
                {form.errors.priority && <p className="text-xs text-red-500 mt-0.5">{form.errors.priority}</p>}
              </div>
            </div>

            {/* isFeatured toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">Featured post</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {form.isFeatured
                    ? "Shown in the featured blogs section on the landing page"
                    : "Not shown as featured — only appears in the regular blog list"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  form.isFeatured ? "bg-[#DB313E]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    form.isFeatured ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                maxLength={300}
                placeholder="Short summary of the post…"
                className={inp(form.errors.description) + " resize-none"}
              />
              <div className="flex items-center justify-between mt-0.5">
                {form.errors.description
                  ? <p className="text-xs text-red-500">{form.errors.description}</p>
                  : <span />}
                <span className={`text-xs ${form.description.length > 280 ? "text-red-500" : "text-gray-400"}`}>
                  {form.description.length}/300
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Content *</label>
              <textarea
                rows={8}
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
                placeholder="Full blog content…"
                className={inp(form.errors.content) + " resize-y"}
              />
              <div className="flex items-center justify-between mt-0.5">
                {form.errors.content
                  ? <p className="text-xs text-red-500">{form.errors.content}</p>
                  : <span />}
                <span className={`text-xs ${form.content.length > 9500 ? "text-red-500" : "text-gray-400"}`}>
                  {form.content.length.toLocaleString()} chars
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium bg-[#DB313E] text-white rounded-md hover:bg-[#c02535] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {uploading ? "Uploading…" : loading ? "Saving…" : mode === "create" ? "Publish Blog" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
