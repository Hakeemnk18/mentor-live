import { useEffect, useRef, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import TimeInput from "../../../shared/components/TimeInput";
import { formatTimeAMPM } from "../../../shared/utils/time.utils";
import ImageCropModal from "../../../shared/components/ImageCropModal/ImageCropModal";
import { getSubjectVariants, getChaptersList } from "../../../api/chapter.api";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import {
  addFacultySlotIST,
  setFacultySlotAvailability,
  addFacultyChapterSlot,
  setFacultyChapterSlotAvailability,
  getFacultyById,
} from "../../../api/faculty.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { ImagePayload, SubjectGroup, SubjectVariant, FacultyModalData, FacultyData, SubjectSlotGroup } from "../../../shared/types/faculty.types";
/* ================================================================== */
/* TYPES                                                                */
/* ================================================================== */

type SlotState = {
  id?: string;
  /** variantId this slot belongs to */
  variantId?: string;
  time: string;
  isAvailable: boolean;
  pool?: unknown[];
};

/**
 * CREATE-mode only: one row per time, with a set of variant IDs
 * indicating which subjects this time slot applies to.
 */
type TimeRow = {
  time: string;         // HH:mm
  variantIds: string[]; // checked variants for this time
};

const DEFAULT_SLOT_TIMES: string[] = ["15:00", "16:00", "17:00", "18:00", "19:00"];

type ChapterSlotState = {
  id?: string;
  chapter: string;
  label?: string;
  isAvailable: boolean;
  pool?: unknown[];
};

export type FacultySubmitPayload = {
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  isFeatured?: boolean;
  subjects: { variantId: string; price: number }[];
  image?: ImagePayload;
  /** Per-variant slot groups — replaces the old flat slots[] */
  subjectSlots?: SubjectSlotGroup[];
  chapterSlots?: { chapter: string }[];
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
  onSubmit: (payload: FacultySubmitPayload) => Promise<void>;
};

let groupCounter = 0;
// eslint-disable-next-line react-refresh/only-export-components
export const timeStringToISOSlot = (time: string): { time: string } => {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  const localIsoDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return { time: localIsoDate.toISOString() };
};
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const value = `${String(h).padStart(2, "0")}:${m}`;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return { value, label: `${h12}:${m} ${period}` };
});

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
  const [isFeatured, setIsFeatured] = useState(false);

  /* ---------- Image ---------- */
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePayload, setImagePayload] = useState<ImagePayload | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ---------- Subject groups ---------- */
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);

  /* ---------- Time slots (EDIT mode) ---------- */
  const [timeSlots, setTimeSlots] = useState<SlotState[]>([]);
  const [newTime, setNewTime] = useState("");
  const [newSlotVariantId, setNewSlotVariantId] = useState("");
  const [slotWorking, setSlotWorking] = useState(false);

  /* ---------- Time rows (CREATE mode only) ---------- */
  const [timeRows, setTimeRows] = useState<TimeRow[]>(
    DEFAULT_SLOT_TIMES.map((t) => ({ time: t, variantIds: [] }))
  );
  const [newRowTime, setNewRowTime] = useState("");
  const [newRowTimeKey, setNewRowTimeKey] = useState(0);

  /* ---------- Chapter slots ---------- */
  const [chapterSlots, setChapterSlots] = useState<ChapterSlotState[]>([]);
  const [chapterSyllabusId, setChapterSyllabusId] = useState("");
  const [chapterClassId, setChapterClassId] = useState("");
  const [chapterOptions, setChapterOptions] = useState<{ _id: string; name: string }[]>([]);
  const [chapterOptionsLoaded, setChapterOptionsLoaded] = useState(false);
  const [chapterId, setChapterId] = useState("");
  const [chapterWorking, setChapterWorking] = useState(false);
  const chapterDropdownRef = useRef<HTMLDivElement>(null);
  const chapterNoResultsRef = useRef<HTMLParagraphElement>(null);

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
      setImageUrl(null);
      setImageFile(null);
      setImagePayload(null);
      setSubjectGroups([makeEmptyGroup()]);
      setTimeRows(DEFAULT_SLOT_TIMES.map((t) => ({ time: t, variantIds: [] })));
      setNewRowTime("");
      setTimeSlots([]);
      setNewTime("");
      setNewSlotVariantId("");
      setChapterSlots([]);
      setChapterSyllabusId("");
      setChapterClassId("");
      setChapterOptions([]);
      setChapterOptionsLoaded(false);
      setChapterId("");
      setChapterError("");
      setErrors({});
      return;
    }

    // ---- Edit mode (async so we can fetch variants in parallel) ----
    const init = async () => {
      setName(initialData.name ?? "");
      setQualifications((initialData.qualifications ?? []).join(", "));
      setDescription(initialData.description ?? "");
      setDemoClass(initialData.demoClass ?? "");
      setIsFeatured(initialData.isFeatured ?? false);

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

      // Time slots — load ALL, preserving isAvailable + variantId
      setTimeSlots(
        (initialData.slots ?? []).map((s) => ({
          id: s.id,
          variantId: s.variantId,
          time: toHHMM(s.time),
          pool: s.pool ?? [],
          isAvailable: s.isAvailable !== false,
        }))
      );
      setNewSlotVariantId("");

      // Chapter slots " load ALL, preserving isAvailable state
      setChapterSlots(
        (initialData.chapterSlots ?? []).map((cs) => ({
          id: cs.id,
          chapter:
            typeof cs.chapter === "string" ? cs.chapter : cs.chapter.id,
          label:
            typeof cs.chapter === "object" ? cs.chapter.name : undefined,
          pool: cs.pool ?? [],
          isAvailable: cs.isAvailable !== false,
        }))
      );

      setChapterSyllabusId("");
      setChapterClassId("");
      setChapterOptions([]);
      setChapterOptionsLoaded(false);
      setChapterId("");
      setChapterError("");
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
            prices: {},
            slotTimes: {},
          });
        }
        // o.id IS the SubjectVariant's _id (backend maps so._id → o.id)
        map.get(key)!.selected.push(o.id);
        map.get(key)!.selectedVariants.push({ _id: o.id, subjectName: o.subject.name });
        map.get(key)!.prices[o.id] = o.price ?? 0;
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
            const variants: SubjectVariant[] = raw.map((v) => ({
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
      setChapterOptionsLoaded(false);
      setChapterId("");
      return;
    }
    setChapterOptionsLoaded(false);
    getChaptersList({ syllabusId: chapterSyllabusId, classId: chapterClassId })
      .then((items) => {
        setChapterOptions(items.map((c) => ({ _id: c._id, name: c.name })));
        setChapterOptionsLoaded(true);
      })
      .catch(handleApiError);
  }, [chapterSyllabusId, chapterClassId]);

  // Scroll the chapter dropdown (or the "no chapters found" alert) into view once it appears
  useEffect(() => {
    if (chapterOptionsLoaded) {
      const target = chapterOptions.length > 0 ? chapterDropdownRef.current : chapterNoResultsRef.current;
      target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [chapterOptionsLoaded, chapterOptions]);

  if (!open) return null;

  /* ================================================================ */
  /* Subject group helpers                                              */
  /* ================================================================ */

  function makeEmptyGroup(): SubjectGroup {
    return { id: ++groupCounter, syllabusId: "", classId: "", variants: [], selected: [], selectedVariants: [], prices: {}, slotTimes: {} };
  }

  const addGroup = () => setSubjectGroups((prev) => [...prev, makeEmptyGroup()]);

  const removeGroup = (id: number) =>
    setSubjectGroups((prev) => prev.filter((g) => g.id !== id));

  const updateGroupField = async (
    id: number,
    field: "syllabusId" | "classId",
    value: string
  ) => {
    const group = subjectGroups.find((g) => g.id === id)!;
    const newSyllabusId = field === "syllabusId" ? value : group.syllabusId;
    const newClassId = field === "classId" ? value : group.classId;

    // Block picking a syllabus + class combination that another group already uses
    if (newSyllabusId && newClassId) {
      const duplicate = subjectGroups.some(
        (g) =>
          g.id !== id &&
          g.syllabusId === newSyllabusId &&
          g.classId === newClassId
      );
      if (duplicate) {
        toast.error("This syllabus & class combination is already added in another group");
        return;
      }
    }

    setSubjectGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              [field]: value,
              // When syllabus changes, also clear classId; always clear variants
              // so the available-subjects list refreshes for the new combo.
              // Do NOT wipe `selected` or `selectedVariants` â€" that would
              // erase the user's existing subject picks.
              ...(field === "syllabusId" ? { classId: "" } : {}),
              variants: [],
            }
          : g
      )
    );

    if (newSyllabusId && newClassId) {
      try {
        const raw = await getSubjectVariants({
          syllabusId: newSyllabusId,
          classId: newClassId,
        });
        const variants: SubjectVariant[] = raw.map((v) => ({
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
        const newPrices = { ...g.prices };
        if (isSelected) {
          delete newPrices[variantId];
        } else {
          newPrices[variantId] = 0;
        }
        return {
          ...g,
          selected: isSelected
            ? g.selected.filter((v) => v !== variantId)
            : [...g.selected, variantId],
          selectedVariants: isSelected
            ? g.selectedVariants.filter((v) => v._id !== variantId)
            : [...g.selectedVariants, ...(variant ? [variant] : [])],
          prices: newPrices,
        };
      })
    );
  };

  const updateVariantPrice = (groupId: number, variantId: string, price: number) => {
    setSubjectGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, prices: { ...g.prices, [variantId]: price } }
          : g
      )
    );
  };

  /* ================================================================ */
  /* TIME SLOT helpers                                                  */
  /* ================================================================ */

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
// utils/time.helper.ts
 
  /** Convert any time value the API may return to "HH:MM" for display & toMinutes() */
  const toHHMM = (raw: string): string => {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      // Slot times are stored as UTC digits representing the intended
      // IST wall-clock time, so read them back via UTC getters
      return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
    }
    // Already "HH:MM" or similar â€" return as-is
    return raw;
  };

  /* ================================================================ */
  /* CREATE-MODE time row handlers                                     */
  /* ================================================================ */

  const handleAddTimeRow = () => {
    if (!newRowTime) { setSlotError("Pick a time first"); return; }
    if (timeRows.some((r) => r.time === newRowTime)) {
      setSlotError("This time is already in the list"); return;
    }
    const mins = toMinutes(newRowTime);
    const overlap = timeRows.find((r) => Math.abs(toMinutes(r.time) - mins) < 60);
    if (overlap) {
      setSlotError(`Overlaps with ${formatTimeAMPM(overlap.time)} — slots must be 1 hr apart`);
      return;
    }
    setSlotError("");
    setTimeRows((prev) =>
      [...prev, { time: newRowTime, variantIds: [] }].sort(
        (a, b) => toMinutes(a.time) - toMinutes(b.time)
      )
    );
    setNewRowTime("");
    setNewRowTimeKey((k) => k + 1);
  };

  const handleRemoveTimeRow = (time: string) => {
    setTimeRows((prev) => prev.filter((r) => r.time !== time));
  };

  const handleToggleVariantInRow = (time: string, variantId: string) => {
    setTimeRows((prev) =>
      prev.map((r) => {
        if (r.time !== time) return r;
        const has = r.variantIds.includes(variantId);
        return {
          ...r,
          variantIds: has
            ? r.variantIds.filter((v) => v !== variantId)
            : [...r.variantIds, variantId],
        };
      })
    );
  };

  const handleSetAllRowsVariants = (variantIds: string[]) => {
    setTimeRows((prev) => prev.map((r) => ({ ...r, variantIds: [...variantIds] })));
  };

  /* ================================================================ */
  /* EDIT-MODE add-slot handler                                        */
  /* ================================================================ */

  const handleAddTimeSlot = async () => {
    if (!newSlotVariantId) {
      setSlotError("Select a subject variant first");
      return;
    }
    if (!newTime) {
      setSlotError("Pick a time");
      return;
    }
    // Duplicate: same variant + same time
    if (timeSlots.some((s) => s.variantId === newSlotVariantId && s.time === newTime)) {
      setSlotError("This slot already exists for the selected subject");
      return;
    }
    // 1-hour gap check within the same variant
    const mins = toMinutes(newTime);
    const overlap = timeSlots.find(
      (s) => s.variantId === newSlotVariantId && Math.abs(toMinutes(s.time) - mins) < 60
    );
    if (overlap) {
      setSlotError(`Overlaps with ${formatTimeAMPM(overlap.time)} for this subject — slots must be 1 hr apart`);
      return;
    }
    setSlotError("");

    if (mode === "edit" && facultyId) {
      try {
        setSlotWorking(true);
        await addFacultySlotIST(facultyId, { time: newTime, variantId: newSlotVariantId });
        // Re-fetch to get the new slot's real _id from the DB
        const updated = await getFacultyById(facultyId) as FacultyData;
        setTimeSlots(
          (updated.slots ?? []).map((s) => ({
            id: s.id,
            variantId: s.variantId,
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
        [...prev, { variantId: newSlotVariantId, time: newTime, isAvailable: true }].sort(
          (a, b) => toMinutes(a.time) - toMinutes(b.time)
        )
      );
      setNewTime("");
    }
  };

  // Block a time slot (sets isAvailable = false via API in edit mode)
  const handleBlockTimeSlot = async (slot: SlotState) => {
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
  const handleUnblockTimeSlot = async (slot: SlotState) => {
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
        // Backend returns no slot ID â€" re-fetch to get fresh chapter slots with real IDs
        const updated = await getFacultyById(facultyId) as FacultyData;
        setChapterSlots(
          (updated.chapterSlots ?? []).map((cs) => ({
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
  const handleBlockChapterSlot = async (cs: ChapterSlotState) => {
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
  const handleUnblockChapterSlot = async (cs: ChapterSlotState) => {
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
    if (mode === "create" && !imageFile && !imagePayload)
      e.image = "Image is required";
    const allSelected = subjectGroups.flatMap((g) => g.selected);
    if (allSelected.length === 0) {
      e.subjects = "Select at least one subject variant";
    } else {
      const missingPrice = subjectGroups.some((g) =>
        g.selected.some((id) => !g.prices[id] || g.prices[id] <= 0)
      );
      if (missingPrice) e.subjects = "Enter a price > 0 for every selected subject";
    }
    if (mode === "create") {
      const allVariants = subjectGroups.flatMap((g) => g.selected);
      if (timeRows.length === 0) {
        e.slots = "Add at least one time slot";
      } else if (allVariants.length > 0) {
        // Every selected variant must appear in at least one row
        const covered = new Set(timeRows.flatMap((r) => r.variantIds));
        const missing = allVariants.filter((v) => !covered.has(v));
        if (missing.length > 0) {
          e.slots = "Assign each subject to at least one time slot";
        }
      }
    }
    // if (mode === "create" && chapterSlots.length === 0)
    //   e.chapters = "Add at least one chapter";
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
      toast.error("Please check highlighted fields");
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

      const payload: FacultySubmitPayload = {
        name: name.trim(),
        qualifications: qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean),
        description: description.trim(),
        demoClass: demoClass.trim(),
        isFeatured,
        subjects: subjectGroups.flatMap((g) =>
          g.selected.map((variantId) => ({
            variantId,
            price: g.prices[variantId] ?? 0,
          }))
        ),
      };

      // Only include image when the user actually picked a new file.
      if (imageFile && finalImage) {
        payload.image = finalImage;
      }

      // Slots/chapters only bundled in CREATE — edit handles them via immediate APIs
      if (mode === "create") {
        /*
         * Transform timeRows → subjectSlots[]:
         *   Input:  [{ time:"15:00", variantIds:["english","physics"] }, ...]
         *   Output: [{ variantId:"english", times:[{time:ISO},...] }, ...]
         */
        const slotsByVariant = new Map<string, { time: string }[]>();
        for (const row of timeRows) {
          for (const vid of row.variantIds) {
            if (!slotsByVariant.has(vid)) slotsByVariant.set(vid, []);
            slotsByVariant.get(vid)!.push(timeStringToISOSlot(row.time));
          }
        }
        payload.subjectSlots = Array.from(slotsByVariant.entries()).map(
          ([variantId, times]) => ({ variantId, times })
        );
        payload.chapterSlots = chapterSlots.map((c) => ({ chapter: c.chapter }));
      }

      await onSubmit(payload);
    } catch {
      setUploading(false);
    }
  };

  const isLoading = saving || uploading || slotWorking || chapterWorking;

  // Variants already picked in ANY group â€" backend rejects duplicate variantIds
  const allSelectedVariantIds = new Set(subjectGroups.flatMap((g) => g.selected));

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

        <div className="relative w-full max-w-xl mx-4 bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              {mode === "create" ? "Create Faculty" : "Edit Faculty"}
            </h2>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* â"€â"€ Basic Info â"€â"€ */}
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
                hint="Comma-separated "
                //  e.g. MSc Physics, B.Ed"
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
              <Field label="Demo Class URL" error={errors.demoClass}>
                <input
                  value={demoClass}
                  onChange={(e) => { setDemoClass(e.target.value); clearFieldError("demoClass"); }}
                  placeholder="https://youtu.be/..."
                  className={inp(!!errors.demoClass)}
                />
              </Field>
              <Field
                label="Featured Faculty"
                hint="Shown in the landing page's featured section — max 8 faculty can be featured at a time"
              >
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#DB313E] focus:ring-[#DB313E]/30"
                  />
                  <span className="text-sm text-gray-700">
                    Mark this faculty as featured
                  </span>
                </label>
              </Field>
            </Section>

            {/* â"€â"€ Image â"€â"€ */}
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
                    Square image, min 300—300 recommended
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

            {/* â"€â"€ Subjects â"€â"€ */}
            <Section title="Subjects">
              {errors.subjects && (
                <p className="text-xs text-red-500 mb-2">{errors.subjects}</p>
              )}
              <div className="space-y-4">
                {subjectGroups.map((group, idx) => {
                  // selectedVariants always holds full objects â€" no dependency on variants loading
                  const selected = group.selectedVariants;
                  const available = group.variants.filter(
                    (v) => !allSelectedVariantIds.has(v._id)
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
                        <SearchableSelect
                          value={group.syllabusId}
                          onChange={(v) => updateGroupField(group.id, "syllabusId", v)}
                          options={syllabuses.map((s) => ({ value: s._id, label: s.name }))}
                          placeholder="Syllabus"
                        />

                        <SearchableSelect
                          value={group.classId}
                          onChange={(v) => updateGroupField(group.id, "classId", v)}
                          options={classes.map((c) => ({ value: c._id, label: c.name }))}
                          placeholder={group.syllabusId ? "Class" : "Select syllabus first"}
                          disabled={!group.syllabusId}
                        />
                      </div>

                      {/* Selected subjects with price input per variant */}
                      {selected.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Selected</p>
                          <div className="space-y-2">
                            {selected.map((v) => (
                              <div
                                key={v._id}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-red-200 bg-red-50"
                              >
                                <span className="flex-1 font-medium text-[#DB313E] truncate">
                                  {v.subjectName}
                                </span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-gray-500 text-xs">{String.fromCharCode(8377)}</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={group.prices[v._id] || String()}
                                    onChange={(e) => {
                                      updateVariantPrice(
                                        group.id,
                                        v._id,
                                        Number(e.target.value) || 0
                                      );
                                      clearFieldError(`subjects`);
                                    }}
                                    placeholder="Price"
                                    className="w-20 px-1.5 py-0.5 border border-gray-300 rounded text-gray-800 text-xs focus:outline-none focus:border-[#DB313E]"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleVariant(group.id, v._id)}
                                  className="text-red-400 hover:text-red-600 leading-none"
                                  title="Remove"
                                >
                                  {String.fromCharCode(215)}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Available subjects â€" muted clickable pills */}
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

              {mode === "create" ? (
                /* ── CREATE MODE: time-first table ── */
                (() => {
                  const allVariants = subjectGroups.flatMap((g) => {
                    const syllabusName = syllabuses.find((s) => s._id === g.syllabusId)?.name ?? "";
                    const className    = classes.find((c) => c._id === g.classId)?.name ?? "";
                    return g.selectedVariants.map((v) => ({
                      variantId: v._id,
                      label: [v.subjectName, className, syllabusName].filter(Boolean).join(" · "),
                    }));
                  });
                  return (
                    <div className="space-y-3">
                      {/* Add-time row */}
                      <div className="flex gap-2">
                        <TimeInput
                          key={newRowTimeKey}
                          value={newRowTime}
                          onChange={(v) => { setNewRowTime(v); setSlotError(""); }}
                          hasError={!!slotError}
                        />
                        <button
                          type="button"
                          onClick={handleAddTimeRow}
                          disabled={!newRowTime}
                          className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
                        >
                          + Add
                        </button>
                      </div>
                      {slotError && <p className="text-xs text-red-500">{slotError}</p>}

                      {/* Time rows table */}
                      {timeRows.length > 0 && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Header */}
                          <div className="grid bg-gray-50 px-3 py-2 border-b border-gray-200"
                            style={{ gridTemplateColumns: "90px 1fr 28px" }}>
                            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Time</span>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                                {allVariants.length === 0 ? "Subjects (select subjects above)" : "Subjects"}
                              </span>
                              {allVariants.length > 1 && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSetAllRowsVariants(allVariants.map((v) => v.variantId))}
                                    className="text-xs text-[#DB313E] hover:underline"
                                  >
                                    Select all
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSetAllRowsVariants([])}
                                    className="text-xs text-gray-400 hover:underline"
                                  >
                                    Clear all
                                  </button>
                                </div>
                              )}
                            </div>
                            <span />
                          </div>

                          {/* Rows */}
                          {timeRows.map((row) => (
                            <div
                              key={row.time}
                              className="grid items-center px-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                              style={{ gridTemplateColumns: "90px 1fr 28px" }}
                            >
                              {/* Time label */}
                              <span className="text-sm font-semibold text-gray-800">
                                {formatTimeAMPM(row.time)}
                              </span>

                              {/* Variant toggle pills */}
                              <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                                {allVariants.length === 0 && (
                                  <span className="text-xs text-gray-400 italic">—</span>
                                )}
                                {allVariants.map((v) => {
                                  const checked = row.variantIds.includes(v.variantId);
                                  return (
                                    <button
                                      key={v.variantId}
                                      type="button"
                                      onClick={() => handleToggleVariantInRow(row.time, v.variantId)}
                                      className={`px-2.5 py-0.5 text-xs rounded-full border font-medium transition-colors ${
                                        checked
                                          ? "bg-[#DB313E] border-[#DB313E] text-white"
                                          : "bg-white border-gray-300 text-gray-500 hover:border-[#DB313E] hover:text-[#DB313E]"
                                      }`}
                                    >
                                      {checked ? "✓ " : ""}{v.label}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Remove row */}
                              <button
                                type="button"
                                onClick={() => handleRemoveTimeRow(row.time)}
                                className="text-gray-300 hover:text-red-500 text-base leading-none transition-colors justify-self-end"
                                title="Remove this time"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {timeRows.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-2">
                          No time slots yet — add one above.
                        </p>
                      )}
                    </div>
                  );
                })()
              ) : (
                /* ── EDIT MODE: variant-first add + grouped list ── */
                (() => {
                  const allVariants = subjectGroups.flatMap((g) => {
                    const syllabusName = syllabuses.find((s) => s._id === g.syllabusId)?.name ?? "";
                    const className    = classes.find((c) => c._id === g.classId)?.name ?? "";
                    return g.selectedVariants.map((v) => ({
                      variantId: v._id,
                      label: [v.subjectName, className, syllabusName].filter(Boolean).join(" · "),
                    }));
                  });
                  const nameMap = new Map(allVariants.map((v) => [v.variantId, v.label]));
                  const variantIds = [...new Set(timeSlots.map((s) => s.variantId).filter(Boolean))];

                  return (
                    <div className="space-y-3">
                      {/* Add slot row */}
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newSlotVariantId}
                          onChange={(e) => { setNewSlotVariantId(e.target.value); setSlotError(""); }}
                          className={inp(!!slotError) + " text-sm"}
                          disabled={allVariants.length === 0}
                        >
                          <option value="">
                            {allVariants.length === 0 ? "No subjects yet" : "Subject…"}
                          </option>
                          {allVariants.map((v) => (
                            <option key={v.variantId} value={v.variantId}>{v.label}</option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <select
                            value={newTime}
                            onChange={(e) => { setNewTime(e.target.value); setSlotError(""); }}
                            className={inp(!!slotError) + " flex-1 text-sm"}
                            disabled={!newSlotVariantId}
                          >
                            <option value="">Time…</option>
                            {TIME_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={handleAddTimeSlot}
                            disabled={slotWorking || !newSlotVariantId || !newTime}
                            className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
                          >
                            {slotWorking ? "…" : "+ Add"}
                          </button>
                        </div>
                      </div>
                      {slotError && <p className="text-xs text-red-500">{slotError}</p>}

                      {/* Existing slots grouped by variant */}
                      {variantIds.length > 0 && (
                        <div className="space-y-2 mt-1">
                          {variantIds.map((vid) => {
                            const label = nameMap.get(vid!) ?? vid;
                            const active  = timeSlots.filter((s) => s.variantId === vid &&  s.isAvailable);
                            const blocked = timeSlots.filter((s) => s.variantId === vid && !s.isAvailable);
                            return (
                              <div key={vid} className="border border-gray-100 rounded-lg p-2 bg-gray-50">
                                <p className="text-[11px] font-semibold text-[#DB313E] uppercase tracking-wide mb-1.5">
                                  {label}
                                </p>
                                {active.length > 0 && (
                                  <div className="mb-1">
                                    <p className="text-[10px] text-gray-400 mb-1">Active</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {active.map((s) => (
                                        <span key={s.id ?? `${vid}-${s.time}`}
                                          className="flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-50 border border-blue-200 rounded-full text-blue-700">
                                          {formatTimeAMPM(s.time)}
                                          {(!s.pool || s.pool.length === 0) && (
                                            <button type="button" onClick={() => handleBlockTimeSlot(s)}
                                              disabled={slotWorking} title="Block"
                                              className="ml-0.5 text-blue-400 hover:text-red-500 disabled:opacity-50 leading-none">
                                              ×
                                            </button>
                                          )}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {blocked.length > 0 && (
                                  <div>
                                    <p className="text-[10px] text-gray-400 mb-1">Blocked</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {blocked.map((s) => (
                                        <span key={s.id ?? `${vid}-${s.time}`}
                                          className="flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded-full text-gray-400">
                                          {formatTimeAMPM(s.time)}
                                          <button type="button" onClick={() => handleUnblockTimeSlot(s)}
                                            disabled={slotWorking}
                                            className="ml-0.5 text-xs text-green-600 hover:text-green-700 font-medium disabled:opacity-50">
                                            Unblock
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </Section>

            {/* â"€â"€ Chapter Slots â"€â"€ */}
            <Section title="Chapter Slots">
              {errors.chapters && (
                <p className="text-xs text-red-500 mb-2">{errors.chapters}</p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <SearchableSelect
                  value={chapterSyllabusId}
                  onChange={(v) => {
                    setChapterSyllabusId(v);
                    setChapterClassId("");
                    setChapterError("");
                  }}
                  options={syllabuses.map((s) => ({ value: s._id, label: s.name }))}
                  placeholder="Syllabus"
                />

                <SearchableSelect
                  value={chapterClassId}
                  onChange={(v) => { setChapterClassId(v); setChapterError(""); }}
                  options={classes.map((c) => ({ value: c._id, label: c.name }))}
                  placeholder={chapterSyllabusId ? "Class" : "Select syllabus first"}
                  disabled={!chapterSyllabusId}
                />
              </div>

              {chapterSyllabusId && chapterClassId && chapterOptionsLoaded && chapterOptions.length === 0 && (
                <p ref={chapterNoResultsRef} className="text-xs text-gray-400 mt-2">
                  No chapters found for this syllabus & class combination.
                </p>
              )}

              {chapterOptions.length > 0 && (
                <div ref={chapterDropdownRef} className="flex gap-2 mt-2">
                  <SearchableSelect
                    value={chapterId}
                    onChange={(v) => { setChapterId(v); setChapterError(""); }}
                    options={chapterOptions.map((c) => ({ value: c._id, label: c.name }))}
                    placeholder="Select chapter"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddChapterSlot}
                    disabled={chapterWorking}
                    className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    {chapterWorking ? "" : "+ Add"}
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
                              title="Remove chapter"
                              className="ml-1 text-green-400 hover:text-red-500 disabled:opacity-50 leading-none"
                            >
                              {String.fromCharCode(215)}
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
                ? "Uploading"
                : saving
                ? "Saving"
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
  children: ReactNode;
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
  children: ReactNode;
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

