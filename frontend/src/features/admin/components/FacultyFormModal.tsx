import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import {
  getChapters,
  getChaptersList,
  getSubjectVariants,
} from "../../../api/chapter.api";
import { getSubjects } from "../../../api/subject.api";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";

/* ---------------- TYPES ---------------- */

type IconPayload = {
  url: string;
  publicId: string;
};

type SlotPayload = {
  time: string;
};

type ChapterOption = {
  _id: string;
  name: string;
};

type SubjectOption = {
  _id: string;
  name: string;
};

export type FacultyInitialData = {
  _id: string;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  price: number;

  image?: string | null;

  slots: {
    id: string;
    time: string; // "06:30"
  }[];

  chapterSlots: {
    chapter: string;
  }[];

  subjectOffering: {
    id: string; // subjectVariantId
    class: {
      id: string;
      name: string;
    };
    syllabus: {
      id: string;
      name: string;
    };
    subject: {
      id: string;
      name: string;
    };
  }[];
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: FacultyInitialData;
  onClose: () => void;
  loading?: boolean;
  syllabuses: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];
  onCreate: (data: any) => Promise<void>;
  onUpdate: (id: string, data: any) => Promise<void>;
};

/* ---------------- HELPERS ---------------- */

const generateInitialSlots = (): SlotPayload[] => {
  const base = new Date();
  base.setHours(15, 0, 0, 0);

  return Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(base);
    d.setHours(base.getHours() + i);
    return { time: d.toISOString() };
  });
};

const formatSlotLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

/* ---------------- COMPONENT ---------------- */

export default function FacultyFormModal({
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
  /* ---------------- STATE ---------------- */
  console.log("initial data ", initialData);

  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([""]);
  const [description, setDescription] = useState("");
  const [demoClass, setDemoClass] = useState("");
  const [price, setPrice] = useState(0);

  const [slots, setSlots] = useState<SlotPayload[]>([]);
  const [chapterSlots, setChapterSlots] = useState<{ chapter: string }[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [syllabusId, setSyllabusId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [selectedChapter, setSelectedChapter] = useState("");

  const [image, setImage] = useState<IconPayload | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [isNewImage, setIsNewImage] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // SUBJECT FLOW
  const [subjectSyllabusId, setSubjectSyllabusId] = useState("");
  const [subjectClassId, setSubjectClassId] = useState("");

  // CHAPTER SLOT FLOW
  const [chapterSyllabusId, setChapterSyllabusId] = useState("");
  const [chapterClassId, setChapterClassId] = useState("");
  const [chapterSubjectId, setChapterSubjectId] = useState("");

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    if (!open) return;

    /* ---------------- CREATE MODE ---------------- */
    if (mode === "create") {
      setName("");
      setQualifications([""]);
      setDescription("");
      setDemoClass("");
      setPrice(0);

      setSlots(generateInitialSlots());
      setChapterSlots([]);

      setImage(null);
      setImagePreview(null);
      setImageFile(null);

      setSelectedSubjects([]);

      setSubjectSyllabusId("");
      setSubjectClassId("");

      setChapterSyllabusId("");
      setChapterClassId("");
      setChapterSubjectId("");

      setSubjects([]);
      setChapters([]);

      setSubmitAttempted(false);
      return;
    }

    /* ---------------- EDIT MODE ---------------- */
    if (mode === "edit" && initialData) {
      /* BASIC INFO */
      setName(initialData.name ?? "");
      setQualifications(
        Array.isArray(initialData.qualifications)
          ? initialData.qualifications
          : [""],
      );
      setDescription(initialData.description ?? "");
      setDemoClass(initialData.demoClass ?? "");
      setPrice(initialData.price ?? 0);

      /* IMAGE (backend sends string) */
      if (initialData.image) {
        setImage({ url: initialData.image, publicId: "" });
        setImagePreview(initialData.image);
      } else {
        setImage(null);
        setImagePreview(null);
      }
      setImageFile(null);

      /* SUBJECTS (subjectVariantIds) */
      setSelectedSubjects(
        Array.isArray(initialData.subjectOffering)
          ? initialData.subjectOffering.map((s: any) => s.id)
          : [],
      );

      /* AUTO-SET syllabus & class for subjects (optional but recommended) */
      const firstOffering = initialData.subjectOffering?.[0];
      if (firstOffering) {
        setSubjectSyllabusId(firstOffering.syllabus.id);
        setSubjectClassId(firstOffering.class.id);
      }

      /* SLOTS ("06:30" → ISO) */
      setSlots(
        Array.isArray(initialData.slots)
          ? initialData.slots.map((s: any) => {
              const base = new Date();
              const [h, m] = s.time.split(":").map(Number);
              base.setHours(h, m, 0, 0);
              return { time: base.toISOString() };
            })
          : [],
      );

      /* CHAPTER SLOTS */
      // 🔥 NORMALIZE CHAPTER SLOTS HERE
      const normalizedChapterSlots = Array.isArray(initialData.chapterSlots)
        ? initialData.chapterSlots.map((cs: any) => ({
            chapter:
              typeof cs.chapter === "string" ? cs.chapter : cs.chapter.id, // ✅ extract id
            name: typeof cs.chapter === "object" ? cs.chapter.name : undefined,
          }))
        : [];

      setChapterSlots(normalizedChapterSlots);

      setSubmitAttempted(false);
    }
  }, [open, mode, initialData]);

  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    if (!subjectClassId || !subjectSyllabusId) {
      setSubjects([]);
      setSelectedSubjects([]);
      return;
    }

    getSubjectVariants({
      syllabusId: subjectSyllabusId,
      classId: subjectClassId,
    })
      .then((res) => {
        // ✅ res is ALREADY mapped
        setSubjects(
          res.map((v) => ({
            _id: v._id,
            name: v.subjectName,
          })),
        );
      })
      .catch(() => toast.error("Failed to load subjects"));
  }, [subjectSyllabusId, subjectClassId]);

  /* ---------------- FETCH CHAPTERS ---------------- */

  useEffect(() => {
    if (!syllabusId || !classId || !subjectId) {
      setChapters([]);
      return;
    }

    getChapters({ syllabusId, classId, subjectId, page: 1, limit: 100 })
      .then((res) => setChapters(res.rows))
      .catch(() => toast.error("Failed to load chapters"));
  }, [syllabusId, classId, subjectId]);
  /* ---------------- FETCH SUBJECTS (FOR SUBJECT SELECTION) ---------------- */

  // useEffect(() => {
  //   if (!subjectSyllabusId || !subjectClassId) {
  //     setSubjects([]);
  //     setSelectedSubjects([]);
  //     return;
  //   }

  //   getSubjects({
  //     syllabusId: subjectSyllabusId,
  //     classId: subjectClassId,
  //     page: 1,
  //     limit: 100,
  //   })
  //     .then((res) => setSubjects(res.rows))
  //     .catch(() => toast.error("Failed to load subjects"));
  // }, [subjectSyllabusId, subjectClassId]);
  /* ---------------- FETCH SUBJECTS (FOR CHAPTER SLOT FLOW) ---------------- */

  useEffect(() => {
    if (!chapterSyllabusId || !chapterClassId) {
      setChapters([]);
      return;
    }

    getChaptersList({
      syllabusId: chapterSyllabusId,
      classId: chapterClassId,
    })
      .then(setChapters)
      .catch(() => toast.error("Failed to load chapters"));
  }, [chapterSyllabusId, chapterClassId]);

  if (!open) return null;

  /* ---------------- IMAGE ---------------- */

  const handleImageSelect = (file: File) => {
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
    setIsNewImage(true);
    setCropOpen(true);
  };

  /* ---------------- SUBMIT ---------------- */
  const validateForm = () => {
    const errors: string[] = [];

    /* NAME */
    if (!name.trim()) {
      errors.push("Faculty name is required");
    }

    /* QUALIFICATIONS */
    const validQualifications = qualifications.filter(
      (q) => q && q.trim().length > 0,
    );

    if (validQualifications.length === 0) {
      errors.push("At least one qualification is required");
    }

    /* DESCRIPTION */
    if (!description.trim()) {
      errors.push("Description is required");
    } else if (description.trim().length < 10) {
      errors.push("Description must be at least 10 characters");
    }

    /* DEMO CLASS LINK */
    if (!demoClass.trim()) {
      errors.push("Demo class link is required");
    } else if (!isValidDemoClassLink(demoClass)) {
      errors.push("Demo class link must be a valid YouTube URL");
    }

    /* PRICE */
    if (price <= 0) {
      errors.push("Price must be greater than 0");
    }

    /* SUBJECTS */
    if (selectedSubjects.length === 0) {
      errors.push("Select at least one subject");
    }

    /* CHAPTER SLOTS */
    if (chapterSlots.length === 0) {
      errors.push("Add at least one chapter");
    }

    /* TIME SLOTS */
    if (slots.length === 0) {
      errors.push("At least one time slot is required");
    }

    /* IMAGE */
    if (mode === "create" && !image && !imageFile) {
      errors.push("Faculty image is required");
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (isSubmitting || uploading) return; // ✅ HARD STOP

    setSubmitAttempted(true);

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]); // UX-friendly
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImage: IconPayload;

      /* IMAGE */
      if (imageFile) {
        setUploading(true);

        finalImage = await uploadToCloudinary({
          file: imageFile,
          uploadPreset: "faculties",
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
          onProgress: setUploadProgress,
        });

        setUploading(false);
      } else {
        // safe because validation guarantees this
        finalImage = image!;
      }

      /* ✅ NORMALIZE CHAPTER SLOTS */
      const normalizedChapterSlots = chapterSlots.map((c) => ({
        chapter: c.chapter,
      }));

      const payload = {
        name: name.trim(),
        qualifications: qualifications.filter((q) => q.trim()),
        description: description.trim(),
        demoClass: demoClass.trim(),
        image: finalImage,
        price,
        subjects: selectedSubjects,
        slots,
        chapterSlots: normalizedChapterSlots, // ✅ FIX
      };

      if (mode === "create") {
        await onCreate(payload);
      } else {
        await onUpdate(initialData!._id, payload);
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    } finally {
      setUploading(false);
      setIsSubmitting(false);
    }
  };

  //logic helpers
  const isValidDemoClassLink = (url: string) =>
    /^(https?:\/\/)?(www\.)?(youtube\.com\/.+|youtu\.be\/.+)$/i.test(
      url.trim(),
    );

  const createNextSlot = (slots: SlotPayload[]) => {
    if (slots.length === 0) {
      const base = new Date();
      base.setMinutes(0, 0, 0);
      return { time: base.toISOString() };
    }

    const last = new Date(slots[slots.length - 1].time);
    last.setTime(last.getTime() + ONE_HOUR_MS);

    return { time: last.toISOString() };
  };

  const ONE_HOUR_MS = 60 * 60 * 1000;

  const isSlotValid = (
    slots: SlotPayload[],
    candidate: Date,
    ignoreIndex?: number,
  ) => {
    return !slots.some((s, idx) => {
      if (idx === ignoreIndex) return false;

      const existing = new Date(s.time).getTime();
      return Math.abs(existing - candidate.getTime()) < ONE_HOUR_MS;
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/30"
          onClick={!loading ? onClose : undefined}
        />

        <div className="relative w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-6">
            {mode === "create" ? "Create Faculty" : "Edit Faculty"}
          </h2>

          {/* BASIC INFO */}
          <div className="space-y-4">
            {/* FACULTY NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Faculty Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`
        w-full mt-1 px-3 py-2 text-sm border rounded
        focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30
        ${
          submitAttempted && !name.trim() ? "border-red-400" : "border-gray-300"
        }
      `}
                placeholder="Enter faculty name"
              />

              {submitAttempted && !name.trim() && (
                <p className="mt-1 text-xs text-red-500">
                  Faculty name is required
                </p>
              )}
            </div>
            {/* QUALIFICATIONS */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Qualifications
              </label>

              <div className="mt-2 space-y-2">
                {qualifications.map((q, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      value={q}
                      onChange={(e) => {
                        const next = [...qualifications];
                        next[idx] = e.target.value;
                        setQualifications(next);
                      }}
                      placeholder="e.g. MSc Physics"
                      className={`
            flex-1 px-3 py-2 text-sm border rounded
            focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30
            ${
              submitAttempted && !q.trim()
                ? "border-red-400"
                : "border-gray-300"
            }
          `}
                    />

                    {qualifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setQualifications((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="px-3 text-red-500 text-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setQualifications((prev) => [...prev, ""])}
                className="mt-2 text-sm text-[#DB313E] hover:underline"
              >
                + Add qualification
              </button>

              {submitAttempted &&
                qualifications.filter((q) => q.trim()).length === 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    At least one qualification is required
                  </p>
                )}
            </div>
            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Brief teaching experience, syllabus handled, etc."
                className={`
      w-full mt-1 px-3 py-2 text-sm border rounded resize-none
      focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30
      ${
        submitAttempted && description.trim().length < 10
          ? "border-red-400"
          : "border-gray-300"
      }
    `}
              />

              {submitAttempted && !description.trim() && (
                <p className="mt-1 text-xs text-red-500">
                  Description is required
                </p>
              )}

              {submitAttempted &&
                description.trim() &&
                description.trim().length < 10 && (
                  <p className="mt-1 text-xs text-red-500">
                    Description must be at least 10 characters
                  </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* DEMO CLASS URL */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Demo Class URL
                </label>

                <input
                  value={demoClass}
                  onChange={(e) => setDemoClass(e.target.value)}
                  className={`
      w-full mt-1 px-3 py-2 text-sm border rounded
      focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30
      ${
        submitAttempted &&
        (!demoClass.trim() || !isValidDemoClassLink(demoClass))
          ? "border-red-400"
          : "border-gray-300"
      }
    `}
                  placeholder="https://youtube.com/... or https://youtu.be/..."
                />

                {submitAttempted && !demoClass.trim() && (
                  <p className="mt-1 text-xs text-red-500">
                    Demo class link is required
                  </p>
                )}

                {submitAttempted &&
                  demoClass.trim() &&
                  !isValidDemoClassLink(demoClass) && (
                    <p className="mt-1 text-xs text-red-500">
                      Please enter a valid YouTube link
                    </p>
                  )}
              </div>

              {/* PRICE */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Price (₹)
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className={`
          w-full mt-1 px-3 py-2 text-sm border rounded
          focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30
          ${
            submitAttempted && price <= 0 ? "border-red-400" : "border-gray-300"
          }
        `}
                  placeholder="Enter price"
                />

                {submitAttempted && price <= 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    Price must be greater than 0
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SUBJECTS */}
          <div className="mt-6 space-y-3">
            <label className="text-sm font-medium">Subjects</label>

            {/* SUBJECT SYLLABUS */}
            <select
              value={subjectSyllabusId}
              onChange={(e) => {
                setSubjectSyllabusId(e.target.value);
                setSubjectClassId("");
                setSelectedSubjects([]);
              }}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select syllabus</option>
              {syllabuses.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* SUBJECT CLASS */}
            <select
              value={subjectClassId}
              disabled={!subjectSyllabusId}
              onChange={(e) => {
                setSubjectClassId(e.target.value);
                setSelectedSubjects([]);
              }}
              className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            >
              <option value="">
                {!subjectSyllabusId ? "Select syllabus first" : "Select class"}
              </option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* SUBJECT MULTI SELECT */}
            <select
              multiple
              disabled={!subjectSyllabusId || !subjectClassId}
              value={selectedSubjects}
              onChange={(e) =>
                setSelectedSubjects(
                  Array.from(e.target.selectedOptions).map((o) => o.value),
                )
              }
              className={`
    w-full h-32 px-3 py-2 text-sm border rounded
    focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30
    ${!subjectSyllabusId || !subjectClassId ? "bg-gray-100" : ""}
  `}
            >
              {!subjectSyllabusId || !subjectClassId ? (
                <option>Select syllabus & class first</option>
              ) : subjects.length === 0 ? (
                <option>No subjects found</option>
              ) : (
                subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))
              )}
            </select>
            <button onClick={() => console.log(chapterSlots)}>
              Get details
            </button>
            <p className="text-xs text-gray-500">
              Hold <kbd className="px-1 border rounded">Ctrl</kbd> /{" "}
              <kbd className="px-1 border rounded">Cmd</kbd> to select multiple
            </p>

            {submitAttempted && selectedSubjects.length === 0 && (
              <p className="text-xs text-red-500">
                Please select at least one subject
              </p>
            )}
          </div>
          {/* SELECTED SUBJECTS */}
          {selectedSubjects.length > 0 && (
            <div className="mt-3 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Selected Subjects
              </label>

              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((id) => {
                  const subject = subjects.find((s) => s._id === id);

                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-[#DB313E]/10 text-[#DB313E]"
                    >
                      {subject?.name ?? "Unknown"}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSubjects((prev) =>
                            prev.filter((x) => x !== id),
                          )
                        }
                        className="text-[#DB313E] hover:text-red-600"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* CHAPTER SLOTS */}
          {/* CHAPTER SLOTS */}
          <div className="mt-8 space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Chapter Slots
            </label>

            {/* SYLLABUS */}
            <select
              value={chapterSyllabusId}
              onChange={(e) => {
                setChapterSyllabusId(e.target.value);
                setChapterClassId("");
                setChapters([]);
                setChapterSlots([]);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
            >
              <option value="">Select syllabus</option>
              {syllabuses.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* CLASS */}
            <select
              value={chapterClassId}
              disabled={!chapterSyllabusId}
              onChange={(e) => {
                setChapterClassId(e.target.value);
                setChapterSlots([]);
              }}
              className={`w-full px-3 py-2 text-sm border rounded
      ${!chapterSyllabusId ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"}
    `}
            >
              <option value="">
                {!chapterSyllabusId ? "Select syllabus first" : "Select class"}
              </option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* CHAPTER SELECT (auto add) */}
            <select
              value={selectedChapter}
              disabled={!chapterSyllabusId || !chapterClassId}
              onChange={(e) => {
                const id = e.target.value;
                if (!id) return;

                if (chapterSlots.some((c) => c.chapter === id)) {
                  toast.error("Chapter already added");
                  return;
                }

                setChapterSlots((prev) => [...prev, { chapter: id }]);
                setSelectedChapter("");
              }}
              className={`w-full px-3 py-2 text-sm border rounded
      ${
        !chapterSyllabusId || !chapterClassId
          ? "bg-gray-100 cursor-not-allowed"
          : "border-gray-300"
      }
    `}
            >
              <option value="">
                {!chapterSyllabusId || !chapterClassId
                  ? "Select syllabus & class first"
                  : chapters.length === 0
                    ? "No chapters found"
                    : "Select chapter"}
              </option>

              {chapters.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {/* SELECTED CHAPTERS */}
            {chapterSlots.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Selected Chapters
                </label>

                <p className="text-xs text-gray-500">
                  These chapters will be assigned to this faculty
                </p>

                <div className="space-y-2">
                  {chapterSlots.map(({ chapter, name }) => {
                    const ch =
                      name ||
                      chapters.find((c) => c._id === chapter)?.name ||
                      "Unknown chapter";

                    return (
                      <div
                        key={chapter}
                        className="flex justify-between items-center px-3 py-2 border rounded bg-gray-50"
                      >
                        <span className="text-sm text-gray-800">{ch}</span>

                        <button
                          type="button"
                          onClick={() =>
                            setChapterSlots((prev) =>
                              prev.filter((x) => x.chapter !== chapter),
                            )
                          }
                          className="text-red-500 text-sm hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* TIME SLOTS */}
          <div className="mt-6 space-y-3">
            <label className="text-sm font-medium">Available Time Slots</label>

            {slots.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="time"
                  value={new Date(s.time).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(":").map(Number);

                    const candidate = new Date(s.time);
                    candidate.setHours(h, m, 0, 0);

                    if (!isSlotValid(slots, candidate, i)) {
                      toast.error("Slots must be at least 1 hour apart");
                      return;
                    }

                    const next = [...slots];
                    next[i] = { time: candidate.toISOString() };
                    setSlots(next);
                  }}
                  className="px-3 py-2 border rounded w-32"
                />

                <span className="text-sm text-gray-600">
                  {formatSlotLabel(s.time)}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const nextSlot = createNextSlot(slots);
                    const nextDate = new Date(nextSlot.time);

                    if (!isSlotValid(slots, nextDate)) {
                      toast.error("Next slot overlaps with existing slots");
                      return;
                    }

                    setSlots((prev) => [...prev, nextSlot]);
                  }}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* ADD NEW SLOT */}
            <button
              type="button"
              onClick={() =>
                setSlots((prev) => [...prev, createNextSlot(prev)])
              }
              className="inline-flex items-center gap-2 text-sm px-3 py-2 border rounded hover:bg-gray-50"
            >
              ➕ Add slot
            </button>
          </div>

          {/* FACULTY IMAGE */}
          <div className="mt-6">
            <label className="text-sm font-medium">Faculty Image</label>

            {imagePreview ? (
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={imagePreview}
                  alt="Faculty"
                  className="w-24 h-24 object-cover rounded border"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-xs border rounded hover:bg-gray-100"
                >
                  Change image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 px-4 py-2 border border-dashed rounded text-sm hover:bg-gray-50"
              >
                📷 Select image
              </button>
            )}

            {/* HIDDEN FILE INPUT */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />

            {submitAttempted && !image && !imageFile && mode === "create" && (
              <p className="text-xs text-red-500 mt-1">
                Faculty image is required
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="button" // ✅ THIS IS THE FIX
              disabled={uploading || isSubmitting}
              onClick={handleSubmit}
              className={`px-4 py-2 rounded text-white bg-[#DB313E]
    ${(uploading || isSubmitting) && "opacity-50 cursor-not-allowed"}`}
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create Faculty"
                  : "Update Faculty"}
            </button>
          </div>
        </div>
      </div>

      {cropOpen && imagePreview && isNewImage && (
        <ImageCropModal
          open={cropOpen}
          image={imagePreview}
          aspect={1}
          onClose={() => setCropOpen(false)}
          onCropComplete={(file) => {
            setImageFile(file);
            fileInputRef.current!.value = "";
            setImagePreview(URL.createObjectURL(file));
            setIsNewImage(false);
          }}
        />
      )}
    </>
  );
}
