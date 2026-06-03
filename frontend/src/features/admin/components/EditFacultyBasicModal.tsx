import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import { getSubjectVariants } from "../../../api/chapter.api";
import { updateFaculty } from "../../../api/faculty.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { FacultyData, SubjectOffering, UpdateFacultyPayload } from "../../../shared/types/faculty.types";

type SubjectOfferingRow = {
  syllabusId: string;
  classId: string;
  subjectVariantId: string;
  label: string;
  price: number;
};

/* ================================================================== */
/* TYPES                                                                */
/* ================================================================== */

type Props = {
  open: boolean;
  facultyId: string;
  initialData?: FacultyData;
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

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Keep the original {url, publicId} object so we can re-send it unchanged
  const [imagePayload, setImagePayload] = useState<{ url: string; publicId: string } | null>(null);

  /* ---------- Subject Offering ---------- */
  const [subjectOfferings, setSubjectOfferings] = useState<SubjectOfferingRow[]>([]);
  const [addingSubject, setAddingSubject] = useState(false);
  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectVariants, setSubjectVariants] = useState<{ _id: string; subjectName: string }[]>([]);
  const [subjectVariantId, setSubjectVariantId] = useState("");
  const [newSubjectPrice, setNewSubjectPrice] = useState<number | "">("");

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
      (initialData.subjectOffering ?? []).map((o: SubjectOffering) => ({
        syllabusId: o.syllabus.id,
        classId: o.class.id,
        subjectVariantId: o.id,
        label: `${o.subject.name} · ${o.class.name} · ${o.syllabus.name}`,
        price: o.price ?? 0,
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
    if (!newSubjectPrice || Number(newSubjectPrice) <= 0) {
      toast.error("Enter a price greater than 0");
      return;
    }

    // Don't add duplicates
    if (subjectOfferings.some((s) => s.subjectVariantId === subjectVariantId)) {
      toast.error("This subject is already added");
      return;
    }

    const sylName = syllabuses.find((s) => s._id === syllabusId)?.name ?? "";
    const clsName = classes.find((c) => c._id === classId)?.name ?? "";
    const varName = subjectVariants.find((v) => v._id === subjectVariantId)?.subjectName ?? "";

    setSubjectOfferings((prev) => [
      ...prev,
      {
        syllabusId,
        classId,
        subjectVariantId,
        label: `${varName} · ${clsName} · ${sylName}`,
        price: Number(newSubjectPrice),
      },
    ]);

    // Reset add-row selectors
    setSyllabusId("");
    setClassId("");
    setSubjectVariantId("");
    setSubjectVariants([]);
    setNewSubjectPrice("");
    setAddingSubject(false);
  };

  /* ================================================================ */
  /* SAVE                                                               */
  /* ================================================================ */

  const save = async () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) errs.name = "Name must be at least 3 characters";
    if (!description.trim() || description.trim().length < 10) errs.description = "Description must be at least 10 characters";
    if (!demoClass.trim()) errs.demoClass = "Demo class URL is required";
    if (subjectOfferings.length === 0) errs.subjects = "At least one subject is required";
    else if (subjectOfferings.some((s) => !s.price || s.price <= 0))
      errs.subjects = "All subjects must have a price greater than 0";

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

      const payload: UpdateFacultyPayload = {
        name: name.trim(),
        qualifications: qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean),
        description: description.trim(),
        demoClass: demoClass.trim(),
        subjects: subjectOfferings.map((s) => ({
          variantId: s.subjectVariantId,
          price: s.price,
        })),
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

          {/* Basic Info */}
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
                placeholder="Brief teaching background..."
                className={inp(!!errors.description) + " resize-none"}
              />
              <div className="flex justify-end mt-0.5">
                <span className={`text-xs ${description.length > 950 ? "text-red-500" : "text-gray-400"}`}>
                  {description.length}/1000
                </span>
              </div>
            </Field>

            <Field label="Demo Class URL" error={errors.demoClass}>
              <input
                value={demoClass}
                onChange={(e) => { setDemoClass(e.target.value); clearFieldError("demoClass"); }}
                placeholder="https://youtu.be/..."
                className={inp(!!errors.demoClass)}
              />
            </Field>
          </Section>

          {/* Image */}
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
                  Square image, min 300x300 recommended
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

          {/* Subjects */}
          <Section title="Subjects">
            {errors.subjects && (
              <p className="text-xs text-red-500 mb-2">{errors.subjects}</p>
            )}

            {/* Existing subject offerings */}
            {subjectOfferings.length > 0 && (
              <div className="space-y-2">
                {subjectOfferings.map((s) => (
                  <div
                    key={s.subjectVariantId}
                    className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <span className="flex-1 text-sm text-gray-800">{s.label}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-gray-500">{String.fromCharCode(8377)}</span>
                      <input
                        type="number"
                        min={1}
                        value={s.price || String()}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setSubjectOfferings((prev) =>
                            prev.map((x) =>
                              x.subjectVariantId === s.subjectVariantId
                                ? { ...x, price: val }
                                : x
                            )
                          );
                          clearFieldError(`subjects`);
                        }}
                        placeholder="Price"
                        className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#DB313E]"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setSubjectOfferings((prev) =>
                          prev.filter((x) => x.subjectVariantId !== s.subjectVariantId)
                        )
                      }
                      className="text-xs text-red-500 hover:text-red-600 shrink-0"
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
                  <SearchableSelect
                    value={syllabusId}
                    onChange={(v) => {
                      setSyllabusId(v);
                      setClassId("");
                      setSubjectVariantId("");
                    }}
                    options={syllabuses.map((s) => ({ value: s._id, label: s.name }))}
                    placeholder="Syllabus"
                  />

                  <SearchableSelect
                    value={classId}
                    onChange={(v) => {
                      setClassId(v);
                      setSubjectVariantId("");
                    }}
                    options={classes.map((c) => ({ value: c._id, label: c.name }))}
                    placeholder={syllabusId ? "Class" : "Pick syllabus first"}
                    disabled={!syllabusId}
                  />
                </div>

                {subjectVariants.length > 0 && (
                  <SearchableSelect
                    value={subjectVariantId}
                    onChange={setSubjectVariantId}
                    options={subjectVariants.map((v: { _id: string; subjectName: string }) => ({ value: v._id, label: v.subjectName }))}
                    placeholder="Select subject variant"
                  />
                )}

                {subjectVariantId && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 shrink-0">Price (Rs.)</span>
                    <input
                      type="number"
                      min={1}
                      value={newSubjectPrice}
                      onChange={(e) =>
                        setNewSubjectPrice(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      placeholder="e.g. 1500"
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#DB313E]"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={addSubjectOffering}
                    disabled={!subjectVariantId || !newSubjectPrice}
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
                      setNewSubjectPrice("");
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
            {saving ? "Saving..." : "Save Changes"}
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
