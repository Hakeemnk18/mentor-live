import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { getSubjectVariants } from "../../../api/chapter.api";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { ChapterInitialData } from "../../../shared/types/chapter.types";
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
  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/30"
          onClick={!loading ? onClose : undefined}
        />

        <div className="relative w-full max-w-lg mx-4 bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {mode === "create" ? "Create Chapter" : "Edit Chapter"}
          </h2>

          <div className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chapter name"
              className={`w-full px-3 py-2 text-sm border rounded
    ${submitAttempted && validationErrors.name ? "border-red-400" : ""}
  `}
            />

            {submitAttempted && validationErrors.name && (
              <p className="text-xs text-red-500">Chapter name is required</p>
            )}

           <input
  type="number"
  value={price}
  onChange={(e) => setPrice(Number(e.target.value))}
  onFocus={() => { if (price === 0) setPrice("") }}
  onBlur={(e) => { if (e.target.value === '') setPrice(0) }}
  placeholder="Price"
  className={`w-full px-3 py-2 text-sm border rounded
    ${submitAttempted && validationErrors.price ? "border-red-400" : ""}
  `}
/>

            {submitAttempted && validationErrors.price && (
              <p className="text-xs text-red-500">
                Price must be greater than 0
              </p>
            )}

            <SearchableSelect
              value={syllabusId}
              onChange={setSyllabusId}
              options={syllabuses.map((s) => ({ value: s._id, label: s.name }))}
              placeholder="Select syllabus"
              hasError={submitAttempted && validationErrors.syllabus}
            />

            {submitAttempted && validationErrors.syllabus && (
              <p className="text-xs text-red-500">Please select a syllabus</p>
            )}

            <SearchableSelect
              value={classId}
              onChange={setClassId}
              options={classes.map((c) => ({ value: c._id, label: c.name }))}
              placeholder="Select class"
              hasError={submitAttempted && validationErrors.class}
            />

            {submitAttempted && validationErrors.class && (
              <p className="text-xs text-red-500">Please select a class</p>
            )}

            <SearchableSelect
              value={subjectVariantId}
              onChange={setSubjectVariantId}
              options={subjectVariants.map((sv) => ({ value: sv._id, label: sv.subjectName }))}
              placeholder={!syllabusId || !classId ? "Select syllabus & class first" : "Select subject"}
              disabled={!syllabusId || !classId}
              hasError={submitAttempted && validationErrors.subject}
            />

            {submitAttempted && validationErrors.subject && (
              <p className="text-xs text-red-500">Please select a subject</p>
            )}
          </div>

          {/* IMAGE */}
          <div className="mt-6 space-y-2">
            <label className="text-xs font-medium text-gray-600">
              Chapter Icon
            </label>
            {submitAttempted && validationErrors.icon && (
              <p className="text-xs text-red-500">Chapter icon is required</p>
            )}

            {iconPreview ? (
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded border overflow-hidden bg-gray-50">
                  <img
                    src={iconPreview}
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIcon(null);
                    setIconPreview(null);
                    setIconFile(null);
                    setIsNewImage(false);
                    requestAnimationFrame(() => {
                      fileInputRef.current?.click();
                    });
                  }}
                  className="px-3 py-1.5 text-xs rounded border border-gray-300"
                >
                  Change image
                </button>
              </div>
            ) : (
              <label className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-dashed rounded cursor-pointer">
                📷 Choose image
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleImageSelect(e.target.files[0])
                  }
                />
              </label>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="text-xs">{uploadProgress}%</div>
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-[#DB313E]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={uploading || isSubmitting}
              onClick={handleSubmit}
              className={`
    px-4 py-2 text-sm rounded text-white
    bg-[#DB313E]
    transition
    ${
      uploading || isSubmitting
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-[#c72b36]"
    }
  `}
            >
              {uploading
                ? "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Update"}
            </button>
          </div>
        </div>
      </div>

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
