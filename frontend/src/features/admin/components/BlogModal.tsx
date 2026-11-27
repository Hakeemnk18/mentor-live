import { useRef, useState } from "react";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import type { CloudinaryUploadResult } from "../../../shared/types/common.types";
import type { Blog, BlogImage, BlogPayload } from "../../../shared/types/blog.types";
import { AdminButton, AdminField, AdminModal, AdminToggle, adminInputCls } from "./ui";

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

  const setField = (field: string, val: string) =>
    setForm((prev) => {
      const errors = { ...prev.errors };
      delete errors[field];
      return { ...prev, [field]: val, errors };
    });

  const isLoading = loading || uploading;
  const close = () => {
    if (!isLoading) onClose();
  };
  const formId = "blog-form";
  const line = (err?: string) => `${adminInputCls(err)} h-11 sm:h-10 !py-0`;

  return (
    <>
      <AdminModal
        open={open}
        onClose={close}
        size="lg"
        zIndex={100}
        closeOnEsc={!cropOpen}
        closeOnBackdrop={!cropOpen}
        title={mode === "create" ? "New Blog Post" : "Edit Blog Post"}
        description={mode === "create" ? "Write a post for the blog section of the website." : "Update this blog post."}
        footer={
          <>
            <AdminButton variant="outline" onClick={close} disabled={isLoading}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" form={formId} loading={isLoading}>
              {uploading ? "Uploading…" : loading ? "Saving…" : mode === "create" ? "Publish Blog" : "Save changes"}
            </AdminButton>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Cover image */}
          <AdminField label="Cover Image" hint="(16:9, optional, under 5 MB)" error={form.errors.image}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-full aspect-[16/9] max-h-52 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors ${
                form.errors.image
                  ? "border-red-300 bg-red-50/40"
                  : form.imageUrl
                    ? "border-transparent"
                    : "border-[#CBB9F0] bg-[#FAF8FE] hover:bg-[#F4F1FA] hover:border-[#6D35D9]"
              }`}
            >
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-[#6D35D9]">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M12 15V3m0 0L8.25 6.75M12 3l3.75 3.75" />
                  </svg>
                  <span className="text-sm font-semibold">Upload cover image</span>
                  <span className="text-xs text-[#8A80A3]">You can crop it after choosing</span>
                </span>
              )}
            </button>
            {form.imageUrl && (
              <div className="flex gap-2 mt-2">
                <AdminButton variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                  Change image
                </AdminButton>
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="!text-[#C8372D] hover:!bg-[#FFE3DF] hover:!border-[#FFCBC4]"
                >
                  Remove
                </AdminButton>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
          </AdminField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminField label="Author" required htmlFor="b-author" error={form.errors.author}>
              <input
                id="b-author"
                value={form.author}
                onChange={(e) => setField("author", e.target.value)}
                maxLength={100}
                placeholder="e.g. Muhammed Hakeem"
                className={line(form.errors.author)}
              />
            </AdminField>
            <AdminField label="Topic" hint="(optional)" htmlFor="b-topic">
              <input
                id="b-topic"
                value={form.topic}
                onChange={(e) => setField("topic", e.target.value)}
                maxLength={80}
                placeholder="e.g. Physics, Mathematics"
                className={line()}
              />
            </AdminField>
          </div>

          <AdminField label="Heading" required htmlFor="b-heading" error={form.errors.heading}>
            <input
              id="b-heading"
              value={form.heading}
              onChange={(e) => setField("heading", e.target.value)}
              maxLength={150}
              placeholder="e.g. Understanding Node.js"
              className={line(form.errors.heading)}
            />
          </AdminField>

          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:items-start">
            <AdminField label="Priority" hint="(optional, unique)" htmlFor="b-priority" error={form.errors.priority}>
              <input
                id="b-priority"
                type="number"
                inputMode="numeric"
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
                className={`${line(form.errors.priority)} tabular-nums`}
              />
            </AdminField>
            <div className="sm:pt-[22px]">
              <AdminToggle
                label="Featured post"
                description={
                  form.isFeatured
                    ? "Shown in the featured blogs section on the landing page"
                    : "Only appears in the regular blog list"
                }
                checked={form.isFeatured}
                onChange={(next) => setForm((prev) => ({ ...prev, isFeatured: next }))}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <AdminField label="Description" required hint="(20–300 characters)" htmlFor="b-description" error={form.errors.description}>
              <textarea
                id="b-description"
                rows={2}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                maxLength={300}
                placeholder="Short summary of the post…"
                className={`${adminInputCls(form.errors.description)} resize-none leading-relaxed`}
              />
            </AdminField>
            <p className={`m-0 mt-1 text-xs text-right tabular-nums ${form.description.length > 280 ? "text-[#C8372D]" : "text-[#8A80A3]"}`}>
              {form.description.length}/300
            </p>
          </div>

          <div>
            <AdminField label="Content" required hint="(at least 50 characters)" htmlFor="b-content" error={form.errors.content}>
              <textarea
                id="b-content"
                rows={9}
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
                placeholder="Full blog content…"
                className={`${adminInputCls(form.errors.content)} resize-y leading-relaxed min-h-[180px]`}
              />
            </AdminField>
            <p className={`m-0 mt-1 text-xs text-right tabular-nums ${form.content.length > 9500 ? "text-[#C8372D]" : "text-[#8A80A3]"}`}>
              {form.content.length.toLocaleString()} chars
            </p>
          </div>
        </form>
      </AdminModal>

      {/* Crop dialog stacks above the form (z 1000 vs 100) */}
      <ImageCropModal
        open={cropOpen}
        image={form.imageUrl ?? ""}
        aspect={16 / 9}
        onClose={() => setCropOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
