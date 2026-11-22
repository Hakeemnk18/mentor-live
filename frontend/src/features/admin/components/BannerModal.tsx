import { useRef, useState } from "react";
import BannerCropModal from "./BannerCropModal";
import { AdminButton, AdminField, AdminModal, AdminSelect, AdminToggle, adminInputCls } from "./ui";
import { priorityOptions } from "./bannerPriority";
import { BANNER_SHAPES } from "./bannerShapes";
import type { BannerShape } from "./bannerShapes";
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

/** One image slot (desktop 2:1 or mobile 1:1). Only the cropped file is ever uploaded. */
type ImageSlot = {
  file: File | null; // cropped, waiting to upload
  url: string | null; // what the preview shows
  payload: CloudinaryUploadResult | null; // already-uploaded image (edit mode)
  raw: string | null; // original pick, kept so the crop can be adjusted again
};

const emptySlot: ImageSlot = { file: null, url: null, payload: null, raw: null };

type FormState = {
  description: string;
  isShow: boolean;
  isClickable: boolean;
  buttonText: string;
  priority: number | "";
  images: Record<BannerShape, ImageSlot>;
  errors: Record<string, string>;
};

const emptyForm: FormState = {
  description: "",
  isShow: false,
  isClickable: false,
  buttonText: "Get In Touch",
  priority: "",
  images: { desktop: emptySlot, mobile: emptySlot },
  errors: {},
};

/* error key per slot (kept "image" for desktop so existing wording stays) */
const ERR_KEY: Record<BannerShape, string> = { desktop: "image", mobile: "mobileImage" };

const without = (errors: Record<string, string>, key: string) => {
  const next = { ...errors };
  delete next[key];
  return next;
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
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [cropShape, setCropShape] = useState<BannerShape | null>(null);
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
          isClickable: initialData.isClickable ?? false,
          buttonText: initialData.buttonText ?? "Get In Touch",
          priority: initialData.priority ?? "",
          images: {
            desktop: { ...emptySlot, url: initialData.image.url, payload: initialData.image },
            mobile: initialData.mobileImage
              ? { ...emptySlot, url: initialData.mobileImage.url, payload: initialData.mobileImage }
              : emptySlot,
          },
          errors: {},
        });
      } else {
        setForm(emptyForm);
      }
      setCropShape(null);
    }
  }

  if (!open) return null;

  const { desktop, mobile } = form.images;

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
    if (!desktop.payload && !desktop.file) e.image = "Desktop image is required";
    if (!mobile.payload && !mobile.file) e.mobileImage = "Mobile image is required";
    if (!form.description.trim()) {
      e.description = "Title is required";
    } else if (form.description.trim().length < 5) {
      e.description = "Title must be at least 5 characters";
    } else if (form.description.trim().length > 200) {
      e.description = "Title must be under 200 characters";
    }
    if (form.isShow && form.priority === "") {
      e.priority = "Priority (1–5) is required when the banner is set to visible";
    }
    return e;
  };

  const setSlot = (shape: BannerShape, patch: Partial<ImageSlot>, clearErr = false) =>
    setForm((prev) => ({
      ...prev,
      images: { ...prev.images, [shape]: { ...prev.images[shape], ...patch } },
      errors: clearErr ? without(prev.errors, ERR_KEY[shape]) : prev.errors,
    }));

  const handleFileChange = (shape: BannerShape) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setForm((prev) => ({ ...prev, errors: { ...prev.errors, [ERR_KEY[shape]]: "Image must be under 5 MB" } }));
      return;
    }
    setSlot(shape, { raw: URL.createObjectURL(file) }, true);
    setCropShape(shape);
  };

  const handleCropComplete = (croppedFile: File) => {
    if (!cropShape) return;
    setSlot(cropShape, { file: croppedFile, url: URL.createObjectURL(croppedFile) }, true);
  };

  const pick = (shape: BannerShape) =>
    (shape === "desktop" ? desktopInputRef : mobileInputRef).current?.click();

  const uploadSlot = async (slot: ImageSlot) =>
    slot.file
      ? uploadToCloudinary({
          file: slot.file,
          uploadPreset: "banners",
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
        })
      : slot.payload;

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setForm((prev) => ({ ...prev, errors: errs })); return; }

    try {
      if (desktop.file || mobile.file) setUploading(true);
      const [finalImage, finalMobile] = await Promise.all([uploadSlot(desktop), uploadSlot(mobile)]);
      setUploading(false);
      if (!finalImage || !finalMobile) {
        toast.error("Image upload failed");
        return;
      }
      await onSubmit({
        image: finalImage,
        mobileImage: finalMobile,
        description: form.description.trim(),
        isShow: form.isShow,
        isClickable: form.isClickable,
        buttonText: form.buttonText.trim() || "Get In Touch",
        priority: form.isShow && form.priority !== "" ? Number(form.priority) : null,
      });
    } catch (err) {
      setUploading(false);
      handleApiError(err);
    }
  };

  const cropSlot = cropShape ? form.images[cropShape] : null;

  return (
    <>
      {cropShape && cropSlot?.raw && (
        <BannerCropModal
          key={`${cropShape}-${cropSlot.raw}`}
          open
          shape={cropShape}
          image={cropSlot.raw}
          onClose={() => setCropShape(null)}
          onCropComplete={handleCropComplete}
        />
      )}

      <AdminModal
        open={open}
        onClose={onClose}
        size="lg"
        closeOnEsc={!cropShape}
        title={mode === "create" ? "Add Banner" : "Edit Banner"}
        footer={
          <>
            <AdminButton variant="outline" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSubmit} loading={loading || uploading}>
              {uploading ? "Uploading…" : loading ? "Saving…" : mode === "create" ? "Add Banner" : "Save Changes"}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Images — desktop 2:1 + mobile 1:1 (columns 2fr/1fr keep both boxes the same height) */}
          <div>
            <p className="text-xs font-semibold text-[#2A1650]/80 mb-1.5">
              Banner Images<span className="text-[#FF6B5E] ml-0.5">*</span>
              <span className="font-normal text-gray-400"> (one for laptops, one for phones)</span>
            </p>
            <div className="grid grid-cols-[2fr_1fr] gap-3 items-start">
              {(["desktop", "mobile"] as const).map((shape) => {
                const slot = form.images[shape];
                const spec = BANNER_SHAPES[shape];
                const err = form.errors[ERR_KEY[shape]];
                return (
                  <div key={shape} className="min-w-0">
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Upload ${spec.name.toLowerCase()}`}
                      onClick={() => pick(shape)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), pick(shape))}
                      className={`relative w-full ${shape === "desktop" ? "aspect-[2/1]" : "aspect-square"} rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/25 ${
                        err
                          ? "border-red-400 bg-red-50"
                          : slot.url
                          ? "border-transparent bg-[#F4F1FA]"
                          : "border-[#E4DDF2] bg-[#FAF8FE] hover:border-[#6D35D9]/60"
                      }`}
                    >
                      {slot.url ? (
                        <BannerPreview
                          src={slot.url}
                          isClickable={form.isClickable}
                          buttonText={form.buttonText}
                          size={shape === "desktop" ? "md" : "sm"}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 px-1 text-center text-[#8A80A3]">
                          <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-[#6D35D9] shadow-sm">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M12 15V3m0 0L8.25 6.75M12 3l3.75 3.75" />
                            </svg>
                          </span>
                          <span className="text-[11px] sm:text-xs font-medium text-[#2A1650]">Upload</span>
                          <span className="hidden sm:block text-[11px]">{spec.recommended}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[11px] font-semibold text-[#2A1650]">{shape === "desktop" ? "Desktop" : "Mobile"}</span>
                      <span className="text-[11px] text-gray-400">{spec.ratioLabel.replace(/\s/g, "")}</span>
                    </div>
                    {slot.url && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <AdminButton size="sm" variant="soft" className="!h-8 !px-3 !text-xs" onClick={() => pick(shape)}>
                          Change
                        </AdminButton>
                        {slot.raw && (
                          <AdminButton size="sm" variant="soft" className="!h-8 !px-3 !text-xs" onClick={() => setCropShape(shape)}>
                            Crop
                          </AdminButton>
                        )}
                      </div>
                    )}
                    {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              JPG / PNG / WebP · max 5 MB each. Desktop {BANNER_SHAPES.desktop.recommended}, mobile {BANNER_SHAPES.mobile.recommended} recommended.
            </p>
            <input ref={desktopInputRef} type="file" accept="image/*" onChange={handleFileChange("desktop")} hidden />
            <input ref={mobileInputRef} type="file" accept="image/*" onChange={handleFileChange("mobile")} hidden />
          </div>

          {/* How it will look on the website */}
          {(desktop.url || mobile.url) && (
            <div className="rounded-2xl border border-[#E4DDF2] bg-[#FAF8FE] p-4">
              <p className="text-xs font-semibold text-[#2A1650]/80 mb-3">How it looks on the website</p>
              <div className="flex items-end gap-3 sm:gap-5">
                <div className="flex-1 min-w-0">
                  <div className="rounded-xl border-[4px] sm:border-[6px] border-[#2A1650] bg-white p-1 sm:p-2 shadow-sm">
                    <div className="aspect-[2/1] rounded-lg overflow-hidden bg-[#F4F1FA]">
                      {desktop.url ? (
                        <BannerPreview src={desktop.url} isClickable={form.isClickable} buttonText={form.buttonText} size="md" />
                      ) : (
                        <PreviewMissing />
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 text-center mt-1.5">Laptop</p>
                </div>
                <div className="w-[96px] sm:w-[150px] shrink-0">
                  <div className="rounded-[16px] sm:rounded-[22px] border-[4px] sm:border-[6px] border-[#2A1650] bg-white px-1 sm:px-1.5 pt-3 sm:pt-4 pb-4 sm:pb-6 shadow-sm">
                    <div className="aspect-square rounded-md overflow-hidden bg-[#F4F1FA]">
                      {mobile.url ? (
                        <BannerPreview src={mobile.url} isClickable={form.isClickable} buttonText={form.buttonText} size="sm" />
                      ) : (
                        <PreviewMissing />
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-3/4 rounded-full bg-[#EFE9FA]" />
                      <div className="h-1.5 w-1/2 rounded-full bg-[#EFE9FA]" />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 text-center mt-1.5">Phone</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-3">
                Laptops and tablets show the desktop image, phones show the mobile image, always in full. When the button is on, keep important text away from the bottom-left corner.
              </p>
            </div>
          )}

          {/* Title (stored as description) */}
          <AdminField
            label="Banner Title"
            required
            hint="(not shown on the banner — used as image alt text and shown in Leads)"
            error={form.errors.description}
          >
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => {
                const val = e.target.value;
                setForm((prev) => ({ ...prev, description: val, errors: without(prev.errors, "description") }));
              }}
              maxLength={200}
              placeholder="e.g. Summer crash course 2026"
              className={adminInputCls(form.errors.description) + " resize-none"}
            />
            <p className={`text-right text-xs mt-0.5 ${form.description.length > 185 ? "text-red-500" : "text-gray-400"}`}>
              {form.description.length}/200
            </p>
          </AdminField>

          {/* Show / priority */}
          <div className="space-y-3">
            <AdminToggle
              label="Show to users"
              description={form.isShow ? "This banner will appear in the carousel" : "Banner is saved but hidden from users"}
              checked={form.isShow}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  isShow: !prev.isShow,
                  priority: !prev.isShow ? prev.priority : "",
                  errors: without(prev.errors, "priority"),
                }))
              }
            />

            {form.isShow && (
              <AdminField label="Priority" required hint="(1 = highest, 5 = lowest)" error={form.errors.priority}>
                <AdminSelect
                  label="Priority"
                  placeholder="Select priority…"
                  value={form.priority}
                  options={priorityOptions(availablePriorities)}
                  error={!!form.errors.priority}
                  disabled={availablePriorities.length === 0}
                  onChange={(p) => setForm((prev) => ({ ...prev, priority: p, errors: without(prev.errors, "priority") }))}
                />
                {availablePriorities.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">All 5 priority slots are taken. Hide another banner first.</p>
                )}
              </AdminField>
            )}
          </div>

          {/* Clickable / button text */}
          <div className="space-y-3">
            <AdminToggle
              label="Clickable Banner"
              description={
                form.isClickable
                  ? "Shows a button on the banner — clicking opens an inquiry form"
                  : "Banner is display-only, no action button"
              }
              checked={form.isClickable}
              onChange={() => setForm((prev) => ({ ...prev, isClickable: !prev.isClickable }))}
            />

            {form.isClickable && (
              <AdminField label="Button Text" hint="(shown on the banner)">
                <input
                  value={form.buttonText}
                  onChange={(e) => setForm((prev) => ({ ...prev, buttonText: e.target.value }))}
                  maxLength={50}
                  placeholder="e.g. Get In Touch, Join Now, Learn More"
                  className={adminInputCls()}
                />
                <p className="text-right text-xs text-gray-400 mt-0.5">{form.buttonText.length}/50</p>
              </AdminField>
            )}
          </div>
        </form>
      </AdminModal>
    </>
  );
}

function PreviewMissing() {
  return (
    <div className="w-full h-full flex items-center justify-center text-[9px] sm:text-[10px] text-[#8A80A3] text-center px-1">
      Not uploaded
    </div>
  );
}

/* ── Banner exactly as the carousel renders it: full image + optional button bottom-left ── */
const PREVIEW_BTN = {
  lg: "left-5 bottom-5 h-7 px-3 text-[11px] gap-1",
  md: "left-3 bottom-3 h-[18px] px-2 text-[8px] gap-0.5",
  sm: "left-1.5 bottom-1.5 h-4 px-1.5 text-[7px] gap-0.5",
} as const;

function BannerPreview({
  src,
  isClickable,
  buttonText,
  size,
}: {
  src: string;
  isClickable: boolean;
  buttonText: string;
  size: keyof typeof PREVIEW_BTN;
}) {
  return (
    <div className="relative w-full h-full">
      <img src={src} alt="banner preview" className="w-full h-full object-cover" draggable={false} />
      {isClickable && (
        <span
          className={`absolute ${PREVIEW_BTN[size]} rounded-full bg-white text-[#2A1650] font-extrabold inline-flex items-center shadow-md pointer-events-none whitespace-nowrap`}
        >
          {buttonText.trim() || "Get In Touch"}
          <span aria-hidden>&rsaquo;</span>
        </span>
      )}
    </div>
  );
}
