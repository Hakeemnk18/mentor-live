import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import AdminModal from "./ui/AdminModal";
import AdminField from "./ui/AdminField";
import AdminButton from "./ui/AdminButton";
import AdminSelect from "./ui/AdminSelect";
import { adminInputCls } from "./ui/styles";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { getSubjectVariants } from "../../../api/chapter.api";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { ChapterInitialData } from "../../../shared/types/chapter.types";
import type { FacultyListItem } from "../../../shared/types/faculty.types";
/* ---------------- TYPES ---------------- */

type SubjectVariant = {
  _id: string;
  subjectName: string;
};

type IconPayload = {
  url: string;
  publicId: string;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ChapterInitialData;

  onClose: () => void;
  loading?: boolean;

  syllabuses: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];

  /** Faculties that teach this chapter (edit mode only) */
  faculties?: FacultyListItem[];
  facultiesLoading?: boolean;

  onCreate: (data: {
    name: string;
    price: number;
    subjectVariant: string;
    icon: IconPayload;
  }) => Promise<void>;

  onUpdate: (
    id: string,
    data: {
      name: string;
      price: number;
      subjectVariant: string;
      icon: IconPayload;
    },
  ) => Promise<void>;
};

/* ---------------- COMPONENT ---------------- */

export default function ChapterFormModal({
  open,
  mode,
  initialData,
  onClose,
  loading,
  syllabuses,
  classes,
  faculties = [],
  facultiesLoading = false,
  onCreate,
  onUpdate,
}: Props) {
  /* ---------------- FORM STATE ---------------- */

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">(0);

  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectVariantId, setSubjectVariantId] = useState("");

  const [subjectVariants, setSubjectVariants] = useState<SubjectVariant[]>([]);

  /* ---------------- IMAGE STATE ---------------- */

  const [icon, setIcon] = useState<IconPayload | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [isNewImage, setIsNewImage] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!open) {
      // ✅ Clear validation when modal closes
      setSubmitAttempted(false);
      return;
    }

    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setPrice(initialData.price);

      // Populate dropdowns from initialData on edit
      setSyllabusId(initialData.syllabusId);
      setClassId(initialData.classId);
      setSubjectVariantId(initialData.subjectVariantId);

      setIcon(initialData.icon ?? null);
      setIconPreview(initialData.icon?.url ?? null);

      setIconFile(null);
      setIsNewImage(false);
    } else {
      setName("");
      setPrice(0);
      setSyllabusId("");
      setClassId("");
      setSubjectVariantId("");

      setIcon(null);
      setIconPreview(null);
      setIconFile(null);
      setIsNewImage(false);
    }

    // ✅ Clear validation on open
    setSubmitAttempted(false);
  }, [open, mode, initialData]);

  /* ---------------- SUBJECT VARIANTS ---------------- */

  useEffect(() => {
    if (!syllabusId || !classId) {
      setSubjectVariants([]);
      // Only reset the variant ID if it's the user actively changing fields, 
      // not during initial data population if it already matches.
      return;
    }

    const fetchVariants = async () => {
      try {
        const res = await getSubjectVariants({ syllabusId, classId });
        setSubjectVariants(res);
        
        // If we are in edit mode and the fetched variants contain our initial variant, 
        // we make sure it stays selected. Otherwise, we clear it.
        if (
          mode === "edit" && 
          initialData?.subjectVariantId &&
          initialData.syllabusId === syllabusId &&
          initialData.classId === classId
        ) {
          setSubjectVariantId(initialData.subjectVariantId);
        } else {
           setSubjectVariantId("");
        }

      } catch (err) {
        handleApiError(err);
      }
    };

    fetchVariants();
  }, [syllabusId, classId, mode, initialData]);

  if (!open) return null;

  /* ---------------- IMAGE HANDLING ---------------- */

  const handleImageSelect = (file: File) => {
    setIconPreview(URL.createObjectURL(file));
    setIconFile(file);
    setIsNewImage(true);
    setCropOpen(true);
  };

  /* ---------------- SUBMIT ---------------- */

  const validationErrors = {
    name: !name.trim(),
    price: price === "" || price <= 0,
    syllabus: !syllabusId,
    class: !classId,
    subject: !subjectVariantId,
    icon: mode === "create" && !iconFile && !icon,
  };

  const hasErrors = Object.values(validationErrors).some(Boolean);

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    if (hasErrors) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSubmitting(true); // 🔒 lock button immediately

    try {
      let finalIcon: IconPayload;

      if (iconFile) {
        setUploading(true);
        setUploadProgress(0);

        finalIcon = await uploadToCloudinary({
          file: iconFile,
          uploadPreset: "chapters",
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
          onProgress: setUploadProgress,
        });

        setUploading(false);
      } else if (icon) {
        finalIcon = icon;
      } else {
        throw new Error("Icon required");
      }

      const payload = {
        name: name.trim(),
        price: Number(price),
        subjectVariant: subjectVariantId,
        icon: finalIcon,
      };

      if (mode === "create") {
        await onCreate(payload);
      }

      if (mode === "edit" && initialData) {
        await onUpdate(initialData._id, payload);
      }

      toast.success(mode === "create" ? "Chapter created" : "Chapter updated");
      onClose();
    } catch (err) {
      console.error(err);
      handleApiError(err)
    } finally {
      setUploading(false);
      setIsSubmitting(false); // 🔓 unlock only at the very end
    }
  };
  const busy = uploading || isSubmitting || !!loading;
  const close = () => {
    if (!busy) onClose();
  };
  const err = (key: keyof typeof validationErrors, msg: string) =>
    submitAttempted && validationErrors[key] ? msg : undefined;

  return (
    <>
      <AdminModal
        open={open}
        onClose={close}
        size="md"
        zIndex={1000}
        closeOnEsc={!cropOpen}
        closeOnBackdrop={!cropOpen}
        title={mode === "create" ? "Create Chapter" : "Edit Chapter"}
        description={mode === "create" ? "Add a chapter students can book a class for." : "Update the chapter details."}
        footer={
          <>
            <AdminButton variant="outline" onClick={close} disabled={busy}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSubmit} loading={uploading || isSubmitting}>
              {uploading || isSubmitting ? "Saving…" : mode === "create" ? "Create Chapter" : "Save changes"}
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
            <AdminField label="Chapter Name" required htmlFor="chapter-name" error={err("name", "Chapter name is required")}>
              <input
                id="chapter-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Algebra"
                className={`${adminInputCls(err("name", "x"))} h-11 sm:h-10 !py-0`}
              />
            </AdminField>
            <AdminField label="Price (₹)" required htmlFor="chapter-price" error={err("price", "Must be more than 0")}>
              <input
                id="chapter-price"
                type="number"
                inputMode="numeric"
                min={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                onFocus={() => {
                  if (price === 0) setPrice("");
                }}
                onBlur={(e) => {
                  if (e.target.value === "") setPrice(0);
                }}
                placeholder="Price"
                className={`${adminInputCls(err("price", "x"))} h-11 sm:h-10 !py-0 tabular-nums`}
              />
            </AdminField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminField label="Syllabus" required error={err("syllabus", "Please select a syllabus")}>
              <AdminSelect
                value={syllabusId}
                onChange={setSyllabusId}
                options={syllabuses.map((s) => ({ value: s._id, label: s.name }))}
                placeholder="Select syllabus"
                label="Syllabus"
                searchable={syllabuses.length > 8}
                error={!!err("syllabus", "x")}
              />
            </AdminField>
            <AdminField label="Class" required error={err("class", "Please select a class")}>
              <AdminSelect
                value={classId}
                onChange={setClassId}
                options={classes.map((c) => ({ value: c._id, label: c.name }))}
                placeholder="Select class"
                label="Class"
                searchable={classes.length > 8}
                error={!!err("class", "x")}
              />
            </AdminField>
          </div>

          <AdminField label="Subject" required error={err("subject", "Please select a subject")}>
            <AdminSelect
              value={subjectVariantId}
              onChange={setSubjectVariantId}
              options={subjectVariants.map((sv) => ({ value: sv._id, label: sv.subjectName }))}
              placeholder={!syllabusId || !classId ? "Select syllabus & class first" : "Select subject"}
              label="Subject"
              searchable={subjectVariants.length > 8}
              disabled={!syllabusId || !classId}
              emptyText="No subjects for this syllabus & class"
              error={!!err("subject", "x")}
            />
          </AdminField>

          {/* Icon */}
          <AdminField label="Chapter Icon" required={mode === "create"} error={err("icon", "Chapter icon is required")}>
            {iconPreview ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl border border-[#E4DDF2] overflow-hidden bg-[#FAF8FE] shrink-0">
                  <img src={iconPreview} alt="Chapter icon" className="w-full h-full object-cover" />
                </div>
                <AdminButton
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => {
                    setIcon(null);
                    setIconPreview(null);
                    setIconFile(null);
                    setIsNewImage(false);
                    requestAnimationFrame(() => {
                      fileInputRef.current?.click();
                    });
                  }}
                >
                  Change image
                </AdminButton>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center gap-1.5 h-28 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
                  err("icon", "x")
                    ? "border-red-300 bg-red-50/40"
                    : "border-[#CBB9F0] bg-[#FAF8FE] hover:bg-[#F4F1FA] hover:border-[#6D35D9]"
                }`}
              >
                <svg className="w-6 h-6 text-[#6D35D9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
                <span className="text-sm font-semibold text-[#6D35D9]">Choose image</span>
                <span className="text-xs text-[#8A80A3]">Square, cropped after you pick it</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleImageSelect(e.target.files[0])}
                />
              </label>
            )}
          </AdminField>

          {uploading && (
            <div>
              <div className="flex justify-between text-xs text-[#655B7E] mb-1">
                <span>Uploading icon…</span>
                <span className="tabular-nums">{uploadProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#F4F1FA] overflow-hidden">
                <div className="h-full rounded-full bg-[#6D35D9] transition-[width] duration-200" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* Assigned faculties — edit only */}
          {mode === "edit" && (
            <div>
              <p className="m-0 mb-2 text-xs font-semibold text-[#2A1650]/80">Assigned faculties</p>
              {facultiesLoading ? (
                <div className="flex items-center gap-2 text-sm text-[#8A80A3] py-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Loading faculties…
                </div>
              ) : faculties.length === 0 ? (
                <p className="m-0 text-sm text-[#8A80A3]">No faculty assigned to this chapter yet.</p>
              ) : (
                <div className="space-y-2">
                  {faculties.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 rounded-xl border border-[#E4DDF2] bg-[#FAF8FE] px-3 py-2.5">
                      {f.image ? (
                        <img src={f.image} alt={f.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#E4DDF2]" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#F4F1FA] text-[#6D35D9] flex items-center justify-center text-sm font-semibold shrink-0">
                          {f.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="m-0 text-sm font-semibold text-[#2A1650] truncate">{f.name}</p>
                        {f.qualifications.length > 0 && (
                          <p className="m-0 text-xs text-[#8A80A3] truncate">{f.qualifications.join(", ")}</p>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-[#6D35D9] shrink-0 tabular-nums">₹{f.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </AdminModal>

      {cropOpen && iconPreview && isNewImage && (
        <ImageCropModal
          open={cropOpen}
          image={iconPreview}
          aspect={1}
          onClose={() => setCropOpen(false)}
          onCropComplete={(file) => {
            setIconFile(file);
            setIconPreview(URL.createObjectURL(file));
            setIsNewImage(false);
          }}
        />
      )}
    </>
  );
}
