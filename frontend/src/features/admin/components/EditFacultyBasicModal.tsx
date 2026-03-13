import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import { getSubjectVariants } from "../../../api/chapter.api";
import { updateFaculty } from "../../../api/faculty.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";

/* ================================================================== */
/* TYPES                                                                */
/* ================================================================== */

type SubjectOfferingUI = {
  syllabusId: string;
  classId: string;
  subjectVariantId: string;
  label: string;
};

type Props = {
  open: boolean;
  facultyId: string;
  initialData?: any;
  syllabuses: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];
  onClose: () => void;
  onSuccess: () => void;
};

/* ================================================================== */
/* INLINE STYLE HELPERS (matches FacultyModal create)                   */
/* ================================================================== */

const inp = (hasError = false) =>
  `w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 ${
    hasError ? "border-red-400" : "border-gray-300"
  }`;

const sel = () =>
  "w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30";

/* ================================================================== */
/* COMPONENT                                                            */
/* ================================================================== */

export default function EditFacultyBasicModal({
  open,
  facultyId,
  initialData,
  syllabuses,
  classes,
  onClose,
  onSuccess,
}: Props) {
  /* ---------- Basic Fields ---------- */
  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [description, setDescription] = useState("");
  const [demoClass, setDemoClass] = useState("");
  const [price, setPrice] = useState<number | "">(0);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Keep the original {url, publicId} object so we can re-send it unchanged
  const [imagePayload, setImagePayload] = useState<{ url: string; publicId: string } | null>(null);

  /* ---------- Subject Offering ---------- */
  const [subjectOfferings, setSubjectOfferings] = useState<SubjectOfferingUI[]>([]);
  const [addingSubject, setAddingSubject] = useState(false);
  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectVariants, setSubjectVariants] = useState<any[]>([]);
  const [subjectVariantId, setSubjectVariantId] = useState("");

  /* ---------- Misc ---------- */
  const [cropOpen, setCropOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  /* ================================================================ */
  /* HYDRATE FROM API                                                   */
  /* ================================================================ */

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name ?? "");
    setQualifications((initialData.qualifications ?? []).join(", "));
    setDescription(initialData.description ?? "");
    setDemoClass(initialData.demoClass ?? "");
    setPrice(initialData.price ?? 0);
    // image can be a string URL or an object { url, publicId }
    const img = initialData.image;
    if (typeof img === "object" && img !== null) {
      setImageUrl(img.url);
      setImagePayload({ url: img.url, publicId: img.publicId });
    } else if (typeof img === "string") {
      setImageUrl(img);
      // Extract publicId from Cloudinary URL (last segment without extension)
      const parts = img.split("/");
      const fileNameWithExt = parts[parts.length - 1];
      const publicId = fileNameWithExt.split(".")[0];
      setImagePayload({ url: img, publicId });
    } else {
      setImageUrl(null);
      setImagePayload(null);
    }
    setImageFile(null);
    setErrors({});

    setSubjectOfferings(
      (initialData.subjectOffering ?? []).map((o: any) => ({
        syllabusId: o.syllabus.id,
        classId: o.class.id,
        subjectVariantId: o.id,
        label: `${o.subject.name} · ${o.class.name} · ${o.syllabus.name}`,
      }))
    );
  }, [initialData]);

  /* Fetch subject variants when syllabus + class selected */
  useEffect(() => {
    if (!syllabusId || !classId) {
      setSubjectVariants([]);
      setSubjectVariantId("");
      return;
    }

    getSubjectVariants({ syllabusId, classId })
      .then(setSubjectVariants)
      .catch(handleApiError);
  }, [syllabusId, classId]);

  /* ================================================================ */
  /* GUARD                                                              */
  /* ================================================================ */

  if (!open || !initialData) return null;

  /* ================================================================ */
  /* HELPERS                                                            */
  /* ================================================================ */

  const clearFieldError = (field: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const addSubjectOffering = () => {
    if (!syllabusId || !classId || !subjectVariantId) {
      toast.error("Select syllabus, class, and subject variant");
      return;
    }

    // Don't add duplicates
    if (subjectOfferings.some((s) => s.subjectVariantId === subjectVariantId)) {
      toast.error("This subject is already added");
      return;
    }

    const sylName = syllabuses.find((s) => s._id === syllabusId)?.name ?? "";
    const clsName = classes.find((c) => c._id === classId)?.name ?? "";
    const varName = subjectVariants.find((v: any) => v._id === subjectVariantId)?.subjectName ?? "";

    setSubjectOfferings((prev) => [
      ...prev,
      {
        syllabusId,
        classId,
        subjectVariantId,
        label: `${varName} · ${clsName} · ${sylName}`,
      },
    ]);

    // Reset add-row selectors
    setSyllabusId("");
    setClassId("");
    setSubjectVariantId("");
    setSubjectVariants([]);
    setAddingSubject(false);
  };

  /* ================================================================ */
  /* SAVE                                                               */
  /* ================================================================ */

  const save = async () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) errs.name = "Name must be at least 3 characters";
    if (!description.trim() || description.trim().length < 10) errs.description = "Description must be at least 10 characters";
    if (!price || Number(price) <= 0) errs.price = "Price must be greater than 0";
    if (!demoClass.trim()) errs.demoClass = "Demo class URL is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error(Object.values(errs)[0]);
      return;
    }

    setSaving(true);
    try {
      let finalImagePayload = imagePayload;

      if (imageFile) {
        const uploaded = await uploadToCloudinary({
          file: imageFile,
          uploadPreset: "faculties",
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
        });
        finalImagePayload = { url: uploaded.url, publicId: uploaded.publicId };
      }

      const payload: any = {
        name: name.trim(),
        qualifications: qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean),
        description: description.trim(),
        demoClass: demoClass.trim(),
        price: Number(price),
        subjects: subjectOfferings.map((s) => s.subjectVariantId),
      };

      // Always include image as {url, publicId} — backend requires it
      if (finalImagePayload) {
        payload.image = finalImagePayload;
      }

      await updateFaculty(facultyId, payload);
      toast.success("Faculty updated");
      onSuccess();
    } catch (err) {
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };

  /* ================================================================ */
  /* RENDER                                                             */
  /* ================================================================ */

  const isLoading = saving;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={!isLoading ? onClose : undefined}
      />

      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Edit Faculty — Basic Details
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ── Basic Info ── */}
          <Section title="Basic Information">
            <Field label="Faculty Name" error={errors.name}>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                maxLength={100}
                placeholder="Enter faculty name"
                className={inp(!!errors.name)}
              />
            </Field>

            <Field
              label="Qualifications"
              hint="Comma-separated — e.g. MSc Physics, B.Ed"
              error={errors.qualifications}
            >
              <input
                value={qualifications}
                onChange={(e) => { setQualifications(e.target.value); clearFieldError("qualifications"); }}
                maxLength={300}
                placeholder="MSc Physics, B.Ed"
                className={inp(!!errors.qualifications)}
              />
            </Field>

            <Field label="Description" error={errors.description}>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); clearFieldError("description"); }}
                rows={3}
                maxLength={1000}
                placeholder="Brief teaching background…"
                className={inp(!!errors.description) + " resize-none"}
              />
              <div className="flex justify-end mt-0.5">
                <span className={`text-xs ${description.length > 950 ? "text-red-500" : "text-gray-400"}`}>
                  {description.length}/1000
                </span>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Demo Class URL" error={errors.demoClass}>
                <input
                  value={demoClass}
                  onChange={(e) => { setDemoClass(e.target.value); clearFieldError("demoClass"); }}
                  placeholder="https://youtu.be/..."
                  className={inp(!!errors.demoClass)}
                />
              </Field>
              <Field label="Price (₹)" error={errors.price}>
                <input
                  type="number"
                  value={price}
                  min={1}
                  max={999999}
                  onChange={(e) => {
                    setPrice(e.target.value === "" ? "" : Number(e.target.value));
                    clearFieldError("price");
                  }}
                  placeholder="e.g. 1500"
                  className={inp(!!errors.price)}
                />
              </Field>
            </div>
          </Section>

          {/* ── Image ── */}
          <Section title="Faculty Image">
            <div className="flex items-center gap-4">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="w-16 h-16 rounded-lg object-cover border"
                />
              )}
              <div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  {imageUrl ? "Change Image" : "Upload Image"}
                </button>
                <p className="mt-1 text-xs text-gray-400">
                  Square image, min 300×300 recommended
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    setErrors((prev) => ({ ...prev, image: "Image must be under 5 MB" }));
                    e.target.value = "";
                    return;
                  }
                  clearFieldError("image");
                  setImageFile(file);
                  setImageUrl(URL.createObjectURL(file));
                  setCropOpen(true);
                }}
              />
            </div>
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </Section>

          {/* ── Subjects ── */}
          <Section title="Subjects">
            {/* Existing subject offerings */}
            {subjectOfferings.length > 0 && (
              <div className="space-y-2">
                {subjectOfferings.map((s) => (
                  <div
                    key={s.subjectVariantId}
                    className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <span className="text-sm text-gray-800">{s.label}</span>
                    <button
                      onClick={() =>
                        setSubjectOfferings((prev) =>
                          prev.filter((x) => x.subjectVariantId !== s.subjectVariantId)
                        )
                      }
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {subjectOfferings.length === 0 && !addingSubject && (
              <p className="text-sm text-gray-400">No subjects assigned yet</p>
            )}

            {/* Add subject row */}
            {addingSubject ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-3 space-y-3 bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={syllabusId}
                    onChange={(e) => {
                      setSyllabusId(e.target.value);
                      setClassId("");
                      setSubjectVariantId("");
                    }}
                    className={sel()}
                  >
                    <option value="">Syllabus</option>
                    {syllabuses.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>

                  <select
                    value={classId}
                    disabled={!syllabusId}
                    onChange={(e) => {
                      setClassId(e.target.value);
                      setSubjectVariantId("");
                    }}
                    className={sel() + (!syllabusId ? " bg-gray-100" : "")}
                  >
                    <option value="">
                      {syllabusId ? "Class" : "Pick syllabus first"}
                    </option>
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {subjectVariants.length > 0 && (
                  <select
                    value={subjectVariantId}
                    onChange={(e) => setSubjectVariantId(e.target.value)}
                    className={sel()}
                  >
                    <option value="">Select subject variant</option>
                    {subjectVariants.map((v: any) => (
                      <option key={v._id} value={v._id}>{v.subjectName}</option>
                    ))}
                  </select>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={addSubjectOffering}
                    disabled={!subjectVariantId}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-[#DB313E] rounded hover:bg-[#c22935] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingSubject(false);
                      setSyllabusId("");
                      setClassId("");
                      setSubjectVariantId("");
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingSubject(true)}
                className="text-sm font-medium text-[#DB313E] hover:text-[#c22935]"
              >
                + Add Subject
              </button>
            )}
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#DB313E] rounded hover:bg-[#c22935] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Image Crop Modal */}
      {cropOpen && imageUrl && (
        <ImageCropModal
          open={cropOpen}
          image={imageUrl}
          aspect={1}
          onClose={() => setCropOpen(false)}
          onCropComplete={(file) => {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
            setCropOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ================================================================== */
/* SMALL HELPERS (matching FacultyModal create style)                   */
/* ================================================================== */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-800 border-b pb-1">{title}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
