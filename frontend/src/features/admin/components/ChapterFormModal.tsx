import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { getSubjectVariants } from "../../../api/chapter.api";

/* ---------------- TYPES ---------------- */

type SubjectVariant = {
  _id: string;
  subjectName: string;
};

type ChapterInitialData = {
  _id: string;
  name: string;
  price: number;
  syllabusId: string;
  classId: string;
  subjectVariantId: string;
  icon?: string | null;
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
    icon: string;
  }) => Promise<void>;

  onUpdate: (
    id: string,
    data: {
      name: string;
      price: number;
      subjectVariant: string;
      icon: string | null;
    }
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
  const [price, setPrice] = useState<number>(0);

  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectVariantId, setSubjectVariantId] = useState("");

  const [subjectVariants, setSubjectVariants] = useState<SubjectVariant[]>([]);

  /* ---------------- IMAGE STATE ---------------- */

  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [isNewImage, setIsNewImage] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  /* ---------------- INIT ---------------- */

  useEffect(() => {
  if (!open) return;

  if (mode === "edit" && initialData) {
    // Prefill only non-dependent fields
    setName(initialData.name);
    setPrice(initialData.price);

    // ⛔ Force re-selection order
    setSyllabusId("");
    setClassId("");
    setSubjectVariantId("");
    setSubjectVariants([]);

    // Image can be shown
    setIconPreview(initialData.icon ?? null);
    setIconFile(null);
    setIsNewImage(false);
  } else {
    // Create mode reset
    setName("");
    setPrice(0);
    setSyllabusId("");
    setClassId("");
    setSubjectVariantId("");
    setSubjectVariants([]);
    setIconPreview(null);
    setIconFile(null);
    setIsNewImage(false);
  }
}, [open, mode, initialData]);

  /* ---------------- SUBJECT VARIANTS ---------------- */

  useEffect(() => {
    if (!syllabusId || !classId) {
      setSubjectVariants([]);
      setSubjectVariantId("");
      return;
    }

    const fetchVariants = async () => {
      try {
        const res = await getSubjectVariants({ syllabusId, classId });
        setSubjectVariants(res);
      } catch {
        toast.error("Failed to load subject variants");
      }
    };

    fetchVariants();
  }, [syllabusId, classId]);

  if (!open) return null;

  /* ---------------- IMAGE HANDLING ---------------- */

  const handleImageSelect = (file: File) => {
    setIconPreview(URL.createObjectURL(file));
    setIconFile(file);
    setIsNewImage(true); // 👈 THIS IS KEY
    setCropOpen(true);
  };

  const uploadToCloudinary = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "chapters");

      setUploading(true);
      setUploadProgress(0);

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_NAME
        }/image/upload`
      );

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploading(false);

        if (xhr.status >= 200 && xhr.status < 300) {
          const res = JSON.parse(xhr.responseText);
          console.log("Cloudinary response:", res);
          resolve(res.secure_url);
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        reject(new Error("Upload failed"));
      };

      xhr.send(formData);
    });
  };

  /* ---------------- SUBMIT ---------------- */

  const canSubmit =
    name.trim() &&
    price > 0 &&
    syllabusId &&
    classId &&
    subjectVariantId &&
    (mode === "edit" || iconFile);

  const handleSubmit = async () => {
    try {
      let iconUrl = iconPreview;

      if (iconFile) {
        iconUrl = await uploadToCloudinary(iconFile);
      }

      if (mode === "create") {
        await onCreate({
          name: name.trim(),
          price,
          subjectVariant: subjectVariantId,
          icon: iconUrl!,
        });
      }

      if (mode === "edit" && initialData) {
        await onUpdate(initialData._id, {
          name: name.trim(),
          price,
          subjectVariant: subjectVariantId,
          icon: iconUrl ?? null,
        });
      }

      toast.success(mode === "create" ? "Chapter created" : "Chapter updated");
      onClose();
    } catch {
      toast.error("Operation failed");
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

        <div className="relative w-full max-w-lg bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {mode === "create" ? "Create Chapter" : "Edit Chapter"}
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chapter name"
              className="w-full px-3 py-2 text-sm border rounded"
            />

            {/* Price */}
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Price"
              className="w-full px-3 py-2 text-sm border rounded"
            />

            {/* Syllabus */}
            <select
              value={syllabusId}
              onChange={(e) => setSyllabusId(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded"
            >
              <option value="">Select syllabus</option>
              {syllabuses.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Class */}
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded"
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Subject Variant */}
            <select
              value={subjectVariantId}
              onChange={(e) => setSubjectVariantId(e.target.value)}
              disabled={!syllabusId || !classId}
              className="w-full px-3 py-2 text-sm border rounded"
            >
              <option value="">Select subject</option>
              {subjectVariants.map((sv) => (
                <option key={sv._id} value={sv._id}>
                  {sv.subjectName}
                </option>
              ))}
            </select>
          </div>
          {/* ---------------- IMAGE SECTION ---------------- */}
          <div className="mt-6 space-y-2">
            <label className="text-xs font-medium text-gray-600">
              Chapter Icon
            </label>

            {iconPreview ? (
              <div className="flex items-start gap-4">
                {/* Image Preview */}
                <div className="w-24 h-24 rounded border overflow-hidden bg-gray-50">
                  <img
                    src={iconPreview}
                    alt="Chapter icon"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      // UI only – no Cloudinary action
                      setIconPreview(null);
                      setIconFile(null);
                      setIsNewImage(false);

                      // Open file picker
                      requestAnimationFrame(() => {
                        fileInputRef.current?.click();
                      });
                    }}
                    className="
            px-3 py-1.5
            text-xs
            rounded
            border border-gray-300
            text-gray-700
            hover:bg-gray-100
            transition
          "
                  >
                    Change image
                  </button>
                </div>
              </div>
            ) : (
              <label
                className="
        inline-flex items-center gap-2
        px-4 py-2
        text-sm
        border border-dashed border-gray-300
        rounded
        cursor-pointer
        text-gray-600
        hover:bg-gray-50
        hover:border-gray-400
        transition
      "
              >
                <span className="text-lg">📷</span>
                <span>Choose image</span>

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
              className="px-4 py-2 text-sm border rounded"
            >
              Cancel
            </button>

            <button
              disabled={!canSubmit || uploading}
              onClick={handleSubmit}
              className="px-4 py-2 text-sm bg-[#DB313E] text-white rounded disabled:opacity-50"
            >
              {mode === "create" ? "Create" : "Update"}
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
