import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { getSubjectVariants, getChaptersList } from "../../../api/chapter.api";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import {
  addFacultySlot,
  setFacultySlotAvailability,
  addFacultyChapterSlot,
  setFacultyChapterSlotAvailability,
  getFacultyById,
} from "../../../api/faculty.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";

/* ================================================================== */
/* TYPES                                                                */
/* ================================================================== */

type ImagePayload = { url: string; publicId: string };
type SubjectVariant = { _id: string; subjectName: string };

type SubjectGroup = {
  id: number;
  syllabusId: string;
  classId: string;
  variants: SubjectVariant[];
  selected: string[];           // variant IDs — used for API payload
  selectedVariants: SubjectVariant[]; // full objects — used for display (independent of variants loading)
};

// pool carries bookings — block is only allowed when pool is empty
type TimeSlot = { id?: string; time: string; pool?: any[]; isAvailable: boolean };
type ChapterSlot = { id?: string; chapter: string; label?: string; pool?: any[]; isAvailable: boolean };

export type FacultyModalData = {
  id: string;  // backend returns 'id', not '_id'
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  price: number;
  image?: string | { url: string; publicId: string } | null;
  subjectOffering?: {
    id: string;
    subject: { id: string; name: string };
    syllabus: { id: string; name: string };
    class: { id: string; name: string };
  }[];
  slots?: { id?: string; time: string; pool?: any[]; isAvailable?: boolean }[];
  chapterSlots?: { id?: string; chapter: string | { id: string; name: string }; pool?: any[]; isAvailable?: boolean }[];
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: FacultyModalData;
  /** Needed in edit mode so slot add/remove can call the API directly */
  facultyId?: string;
  syllabuses: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
};

let groupCounter = 0;

/* ================================================================== */
/* COMPONENT                                                            */
/* ================================================================== */

export default function FacultyModal({
  open,
  mode,
  initialData,
  facultyId,
  syllabuses,
  classes,
  saving,
  onClose,
  onSubmit,
}: Props) {
  /* ---------- Basic fields ---------- */
  const [name, setName] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [description, setDescription] = useState("");
  const [demoClass, setDemoClass] = useState("");
  const [price, setPrice] = useState<number | "">("");

  /* ---------- Image ---------- */
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePayload, setImagePayload] = useState<ImagePayload | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ---------- Subject groups ---------- */
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);

  /* ---------- Time slots ---------- */
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newTime, setNewTime] = useState("");
  const [slotWorking, setSlotWorking] = useState(false);

  /* ---------- Chapter slots ---------- */
  const [chapterSlots, setChapterSlots] = useState<ChapterSlot[]>([]);
  const [chapterSyllabusId, setChapterSyllabusId] = useState("");
  const [chapterClassId, setChapterClassId] = useState("");
  const [chapterOptions, setChapterOptions] = useState<{ _id: string; name: string }[]>([]);
  const [chapterId, setChapterId] = useState("");
  const [chapterWorking, setChapterWorking] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slotError, setSlotError] = useState("");
  const [chapterError, setChapterError] = useState("");

  /* ================================================================ */
  /* INIT on open                                                       */
  /* ================================================================ */

  useEffect(() => {
    if (!open) return;

    if (mode === "create" || !initialData) {
      setName("");
      setQualifications("");
      setDescription("");
      setDemoClass("");
      setPrice("");
      setImageUrl(null);
      setImageFile(null);
      setImagePayload(null);
      setSubjectGroups([makeEmptyGroup()]);
      setTimeSlots(
        Array.from({ length: 5 }, (_, i) => ({
          time: `${String(15 + i).padStart(2, "0")}:00`,
          isAvailable: true,
        }))
      );
      setNewTime("");
      setChapterSlots([]);
      setChapterSyllabusId("");
      setChapterClassId("");
      setChapterOptions([]);
      setChapterId("");
      setErrors({});
      return;
    }

    // ---- Edit mode (async so we can fetch variants in parallel) ----
    const init = async () => {
      setName(initialData.name ?? "");
      setQualifications((initialData.qualifications ?? []).join(", "));
      setDescription(initialData.description ?? "");
      setDemoClass(initialData.demoClass ?? "");
      setPrice(initialData.price ?? "");

      const initImageUrl = typeof initialData.image === "object" && initialData.image !== null 
        ? initialData.image.url 
        : (initialData.image as string);
        
      setImageUrl(initImageUrl ?? null);
      setImageFile(null);
      setImagePayload(
        initialData.image 
          ? (typeof initialData.image === "object" ? initialData.image : { url: initialData.image as string, publicId: "" }) 
          : null
      );

      // Time slots — load ALL, preserving isAvailable state
      setTimeSlots(
        (initialData.slots ?? []).map((s) => ({
          id: s.id,
          time: toHHMM(s.time),
          pool: s.pool ?? [],
          isAvailable: s.isAvailable !== false,
        }))
      );

      // Chapter slots — load ALL, preserving isAvailable state
      setChapterSlots(
        (initialData.chapterSlots ?? []).map((cs) => ({
          id: cs.id,
          chapter:
            typeof cs.chapter === "string" ? cs.chapter : (cs.chapter as any).id,
          label:
            typeof cs.chapter === "object" ? (cs.chapter as any).name : undefined,
          pool: (cs as any).pool ?? [],
          isAvailable: (cs as any).isAvailable !== false,
        }))
      );

      setChapterSyllabusId("");
      setChapterClassId("");
      setChapterOptions([]);
      setChapterId("");
      setErrors({});

      // Subject groups grouped by syllabus+class
      const offerings = initialData.subjectOffering ?? [];
      if (offerings.length === 0) {
        setSubjectGroups([makeEmptyGroup()]);
        return;
      }

      const map = new Map<string, SubjectGroup>();
      offerings.forEach((o) => {
        const key = `${o.syllabus.id}__${o.class.id}`;
        if (!map.has(key)) {
          map.set(key, {
            id: ++groupCounter,
            syllabusId: o.syllabus.id,
            classId: o.class.id,
            variants: [],
            selected: [],
            selectedVariants: [],
          });
        }
        // o.id IS the SubjectVariant's _id (backend maps so._id → o.id)
        map.get(key)!.selected.push(o.id);
        map.get(key)!.selectedVariants.push({ _id: o.id, subjectName: o.subject.name });
      });

      // Fetch variants for all groups in parallel
      const pendingGroups = Array.from(map.values());
      const groupsWithVariants = await Promise.all(
        pendingGroups.map(async (g) => {
          try {
            const raw = await getSubjectVariants({
              syllabusId: g.syllabusId,
              classId: g.classId,
            });
            const variants: SubjectVariant[] = raw.map((v: any) => ({
              _id: v._id,
              subjectName: v.subjectName,
            }));
            return { ...g, variants };
          } catch {
            return g;
          }
        })
      );

      setSubjectGroups(groupsWithVariants);
    };

    init();
  }, [open, mode, initialData]);

  /* ================================================================ */
  /* Chapter options loader                                             */
  /* ================================================================ */

  useEffect(() => {
    if (!chapterSyllabusId || !chapterClassId) {
      setChapterOptions([]);
      setChapterId("");
      return;
    }
    getChaptersList({ syllabusId: chapterSyllabusId, classId: chapterClassId })
      .then((items) =>
        setChapterOptions(items.map((c) => ({ _id: c._id, name: c.name })))
      )
      .catch(handleApiError);
  }, [chapterSyllabusId, chapterClassId]);

  if (!open) return null;

  /* ================================================================ */
  /* Subject group helpers                                              */
  /* ================================================================ */

  function makeEmptyGroup(): SubjectGroup {
    return { id: ++groupCounter, syllabusId: "", classId: "", variants: [], selected: [], selectedVariants: [] };
  }

  const addGroup = () => setSubjectGroups((prev) => [...prev, makeEmptyGroup()]);

  const removeGroup = (id: number) =>
    setSubjectGroups((prev) => prev.filter((g) => g.id !== id));

  const updateGroupField = async (
    id: number,
    field: "syllabusId" | "classId",
    value: string
  ) => {
    setSubjectGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              [field]: value,
              // When syllabus changes, also clear classId; always clear variants
              // so the available-subjects list refreshes for the new combo.
              // Do NOT wipe `selected` or `selectedVariants` — that would
              // erase the user's existing subject picks.
              ...(field === "syllabusId" ? { classId: "" } : {}),
              variants: [],
            }
          : g
      )
    );

    const group = subjectGroups.find((g) => g.id === id)!;
    const newSyllabusId = field === "syllabusId" ? value : group.syllabusId;
    const newClassId = field === "classId" ? value : group.classId;
    if (newSyllabusId && newClassId) {
      try {
        const raw = await getSubjectVariants({
          syllabusId: newSyllabusId,
          classId: newClassId,
        });
        const variants: SubjectVariant[] = raw.map((v: any) => ({
          _id: v._id,
          subjectName: v.subjectName,
        }));
        setSubjectGroups((prev) =>
          prev.map((g) => (g.id === id ? { ...g, variants } : g))
        );
      } catch (err) {
        handleApiError(err);
      }
    }
  };

  const toggleVariant = (groupId: number, variantId: string) => {
    setSubjectGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const isSelected = g.selected.includes(variantId);
        const variant = g.variants.find((v) => v._id === variantId);
        return {
          ...g,
          selected: isSelected
            ? g.selected.filter((v) => v !== variantId)
            : [...g.selected, variantId],
          selectedVariants: isSelected
            ? g.selectedVariants.filter((v) => v._id !== variantId)
            : [...g.selectedVariants, ...(variant ? [variant] : [])],
        };
      })
    );
  };

  /* ================================================================ */
  /* TIME SLOT helpers                                                  */
  /* ================================================================ */

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  /** Convert any time value the API may return to "HH:MM" for display & toMinutes() */
  const toHHMM = (raw: string): string => {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
    // Already "HH:MM" or similar — return as-is
    return raw;
  };

  const handleAddTimeSlot = async () => {
    if (!newTime) {
      setSlotError("Pick a time first");
      return;
    }
    if (timeSlots.some((s) => s.time === newTime)) {
      setSlotError("This slot is already added");
      return;
    }
    const mins = toMinutes(newTime);
    const overlap = timeSlots.find(
      (s) => Math.abs(toMinutes(s.time) - mins) < 60
    );
    if (overlap) {
      setSlotError(`Overlaps with ${overlap.time} — slots must be at least 1 hour apart`);
      return;
    }
    setSlotError("");

    if (mode === "edit" && facultyId) {
      try {
        setSlotWorking(true);
        await addFacultySlot(facultyId, { time: newTime });
        // Backend returns no slot ID — re-fetch to get fresh slots with real IDs
        const updated = await getFacultyById(facultyId);
        setTimeSlots(
          (updated.slots ?? []).map((s: any) => ({
            id: s.id,
            time: toHHMM(s.time),
            pool: s.pool ?? [],
            isAvailable: s.isAvailable !== false,
          }))
        );
        toast.success("Slot added");
        setNewTime("");
      } catch (err) {
        handleApiError(err);
      } finally {
        setSlotWorking(false);
      }
    } else {
      setTimeSlots((prev) =>
        [...prev, { time: newTime, isAvailable: true }].sort(
          (a, b) => toMinutes(a.time) - toMinutes(b.time)
        )
      );
      setNewTime("");
    }
  };

  // Block a time slot (sets isAvailable = false via API in edit mode)
  const handleBlockTimeSlot = async (slot: TimeSlot) => {
    if (mode === "edit" && facultyId && slot.id) {
      try {
        setSlotWorking(true);
        await setFacultySlotAvailability(facultyId, slot.id, false);
        setTimeSlots((prev) =>
          prev.map((s) => (s.id === slot.id ? { ...s, isAvailable: false } : s))
        );
        toast.success("Slot blocked");
      } catch (err) {
        handleApiError(err);
      } finally {
        setSlotWorking(false);
      }
    } else {
      // In create mode just remove it from the list
      setTimeSlots((prev) => prev.filter((s) => s.time !== slot.time));
    }
  };

  // Unblock a time slot (sets isAvailable = true via API)
  const handleUnblockTimeSlot = async (slot: TimeSlot) => {
    if (!facultyId || !slot.id) return;
    try {
      setSlotWorking(true);
      await setFacultySlotAvailability(facultyId, slot.id, true);
      setTimeSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, isAvailable: true } : s))
      );
      toast.success("Slot unblocked");
    } catch (err) {
      handleApiError(err);
    } finally {
      setSlotWorking(false);
    }
  };

  /* ================================================================ */
  /* CHAPTER SLOT helpers                                               */
  /* ================================================================ */

  const handleAddChapterSlot = async () => {
    if (!chapterId) {
      setChapterError("Select a chapter first");
      return;
    }
    if (chapterSlots.some((c) => c.chapter === chapterId)) {
      setChapterError("This chapter is already added");
      return;
    }
    setChapterError("");

    const label = chapterOptions.find((c) => c._id === chapterId)?.name;

    if (mode === "edit" && facultyId) {
      try {
        setChapterWorking(true);
        await addFacultyChapterSlot(facultyId, { chapter: chapterId });
        // Backend returns no slot ID — re-fetch to get fresh chapter slots with real IDs
        const updated = await getFacultyById(facultyId);
        setChapterSlots(
          (updated.chapterSlots ?? []).map((cs: any) => ({
            id: cs.id,
            chapter: typeof cs.chapter === "string" ? cs.chapter : cs.chapter?.id,
            label: typeof cs.chapter === "object" ? cs.chapter?.name : undefined,
            pool: cs.pool ?? [],
            isAvailable: cs.isAvailable !== false,
          }))
        );
        toast.success("Chapter added");
        setChapterId("");
      } catch (err) {
        handleApiError(err);
      } finally {
        setChapterWorking(false);
      }
    } else {
      setChapterSlots((prev) => [...prev, { chapter: chapterId, label, isAvailable: true }]);
      setChapterId("");
    }
  };

  // Block a chapter slot
  const handleBlockChapterSlot = async (cs: ChapterSlot) => {
    if (mode === "edit" && facultyId && cs.chapter) {
      try {
        setChapterWorking(true);
        await setFacultyChapterSlotAvailability(facultyId, cs.chapter, false);
        setChapterSlots((prev) =>
          prev.map((c) => (c.chapter === cs.chapter ? { ...c, isAvailable: false } : c))
        );
        toast.success("Chapter slot blocked");
      } catch (err) {
        handleApiError(err);
      } finally {
        setChapterWorking(false);
      }
    } else {
      setChapterSlots((prev) => prev.filter((c) => c.chapter !== cs.chapter));
    }
  };

  // Unblock a chapter slot
  const handleUnblockChapterSlot = async (cs: ChapterSlot) => {
    if (!facultyId || !cs.chapter) return;
    try {
      setChapterWorking(true);
      await setFacultyChapterSlotAvailability(facultyId, cs.chapter, true);
      setChapterSlots((prev) =>
        prev.map((c) => (c.chapter === cs.chapter ? { ...c, isAvailable: true } : c))
      );
      toast.success("Chapter slot unblocked");
    } catch (err) {
      handleApiError(err);
    } finally {
      setChapterWorking(false);
    }
  };

  /* ================================================================ */
  /* VALIDATION                                                         */
  /* ================================================================ */

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) {
      e.name = "Name is required";
    } else if (name.trim().length < 2) {
      e.name = "Name must be at least 2 characters";
    } else if (name.trim().length > 100) {
      e.name = "Name must be under 100 characters";
    }
    if (!qualifications.trim()) {
      e.qualifications = "At least one qualification required";
    } else if (qualifications.trim().length > 300) {
      e.qualifications = "Qualifications must be under 300 characters";
    }
    if (!description.trim() || description.trim().length < 10) {
      e.description = "Description must be at least 10 characters";
    } else if (description.trim().length > 1000) {
      e.description = "Description must be under 1000 characters";
    }
    if (!demoClass.trim()) {
      e.demoClass = "Demo class URL is required";
    } else {
      try { new URL(demoClass.trim()); } catch {
        e.demoClass = "Must be a valid URL (starting with https://)";
      }
    }
    if (!price || Number(price) <= 0) {
      e.price = "Price must be greater than 0";
    } else if (Number(price) > 999999) {
      e.price = "Price must be under ₹9,99,999";
    }
    if (mode === "create" && !imageFile && !imagePayload)
      e.image = "Image is required";
    const allSelected = subjectGroups.flatMap((g) => g.selected);
    if (allSelected.length === 0)
      e.subjects = "Select at least one subject variant";
    if (mode === "create" && timeSlots.length === 0)
      e.slots = "Add at least one time slot";
    if (mode === "create" && chapterSlots.length === 0)
      e.chapters = "Add at least one chapter";
    return e;
  };

  const clearFieldError = (field: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  /* ================================================================ */
  /* SUBMIT                                                             */
  /* ================================================================ */

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error(Object.values(errs)[0]);
      return;
    }

    try {
      let finalImage = imagePayload;
      if (imageFile) {
        setUploading(true);
        finalImage = await uploadToCloudinary({
          file: imageFile,
          uploadPreset: "faculties",
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
        });
        setUploading(false);
      }

      const slotsPayload = timeSlots.map(({ time }) => {
        const [h, m] = time.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return { time: d.toISOString() };
      });

      const payload: any = {
        name: name.trim(),
        qualifications: qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean),
        description: description.trim(),
        demoClass: demoClass.trim(),
        price: Number(price),
        subjects: subjectGroups.flatMap((g) => g.selected),
      };

      // Only include image when the user actually picked a new file.
      // imagePayload is already set from initialData in edit mode (for display),
      // so finalImage alone is always truthy — imageFile is the real new-image signal.
      if (imageFile && finalImage) {
        payload.image = finalImage;
      }

      // Slots/chapters only bundled in CREATE — edit handles them via immediate APIs
      if (mode === "create") {
        payload.slots = slotsPayload;
        payload.chapterSlots = chapterSlots.map((c) => ({ chapter: c.chapter }));
      }

      await onSubmit(payload);
    } catch {
      setUploading(false);
    }
  };

  const isLoading = saving || uploading || slotWorking || chapterWorking;

  /* ================================================================ */
  /* RENDER                                                             */
  /* ================================================================ */

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={!isLoading ? onClose : undefined}
        />

        <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              {mode === "create" ? "Create Faculty" : "Edit Faculty"}
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
              {errors.subjects && (
                <p className="text-xs text-red-500 mb-2">{errors.subjects}</p>
              )}
              <div className="space-y-4">
                {subjectGroups.map((group, idx) => {
                  // selectedVariants always holds full objects — no dependency on variants loading
                  const selected = group.selectedVariants;
                  const available = group.variants.filter(
                    (v) => !group.selected.includes(v._id)
                  );

                  return (
                    <div
                      key={group.id}
                      className="border border-gray-200 rounded-lg p-3 space-y-3 bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                          Group {idx + 1}
                        </span>
                        {subjectGroups.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGroup(group.id)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={group.syllabusId}
                          onChange={(e) =>
                            updateGroupField(group.id, "syllabusId", e.target.value)
                          }
                          className={sel()}
                        >
                          <option value="">Syllabus</option>
                          {syllabuses.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name}
                            </option>
                          ))}
                        </select>

                        <select
                          value={group.classId}
                          disabled={!group.syllabusId}
                          onChange={(e) =>
                            updateGroupField(group.id, "classId", e.target.value)
                          }
                          className={
                            sel() + (!group.syllabusId ? " bg-gray-100" : "")
                          }
                        >
                          <option value="">
                            {group.syllabusId
                              ? "Class"
                              : "Select syllabus first"}
                          </option>
                          {classes.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Selected subjects — with explicit × remove buttn */}
                      {selected.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Selected</p>
                          <div className="flex flex-wrap gap-2">
                            {selected.map((v) => (
                              <span
                                key={v._id}
                                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-[#DB313E] text-white"
                              >
                                {v.subjectName}
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleVariant(group.id, v._id)
                                  }
                                  className="ml-1 hover:opacity-75"
                                  title="Remove"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Available subjects — muted clickable pills */}
                      {available.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            {selected.length > 0 ? "Add more" : "Select subjects"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {available.map((v) => (
                              <button
                                key={v._id}
                                type="button"
                                onClick={() => toggleVariant(group.id, v._id)}
                                className="px-3 py-1 text-xs rounded-full border border-gray-300 bg-white text-gray-700 hover:border-[#DB313E] hover:text-[#DB313E] transition-colors"
                              >
                                + {v.subjectName}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {group.syllabusId &&
                        group.classId &&
                        group.variants.length === 0 && (
                          <p className="text-xs text-gray-400">
                            No subjects found for this combination.
                          </p>
                        )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={addGroup}
                className="mt-3 text-sm text-[#DB313E] hover:underline"
              >
                + Add another syllabus / class
              </button>
            </Section>

            {/* ── Time Slots ── */}
            <Section title="Time Slots">
              {errors.slots && (
                <p className="text-xs text-red-500 mb-2">{errors.slots}</p>
              )}

              <div className="flex gap-2">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => { setNewTime(e.target.value); setSlotError(""); }}
                  className={inp(!!slotError) + " flex-1"}
                />
                <button
                  type="button"
                  onClick={handleAddTimeSlot}
                  disabled={slotWorking}
                  className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  {slotWorking ? "…" : "+ Add"}
                </button>
              </div>
              {slotError && (
                <p className="text-xs text-red-500 mt-0.5">{slotError}</p>
              )}

              {/* Active */}
              {timeSlots.some((s) => s.isAvailable) && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Active</p>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots
                      .filter((s) => s.isAvailable)
                      .map((s) => (
                        <span
                          key={s.id ?? s.time}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 border border-blue-200 rounded-full text-blue-700"
                        >
                          {s.time}
                          {(!s.pool || s.pool.length === 0) && (
                            <button
                              type="button"
                              onClick={() => handleBlockTimeSlot(s)}
                              disabled={slotWorking}
                              title="Block slot"
                              className="ml-1 text-blue-400 hover:text-red-500 disabled:opacity-50"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Blocked */}
              {timeSlots.some((s) => !s.isAvailable) && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Blocked</p>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots
                      .filter((s) => !s.isAvailable)
                      .map((s) => (
                        <span
                          key={s.id ?? s.time}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-50 border border-gray-300 rounded-full text-gray-400"
                        >
                          {s.time}
                          <button
                            type="button"
                            onClick={() => handleUnblockTimeSlot(s)}
                            disabled={slotWorking}
                            className="ml-1 text-xs text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                          >
                            Unblock
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </Section>

            {/* ── Chapter Slots ── */}
            <Section title="Chapter Slots">
              {errors.chapters && (
                <p className="text-xs text-red-500 mb-2">{errors.chapters}</p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={chapterSyllabusId}
                  onChange={(e) => {
                    setChapterSyllabusId(e.target.value);
                    setChapterClassId("");
                  }}
                  className={sel()}
                >
                  <option value="">Syllabus</option>
                  {syllabuses.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={chapterClassId}
                  disabled={!chapterSyllabusId}
                  onChange={(e) => setChapterClassId(e.target.value)}
                  className={sel() + (!chapterSyllabusId ? " bg-gray-100" : "")}
                >
                  <option value="">
                    {chapterSyllabusId ? "Class" : "Select syllabus first"}
                  </option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {chapterOptions.length > 0 && (
                <div className="flex gap-2 mt-2">
                  <select
                    value={chapterId}
                    onChange={(e) => { setChapterId(e.target.value); setChapterError(""); }}
                    className={sel() + " flex-1"}
                  >
                    <option value="">Select chapter</option>
                    {chapterOptions.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddChapterSlot}
                    disabled={chapterWorking}
                    className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    {chapterWorking ? "…" : "+ Add"}
                  </button>
                </div>
              )}
              {chapterError && (
                <p className="text-xs text-red-500 mt-0.5">{chapterError}</p>
              )}

              {/* Active chapter slots */}
              {chapterSlots.some((cs) => cs.isAvailable) && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Active</p>
                  <div className="flex flex-wrap gap-2">
                    {chapterSlots
                      .filter((cs) => cs.isAvailable)
                      .map((cs) => (
                        <span
                          key={cs.id ?? cs.chapter}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 border border-green-200 rounded-full text-green-700"
                        >
                          {cs.label ?? cs.chapter}
                          {(!cs.pool || cs.pool.length === 0) && (
                            <button
                              type="button"
                              onClick={() => handleBlockChapterSlot(cs)}
                              disabled={chapterWorking}
                              title="Block chapter slot"
                              className="ml-1 text-green-400 hover:text-red-500 disabled:opacity-50"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Blocked chapter slots */}
              {chapterSlots.some((cs) => !cs.isAvailable) && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Blocked</p>
                  <div className="flex flex-wrap gap-2">
                    {chapterSlots
                      .filter((cs) => !cs.isAvailable)
                      .map((cs) => (
                        <span
                          key={cs.id ?? cs.chapter}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-50 border border-gray-300 rounded-full text-gray-400"
                        >
                          {cs.label ?? cs.chapter}
                          <button
                            type="button"
                            onClick={() => handleUnblockChapterSlot(cs)}
                            disabled={chapterWorking}
                            className="ml-1 text-xs text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                          >
                            Unblock
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </Section>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-[#DB313E] text-white rounded hover:bg-[#c02b37] disabled:opacity-50"
            >
              {uploading
                ? "Uploading…"
                : saving
                ? "Saving…"
                : mode === "create"
                ? "Create Faculty"
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

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
    </>
  );
}

/* ================================================================== */
/* SMALL HELPERS                                                        */
/* ================================================================== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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

const inp = (hasError: boolean) =>
  `w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 ${
    hasError ? "border-red-400" : "border-gray-300"
  }`;

const sel = () =>
  "w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30";
