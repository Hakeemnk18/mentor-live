import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { getSubjectVariants } from "../../../api/chapter.api";

type SubjectVariant = {
  _id: string;
  subjectName: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  loading?: boolean;

  syllabuses: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];

  fetchSubjectVariants: (params: {
    syllabusId: string;
    classId: string;
  }) => Promise<SubjectVariant[]>;

  onCreate: (data: {
    name: string;
    price: number;
    subjectVariant: string;
    icon: string;
  }) => Promise<void>;
};

export default function CreateChapterModal({
  open,
  onClose,
  loading,
  syllabuses,
  classes,
  fetchSubjectVariants,
  onCreate,
}: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);

  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectVariantId, setSubjectVariantId] = useState("");

  const [subjectVariants, setSubjectVariants] = useState<SubjectVariant[]>([]);

  // image
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    setName("");
    setPrice(0);
    setSyllabusId("");
    setClassId("");
    setSubjectVariantId("");
    setSubjectVariants([]);
    setIconPreview(null);
    setIconFile(null);
  }, [open]);

  // Fetch subject variants only when both selected
  useEffect(() => {
    if (!syllabusId || !classId) {
      setSubjectVariants([]);
      setSubjectVariantId("");
      return;
    }

    const fetchVariants = async () => {
      try {
        const res = await getSubjectVariants({
          syllabusId,
          classId,
        });
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
    setCropOpen(true);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chapters");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/<YOUR_CLOUD_NAME>/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  /* ---------------- SUBMIT ---------------- */

  const canSubmit =
    name.trim() &&
    price > 0 &&
    syllabusId &&
    classId &&
    subjectVariantId &&
    iconFile;

  const handleSubmit = async () => {
    try {
      if (!iconFile) return;

      const iconUrl = await uploadToCloudinary(iconFile);

      await onCreate({
        name: name.trim(),
        price,
        subjectVariant: subjectVariantId,
        icon: iconUrl,
      });

      toast.success("Chapter created successfully");
      onClose();
    } catch {
      toast.error("Failed to create chapter");
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
          <h2 className="text-lg font-semibold mb-4">Create Chapter</h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Chapter Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-medium text-gray-600">Price</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border rounded"
              />
            </div>

            {/* Syllabus */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Syllabus
              </label>
              <select
                value={syllabusId}
                onChange={(e) => {
                  setSyllabusId(e.target.value);
                  setSubjectVariantId("");
                }}
                className="w-full px-3 py-2 text-sm border rounded"
              >
                <option value="">Select syllabus</option>
                {syllabuses.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="text-xs font-medium text-gray-600">Class</label>
              <select
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setSubjectVariantId("");
                }}
                className="w-full px-3 py-2 text-sm border rounded"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Variant */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Subject
              </label>
              <select
                value={subjectVariantId}
                onChange={(e) => setSubjectVariantId(e.target.value)}
                disabled={!syllabusId || !classId}
                className="px-3 py-2 text-sm border rounded
      disabled:bg-gray-100"
              >
                <option value="">Select subject</option>
                {subjectVariants.map((sv) => (
                  <option key={sv._id} value={sv._id}>
                    {sv.subjectName}
                  </option>
                ))}
              </select>
            </div>

            {/* Icon */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Chapter Icon
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleImageSelect(e.target.files[0])
                }
                className="text-sm"
              />

              {iconPreview && (
                <img
                  src={iconPreview}
                  className="h-20 w-20 mt-2 rounded object-cover border"
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={!canSubmit || loading}
              onClick={handleSubmit}
              className="px-4 py-2 text-sm rounded bg-[#DB313E] text-white disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Cropper */}
      {iconPreview && (
        <ImageCropModal
          open={cropOpen}
          image={iconPreview}
          aspect={1}
          onClose={() => setCropOpen(false)}
          onCropComplete={(file) => {
            setIconFile(file);
            setIconPreview(URL.createObjectURL(file));
          }}
        />
      )}
    </>
  );
}
