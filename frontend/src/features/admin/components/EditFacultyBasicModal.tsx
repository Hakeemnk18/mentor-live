import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import { getSubjectVariants } from "../../../api/chapter.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";

type SubjectOfferingUI = {
  syllabusId: string;
  classId: string;
  subjectVariantId: string;
  label: string; // UI only
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

export default function EditFacultyBasicModal({
  open,
  facultyId,
  initialData,
  syllabuses,
  classes,
  onClose,
  onSuccess,
}: Props) {
  /* ---------------- BASIC DETAILS ---------------- */

  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([""]);
  const [description, setDescription] = useState("");
  const [demoClass, setDemoClass] = useState("");
  const [price, setPrice] = useState(0);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  /* ---------------- SUBJECT OFFERING ---------------- */

  const [subjectOfferings, setSubjectOfferings] =
    useState<SubjectOfferingUI[]>([]);

  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectVariants, setSubjectVariants] = useState<any[]>([]);
  const [subjectVariantId, setSubjectVariantId] = useState("");

  /* ---------------- MISC ---------------- */

  const [cropOpen, setCropOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ---------------- HYDRATE FROM API ---------------- */

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name ?? "");
    setQualifications(initialData.qualifications ?? [""]);
    setDescription(initialData.description ?? "");
    setDemoClass(initialData.demoClass ?? "");
    setPrice(initialData.price ?? 0);
    setImageUrl(initialData.image ?? null);
    setImageFile(null);

    setSubjectOfferings(
      (initialData.subjectOffering ?? []).map((o: any) => ({
        syllabusId: o.syllabus.id,
        classId: o.class.id,
        subjectVariantId: o.id,
        label: `${o.subject.name} · ${o.class.name} · ${o.syllabus.name}`,
      }))
    );
  }, [initialData]);
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
      } catch (err) {
        handleApiError(err);
      }
    };

    fetchVariants();
  }, [syllabusId, classId]);

  /* ---------------- FETCH SUBJECT VARIANTS ---------------- */

  useEffect(() => {
    if (!syllabusId || !classId) return;

    getSubjectVariants({ syllabusId, classId })
      .then(setSubjectVariants)
      .catch(handleApiError);
  }, [syllabusId, classId]);

  /* ---------------- GUARD ---------------- */

  if (!open || !initialData) return null;

  /* ---------------- SAVE ---------------- */

  const save = async () => {
    if (!name.trim() || !description.trim() || price <= 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);

    try {
      let finalImage = imageUrl;

      if (imageFile) {
        finalImage = (
          await uploadToCloudinary({
            file: imageFile,
            uploadPreset: "faculties",
            cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
          })
        ).url;
      }

      const payload = {
        name: name.trim(),
        qualifications: qualifications.filter(Boolean),
        description: description.trim(),
        demoClass: demoClass.trim(),
        price,
        image: finalImage,
        subjectOffering: subjectOfferings.map((s) => ({
          syllabus: s.syllabusId,
          class: s.classId,
          subjectVariant: s.subjectVariantId,
        })),
      };

      await fetch(`/faculties/${facultyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("Faculty updated");
      onSuccess();
      onClose();
    } catch (err) {
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);


  /* ---------------- UI ---------------- */

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-xl flex flex-col shadow-xl">

      {/* HEADER */}
      <div className="border-b px-6 py-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Edit Faculty – Basic Details
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Update personal information, subjects offered and pricing
        </p>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10">

        {/* ================= BASIC DETAILS ================= */}
        <section className="space-y-6">
          <h4 className="text-sm font-semibold text-gray-700">
            Faculty Information
          </h4>

          {/* NAME */}
          <div className="space-y-2">
            <Label>Faculty Name</Label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter faculty name"
            />
          </div>

          {/* QUALIFICATIONS */}
          <div className="space-y-2">
            <Label>Qualifications</Label>
            <textarea
              className="input"
              rows={2}
              value={qualifications.join(", ")}
              onChange={(e) =>
                setQualifications(
                  e.target.value.split(",").map((q) => q.trim())
                )
              }
              placeholder="Eg: MSc Physics, B.Ed"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              className="input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description about the faculty"
            />
          </div>

          {/* DEMO + PRICE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Demo Class (YouTube)</Label>
              <input
                className="input"
                value={demoClass}
                onChange={(e) => setDemoClass(e.target.value)}
                placeholder="https://youtu.be/..."
              />
            </div>

            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <input
                type="number"
                className="input"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Enter price"
              />
            </div>
          </div>
        </section>

        {/* ================= IMAGE ================= */}
        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">
            Faculty Image
          </h4>

          <div className="flex items-center gap-5">
            {imageUrl && (
              <img
                src={imageUrl}
                className="w-20 h-20 rounded-lg object-cover border"
                alt="Faculty"
              />
            )}

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="btn-outline text-sm"
              >
                Change Image
              </button>
              <p className="text-xs text-gray-500">
                Recommended: square image, minimum 300×300
              </p>
            </div>

            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImageUrl(URL.createObjectURL(file));
                  setCropOpen(true);
                }
              }}
            />
          </div>
        </section>

        {/* ================= SUBJECT OFFERING ================= */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">
              Subjects Offered
            </h4>

            <button
              className="btn-outline text-sm"
              onClick={() => setAddSubjectOpen(true)}
            >
              + Add Subject
            </button>
          </div>

          {subjectOfferings.length === 0 && (
            <p className="text-sm text-gray-500">
              No subjects assigned yet
            </p>
          )}

          <div className="space-y-3">
            {subjectOfferings.map((s) => (
              <div
                key={s.subjectVariantId}
                className="flex items-center justify-between px-4 py-2.5 border rounded-lg bg-gray-50"
              >
                <span className="text-sm text-gray-800">
                  {s.label}
                </span>

                <button
                  onClick={() =>
                    setSubjectOfferings((prev) =>
                      prev.filter(
                        (x) => x.subjectVariantId !== s.subjectVariantId
                      )
                    )
                  }
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
        <button onClick={onClose} className="btn-outline">
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>

    {/* IMAGE CROP MODAL */}
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
