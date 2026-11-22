import { useEffect, useRef, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import TimeInput from "../../../shared/components/TimeInput";
import { formatTimeAMPM } from "../../../shared/utils/time.utils";
import FacultyImageField from "./FacultyImageField";
import { AdminAsyncMultiSelect, AdminButton, AdminToggle } from "./ui";
import type { AsyncOption } from "./ui";
import { CHAPTER_SEARCH_LIMIT, searchChapters } from "./chapterSearch";
import { getSubjectVariants } from "../../../api/chapter.api";
import { uploadToCloudinary } from "../../../shared/utils/cloudinary";
import { setFacultyChapterSlotAvailability } from "../../../api/faculty.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { ImagePayload, SubjectGroup, SubjectVariant, FacultyModalData, SubjectSlotGroup } from "../../../shared/types/faculty.types";
/* ================================================================== */
/* TYPES                                                                */
/* ================================================================== */

/**
 * CREATE-mode only: one row per time, with a set of variant IDs
 * indicating which subjects this time slot applies to.
 */
type TimeRow = {
  time: string;         // HH:mm
  variantIds: string[]; // checked variants for this time
};

const DEFAULT_SLOT_TIMES: string[] = ["15:00", "16:00", "17:00", "18:00", "19:00"];

/** Both modes are step-by-step. Edit skips class times & chapters (managed on the detail page). */
type StepKey = "profile" | "photo" | "subjects" | "times" | "chapters" | "summary";

/** fields = which validate() error keys belong to the step (same keys, same rules) */
const STEP_META: Record<StepKey, { title: string; hint: string; fields: string[] }> = {
  profile: { title: "Profile", hint: "Who is this teacher?", fields: ["name", "qualifications", "description", "demoClass"] },
  photo: { title: "Photo", hint: "Shown on their card and profile page", fields: ["image"] },
  subjects: { title: "Subjects & fees", hint: "What they teach and the fee per hour", fields: ["subjects"] },
  times: { title: "Class times", hint: "Times students can book them", fields: ["slots"] },
  chapters: { title: "Chapter classes", hint: "Optional — book a single chapter", fields: [] },
  summary: { title: "Summary", hint: "Check everything before saving", fields: [] },
};

const CREATE_FLOW: StepKey[] = ["profile", "photo", "subjects", "times", "chapters", "summary"];
const EDIT_FLOW: StepKey[] = ["profile", "photo", "subjects", "summary"];
/** Edit flow when new subjects were added — they need class times before saving. */
const EDIT_FLOW_WITH_TIMES: StepKey[] = ["profile", "photo", "subjects", "times", "summary"];

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
  const [uploading, setUploading] = useState(false);

  /* ---------- Subject groups ---------- */
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);


  /* ---------- Time rows (CREATE mode only) ---------- */
  const [timeRows, setTimeRows] = useState<TimeRow[]>(
    DEFAULT_SLOT_TIMES.map((t) => ({ time: t, variantIds: [] }))
  );
  const [newRowTime, setNewRowTime] = useState("");
  const [newRowTimeKey, setNewRowTimeKey] = useState(0);

  /* ---------- Chapter slots ---------- */
  const [chapterSlots, setChapterSlots] = useState<ChapterSlotState[]>([]);
  const [chapterPicks, setChapterPicks] = useState<AsyncOption[]>([]);
  const [chapterWorking, setChapterWorking] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slotError, setSlotError] = useState("");
  const [step, setStep] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
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
      setChapterSlots([]);
      setChapterPicks([]);
      setChapterError("");
      setErrors({});
      setStep(0);
      return;
    }

    // ---- Edit mode (async so we can fetch variants in parallel) ----
    const init = async () => {
      setStep(0);
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

      setChapterPicks([]);
      setChapterError("");
      setErrors({});
      setTimeRows(DEFAULT_SLOT_TIMES.map((t) => ({ time: t, variantIds: [] })));
      setNewRowTime("");

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
  /* CHAPTER SLOT helpers                                               */
  /* ================================================================ */

  const handleAddChapterSlot = () => {
    const fresh = chapterPicks.filter((p) => !chapterSlots.some((c) => c.chapter === p.value));
    if (fresh.length === 0) {
      setChapterError(chapterPicks.length ? "These chapters are already added" : "Pick at least one chapter");
      return;
    }
    setChapterError("");
    setChapterSlots((prev) => [...prev, ...fresh.map((p) => ({ chapter: p.value, label: p.label, isAvailable: true }))]);
    setChapterPicks([]);
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

  /** Edit mode: subjects added in this edit (not on the saved faculty). They need class times. */
  function getNewVariantIds(): Set<string> {
    if (mode !== "edit") return new Set();
    const saved = new Set((initialData?.subjectOffering ?? []).map((o) => o.id));
    return new Set(subjectGroups.flatMap((g) => g.selected).filter((v) => !saved.has(v)));
  }

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
    } else if (description.trim().length > 500) {
      e.description = "Description must be under 500 characters";
    }
    if (!demoClass.trim()) {
      e.demoClass = "Demo class video link is required";
    } else {
      try { new URL(demoClass.trim()); } catch {
        e.demoClass = "Must be a valid URL (starting with https://)";
      }
    }
    if (mode === "create" && !imageFile && !imagePayload)
      e.image = "Image is required";
    const allSelected = subjectGroups.flatMap((g) => g.selected);
    if (allSelected.length === 0) {
      e.subjects = "Add at least one subject";
    } else {
      const missingPrice = subjectGroups.some((g) =>
        g.selected.some((id) => !g.prices[id] || g.prices[id] <= 0)
      );
      if (missingPrice) e.subjects = "Enter a fee per hour for every subject";
    }
    const newVariants = getNewVariantIds();
    if (mode === "create" || newVariants.size > 0) {
      const allVariants = mode === "create" ? subjectGroups.flatMap((g) => g.selected) : [...newVariants];
      if (timeRows.length === 0) {
        e.slots = "Add at least one class time";
      } else if (allVariants.length > 0) {
        // Every selected variant must appear in at least one row
        const covered = new Set(timeRows.flatMap((r) => r.variantIds));
        const missing = allVariants.filter((v) => !covered.has(v));
        if (missing.length > 0) {
          e.slots = "Every subject needs at least one class time — tick it in a row below";
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
      const first = flow.findIndex((k) => STEP_META[k].fields.some((f) => errs[f]));
      if (first >= 0) goToStep(first);
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
      if (finalImage && (imageFile || mode === "edit")) {
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
      } else {
        const newVariants = getNewVariantIds();
        if (newVariants.size > 0) {
          const byVariant = new Map<string, { time: string }[]>();
          for (const row of timeRows) {
            for (const vid of row.variantIds) {
              if (!newVariants.has(vid)) continue;
              if (!byVariant.has(vid)) byVariant.set(vid, []);
              byVariant.get(vid)!.push(timeStringToISOSlot(row.time));
            }
          }
          payload.subjectSlots = Array.from(byVariant.entries()).map(([variantId, times]) => ({ variantId, times }));
        }
      }

      await onSubmit(payload);
    } catch {
      setUploading(false);
    }
  };

  const isLoading = saving || uploading || chapterWorking;

  /* ---------- Wizard (create mode) ---------- */
  const newVariantIdsNow = getNewVariantIds();
  const flow = mode === "create" ? CREATE_FLOW : newVariantIdsNow.size > 0 ? EDIT_FLOW_WITH_TIMES : EDIT_FLOW;
  const lastStep = flow.length - 1;
  const stepKey = flow[Math.min(step, lastStep)];
  const show = (k: StepKey) => stepKey === k;
  const stepNo = (k: StepKey) => flow.indexOf(k);

  function goToStep(i: number) {
    setStep(i);
    bodyRef.current?.scrollTo({ top: 0 });
  }

  /** Next: run the existing validation, but only block on this step's fields. */
  const goNext = () => {
    const errs = validate();
    const stepErrs = Object.fromEntries(
      Object.entries(errs).filter(([k]) => STEP_META[flow[step]].fields.includes(k))
    );
    if (Object.keys(stepErrs).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrs }));
      toast.error("Please fix the highlighted fields");
      return;
    }
    goToStep(Math.min(step + 1, lastStep));
  };

  /** Stepper click: going back is free; going forward only if every step before the target is valid. */
  const goToStepChecked = (target: number) => {
    if (target <= step) {
      goToStep(target);
      return;
    }
    const errs = validate();
    for (let i = step; i < target; i++) {
      const stepErrs = Object.fromEntries(Object.entries(errs).filter(([k]) => STEP_META[flow[i]].fields.includes(k)));
      if (Object.keys(stepErrs).length > 0) {
        setErrors((prev) => ({ ...prev, ...stepErrs }));
        if (i !== step) goToStep(i);
        toast.error(`Please complete “${STEP_META[flow[i]].title}” first`);
        return;
      }
    }
    goToStep(target);
  };

  /* edit summary: what differs from the saved faculty */
  const qualList = qualifications.split(",").map((q) => q.trim()).filter(Boolean);
  const profileChanged =
    mode === "edit" &&
    !!initialData &&
    (name.trim() !== (initialData.name ?? "") ||
      qualList.join("|") !== (initialData.qualifications ?? []).join("|") ||
      description.trim() !== (initialData.description ?? "") ||
      demoClass.trim() !== (initialData.demoClass ?? "") ||
      isFeatured !== (initialData.isFeatured ?? false));
  const photoChanged = mode === "edit" && !!imageFile;
  const subjectsChanged =
    mode === "edit" &&
    (initialData?.subjectOffering ?? []).map((o) => `${o.id}:${o.price ?? 0}`).sort().join("|") !==
      subjectGroups.flatMap((g) => g.selected.map((id) => `${id}:${g.prices[id] ?? 0}`)).sort().join("|");

  /* labels for summary */
  const variantLabel = new Map(
    subjectGroups.flatMap((g) => {
      const syllabusName = syllabuses.find((x) => x._id === g.syllabusId)?.name ?? "";
      const className = classes.find((c) => c._id === g.classId)?.name ?? "";
      return g.selectedVariants.map((v) => [v._id, [v.subjectName, className, syllabusName].filter(Boolean).join(" · ")] as const);
    })
  );

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

        <div className={`relative w-full max-w-2xl mx-3 sm:mx-4 bg-white rounded-2xl shadow-xl flex flex-col max-h-[92dvh]`}>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#EFE9FA] px-4 sm:px-6 py-4">
            <h2 className="text-base font-semibold text-[#2A1650]">
              {mode === "create" ? "Add a new faculty" : "Edit faculty"}
            </h2>
            <button
              type="button"
              onClick={!isLoading ? onClose : undefined}
              aria-label="Close"
              className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-gray-400 hover:text-[#6D35D9] hover:bg-[#F4F1FA] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>

          {/* Stepper */}
          <WizardStepper steps={flow.map((k) => STEP_META[k])} step={step} onGo={goToStepChecked} />

          {/* Body */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">

            {/* â"€â"€ Basic Info â"€â"€ */}
            {show("profile") && (
            <Section hideTitle title="Teacher profile">
              <p className="text-xs text-gray-500">
                Fields marked <span className="text-[#FF6B5E] ml-0.5">*</span> are required.
              </p>
              <Field label="Full name" required error={errors.name}>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                  maxLength={100}
                  placeholder="e.g. Neha Thomas"
                  className={inp(!!errors.name)}
                />
              </Field>
              <Field
                label="Degrees & certificates"
                required
                hint="Separate each one with a comma"
                //  e.g. MSc Physics, B.Ed"
                error={errors.qualifications}
              >
                <input
                  value={qualifications}
                  onChange={(e) => { setQualifications(e.target.value); clearFieldError("qualifications"); }}
                  maxLength={300}
                  placeholder="e.g. MSc Physics, B.Ed"
                  className={inp(!!errors.qualifications)}
                />
              </Field>
              <Field label="About the teacher" required hint="Shown on their card and profile page" error={errors.description}>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); clearFieldError("description"); }}
                  rows={3}
                  maxLength={500}
                  placeholder="e.g. 8 years teaching Physics for Class 9–12, focused on concepts and board exam preparation."
                  className={inp(!!errors.description) + " resize-none"}
                />
                <div className="flex justify-end mt-0.5">
                  <span className={`text-xs ${description.length > 470 ? "text-red-500" : "text-gray-400"}`}>
                    {description.length}/500
                  </span>
                </div>
              </Field>
              <Field label="Demo class video link" required hint="A YouTube link students can watch before booking" error={errors.demoClass}>
                <input
                  value={demoClass}
                  onChange={(e) => { setDemoClass(e.target.value); clearFieldError("demoClass"); }}
                  placeholder="https://youtu.be/..."
                  className={inp(!!errors.demoClass)}
                />
              </Field>
              <AdminToggle
                label="Show on home page"
                description={
                  isFeatured
                    ? "Appears in “Meet Our Top Faculty” on the home page (max 8 at a time)"
                    : "Not shown on the home page — turn on to feature this teacher"
                }
                checked={isFeatured}
                onChange={setIsFeatured}
              />
            </Section>
            )}

            {/* â"€â"€ Image â"€â"€ */}
            {show("photo") && (
            <Section hideTitle title="Photo">
              <p className="text-sm font-medium text-gray-700">
                Faculty photo<span className="text-[#FF6B5E] ml-0.5" aria-hidden>*</span>
              </p>
              <FacultyImageField
                value={imageUrl}
                name={name}
                error={errors.image}
                onChange={(file, url) => {
                  clearFieldError("image");
                  setImageFile(file);
                  setImageUrl(url);
                }}
                onError={(message) => setErrors((prev) => ({ ...prev, image: message }))}
              />
            </Section>
            )}

            {/* â"€â"€ Subjects â"€â"€ */}
            {show("subjects") && (
            <Section hideTitle title="Subjects & fees">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Subjects you teach<span className="text-[#FF6B5E] ml-0.5" aria-hidden>*</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Pick a syllabus and class, tap the subjects, then enter the fee per hour.</p>
              </div>
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
                          Syllabus & class {idx + 1}
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
                          <p className="text-xs text-gray-500 mb-1">Subjects and fee per hour<span className="text-[#FF6B5E] ml-0.5" aria-hidden>*</span></p>
                          <div className="space-y-2">
                            {selected.map((v) => (
                              <div
                                key={v._id}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-[#E4DDF2] bg-white"
                              >
                                <span className="flex-1 font-medium text-[#6D35D9] truncate">
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
                                    placeholder="Fee"
                                    className="w-20 px-1.5 py-0.5 border border-gray-300 rounded text-gray-800 text-xs focus:outline-none focus:border-[#6D35D9]"
                                  />
                                  <span className="text-gray-400 text-xs">/hr</span>
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
                            {selected.length > 0 ? "Add more subjects" : "Tap a subject to add it"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {available.map((v) => (
                              <button
                                key={v._id}
                                type="button"
                                onClick={() => toggleVariant(group.id, v._id)}
                                className="px-3 py-1 text-xs rounded-full border border-gray-300 bg-white text-gray-700 hover:border-[#6D35D9] hover:text-[#6D35D9] transition-colors"
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
                className="mt-3 text-sm text-[#6D35D9] hover:underline"
              >
                + Add another syllabus / class
              </button>
            </Section>
            )}

            {/* ── Time Slots ── */}
            {show("times") && (
            <Section hideTitle title="Class times">
              <p className="text-sm font-medium text-gray-700">
                Class times<span className="text-[#FF6B5E] ml-0.5" aria-hidden>*</span>
              </p>
              {errors.slots && (
                <p className="text-xs text-red-500 mb-2">{errors.slots}</p>
              )}

              {(
                /* ── time-first table (create: all subjects · edit: only newly added subjects) ── */
                (() => {
                  const allVariants = subjectGroups.flatMap((g) => {
                    const syllabusName = syllabuses.find((s) => s._id === g.syllabusId)?.name ?? "";
                    const className    = classes.find((c) => c._id === g.classId)?.name ?? "";
                    return g.selectedVariants.map((v) => ({
                      variantId: v._id,
                      label: [v.subjectName, className, syllabusName].filter(Boolean).join(" · "),
                    }));
                  }).filter((v) => mode === "create" || newVariantIdsNow.has(v.variantId));
                  return (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Each time stays open for students to book until you remove it. Tick the subjects taught at each
                        time. Times must be at least 1 hour apart.
                        {mode === "edit" && " Only the subjects you just added are shown here — existing subjects keep their times on the faculty page."}
                      </p>
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
                          + Add time
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
                                {allVariants.length === 0 ? "Subjects (add them in the previous step)" : "Subjects at this time"}
                              </span>
                              {allVariants.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => { handleSetAllRowsVariants(allVariants.map((v) => v.variantId)); clearFieldError("slots"); }}
                                    className="h-6 px-2.5 rounded-full bg-[#F4F1FA] text-[11px] font-semibold text-[#6D35D9] hover:bg-[#EDE6FB]"
                                  >
                                    Select all
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSetAllRowsVariants([])}
                                    className="h-6 px-2.5 rounded-full bg-white border border-[#E4DDF2] text-[11px] font-semibold text-gray-500 hover:text-red-500 hover:border-red-200"
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
                                          ? "bg-[#6D35D9] border-[#6D35D9] text-white"
                                          : "bg-white border-gray-300 text-gray-500 hover:border-[#6D35D9] hover:text-[#6D35D9]"
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
                          No class times yet — add one above.
                        </p>
                      )}
                    </div>
                  );
                })()
              )}
            </Section>
            )}

            {/* â"€â"€ Chapter Slots â"€â"€ */}
            {show("chapters") && (
            <Section hideTitle title="Chapter-wise classes (optional)">
              {errors.chapters && (
                <p className="text-xs text-red-500 mb-2">{errors.chapters}</p>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Chapters<span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-[#F4F1FA] text-[10px] font-semibold uppercase tracking-wide text-[#6D35D9] align-middle">Optional</span>
                </p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  Lets students book this teacher for one chapter at a time. Search any chapter by name, tick as many as you
                  need, then add them. Nothing here is required. You can skip this step.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                <div className="flex-1 min-w-0">
                  <AdminAsyncMultiSelect
                    label="Chapters"
                    placeholder="Search by chapter name, e.g. motion"
                    searchPlaceholder="Type a chapter name…"
                    selected={chapterPicks}
                    onChange={(next) => { setChapterPicks(next); setChapterError(""); }}
                    loadOptions={searchChapters}
                    pageSize={CHAPTER_SEARCH_LIMIT}
                    disabledValues={chapterSlots.map((c) => c.chapter)}
                    disabledHint="Added"
                    emptyText="No chapters match"
                  />
                </div>
                <AdminButton variant="soft" onClick={handleAddChapterSlot} disabled={chapterPicks.length === 0} className="shrink-0">
                  {chapterPicks.length > 1 ? `+ Add ${chapterPicks.length} chapters` : "+ Add chapter"}
                </AdminButton>
              </div>
              {chapterError && (
                <p className="text-xs text-red-500 mt-0.5">{chapterError}</p>
              )}

              {/* Active chapter slots */}
              {chapterSlots.some((cs) => cs.isAvailable) && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">{mode === "create" ? "Added chapters" : "Active"}</p>
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
            )}
            {show("summary") && (
              <div className="space-y-3">
                <SummaryCard title="Profile & photo" changed={profileChanged || photoChanged} onEdit={() => goToStep(stepNo("profile"))}>
                  <div className="flex gap-3">
                    {imageUrl && (
                      <img src={imageUrl} alt="" className="w-24 aspect-[7/5] rounded-lg object-cover shrink-0 border border-[#E4DDF2]" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2A1650]">{name}</p>
                      <p className="text-xs font-semibold text-[#FF6B5E] mt-0.5">
                        {qualifications.split(",").map((q) => q.trim()).filter(Boolean).join(" · ")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-3">{description}</p>
                      {photoChanged && <p className="mt-1 text-[11px] font-semibold text-[#FF6B5E]">New photo</p>}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-1 text-xs">
                    <p className="text-gray-500 truncate">
                      Demo video:{" "}
                      <a href={demoClass} target="_blank" rel="noreferrer" className="text-[#6D35D9] hover:underline">
                        {demoClass}
                      </a>
                    </p>
                    <p className="text-gray-500">
                      Home page: <span className="font-semibold text-[#2A1650]">{isFeatured ? "Shown" : "Not shown"}</span>
                    </p>
                  </div>
                </SummaryCard>

                <SummaryCard title="Subjects & fees" changed={subjectsChanged} onEdit={() => goToStep(stepNo("subjects"))}>
                  <div className="space-y-2.5">
                    {subjectGroups
                      .filter((g) => g.selectedVariants.length > 0)
                      .map((g) => (
                        <div key={g.id}>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            {[syllabuses.find((x) => x._id === g.syllabusId)?.name, classes.find((c) => c._id === g.classId)?.name]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                          <ul className="mt-1 space-y-1">
                            {g.selectedVariants.map((v) => (
                              <li key={v._id} className="flex justify-between gap-3 text-sm">
                                <span className="text-[#2A1650]">{v.subjectName}</span>
                                <span className="font-semibold text-[#2A1650]">
                                  {String.fromCharCode(8377)}
                                  {g.prices[v._id] ?? 0}
                                  <span className="text-xs font-normal text-gray-400">/hr</span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </SummaryCard>

                {(mode === "create" || newVariantIdsNow.size > 0) && (<>
                <SummaryCard title={mode === "create" ? "Class times" : "New class times"} changed={mode === "edit"} onEdit={() => goToStep(stepNo("times"))}>
                  <ul className="space-y-1.5">
                    {timeRows
                      .filter((r) => r.variantIds.length > 0)
                      .map((r) => (
                        <li key={r.time} className="flex gap-3 text-sm">
                          <span className="w-20 shrink-0 font-semibold text-[#2A1650]">{formatTimeAMPM(r.time)}</span>
                          <span className="text-gray-600">{r.variantIds.map((v) => variantLabel.get(v) ?? v).join(", ")}</span>
                        </li>
                      ))}
                  </ul>
                  {timeRows.some((r) => r.variantIds.length === 0) && (
                    <p className="mt-2 text-xs text-gray-400">
                      Times with no subjects ticked are not created:{" "}
                      {timeRows.filter((r) => r.variantIds.length === 0).map((r) => formatTimeAMPM(r.time)).join(", ")}
                    </p>
                  )}
                </SummaryCard>

                {mode === "create" && (
                <SummaryCard title="Chapter classes" onEdit={() => goToStep(stepNo("chapters"))}>
                  {chapterSlots.length === 0 ? (
                    <p className="text-sm text-gray-400">None added (optional)</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {chapterSlots.map((cs) => (
                        <span key={cs.chapter} className="px-2.5 py-1 rounded-full bg-[#F4F1FA] text-xs font-medium text-[#6D35D9]">
                          {cs.label ?? cs.chapter}
                        </span>
                      ))}
                    </div>
                  )}
                </SummaryCard>
                )}
                </>)}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#EFE9FA] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 bg-white rounded-b-2xl">
            <AdminButton
              variant="outline"
              onClick={step === 0 ? onClose : () => goToStep(step - 1)}
              disabled={isLoading}
            >
              {step === 0 ? "Cancel" : "Back"}
            </AdminButton>
            <div className="flex items-center gap-2">
              {/* Edit: save from any step (full validation; jumps to the step with an error) */}
              {mode === "edit" && step < lastStep && (
                <AdminButton variant="soft" onClick={handleSubmit} loading={isLoading}>
                  {uploading ? "Uploading…" : saving ? "Saving…" : "Save changes"}
                </AdminButton>
              )}
              {step < lastStep ? (
                <AdminButton onClick={goNext} disabled={isLoading}>
                  {stepKey === "chapters" && chapterSlots.length === 0 ? "Skip" : "Next"}
                </AdminButton>
              ) : (
                <AdminButton onClick={handleSubmit} loading={isLoading}>
                  {uploading ? "Uploading…" : saving ? "Saving…" : mode === "create" ? "Create faculty" : "Save changes"}
                </AdminButton>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

/* ================================================================== */
/* SMALL HELPERS                                                        */
/* ================================================================== */

function WizardStepper({
  steps,
  step,
  onGo,
}: {
  steps: { title: string; hint: string }[];
  step: number;
  onGo: (i: number) => void;
}) {
  return (
    <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-[#EFE9FA]">
      {/* phones: compact */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-[#2A1650]">{steps[step].title}</p>
          <span className="text-xs text-gray-400 shrink-0">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{steps[step].hint}</p>
        <div className="mt-2.5 h-1.5 rounded-full bg-[#FFE3DF] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#FF6B5E] transition-[width] duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* tablet & laptop: full stepper */}
      <ol className="hidden sm:flex items-start">
        {steps.map((st, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={st.title} className="relative flex-1">
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute top-[11px] right-1/2 w-full h-0.5 transition-colors ${i <= step ? "bg-[#FF6B5E]" : "bg-[#E4DDF2]"}`}
                />
              )}
              <button
                type="button"
                onClick={() => onGo(i)}
                aria-current={current ? "step" : undefined}
                aria-label={`Go to ${st.title}`}
                className="group relative z-[1] w-full flex flex-col items-center cursor-pointer focus:outline-none"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 group-focus-visible:ring-4 group-focus-visible:ring-[#6D35D9]/20 ${
                    current
                      ? "bg-[#FF6B5E] ring-4 ring-[#FFE3DF]"
                      : done
                      ? "bg-[#FF6B5E] group-hover:bg-[#F25445]"
                      : "bg-white border-2 border-[#E4DDF2] group-hover:border-[#FFB3AB]"
                  }`}
                >
                  {done ? (
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                    </svg>
                  ) : current ? (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  ) : null}
                </span>
                <span
                  className={`mt-1.5 px-1 text-[11px] font-semibold text-center leading-tight transition-colors ${
                    current ? "text-[#2A1650]" : done ? "text-[#2A1650]/70 group-hover:text-[#2A1650]" : "text-gray-400 group-hover:text-[#2A1650]/70"
                  }`}
                >
                  {st.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SummaryCard({
  title,
  onEdit,
  changed = false,
  children,
}: {
  title: string;
  onEdit: () => void;
  /** edit mode: something in this card differs from the saved faculty */
  changed?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E4DDF2] bg-[#FAF8FE] p-4">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#2A1650]/70">
          {title}
          {changed && (
            <span className="ml-2 px-1.5 py-0.5 rounded-md bg-[#FFE3DF] text-[10px] font-bold tracking-wide text-[#C8372D] align-middle">
              CHANGED
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="h-7 px-3 rounded-full bg-white border border-[#E4DDF2] text-xs font-semibold text-[#6D35D9] hover:bg-[#F4F1FA] cursor-pointer"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function Section({
  title,
  hideTitle = false,
  children,
}: {
  title: string;
  /** The wizard stepper already shows the title */
  hideTitle?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      {!hideTitle && <p className="text-sm font-semibold text-gray-800 border-b pb-1">{title}</p>}
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  required,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  /** coral * after the label */
  required?: boolean;
  /** small "Optional" tag after the label */
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-[#FF6B5E] ml-0.5" aria-hidden>*</span>}
        {optional && <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-[#F4F1FA] text-[10px] font-semibold uppercase tracking-wide text-[#6D35D9] align-middle">Optional</span>}
      </label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inp = (hasError: boolean) =>
  `w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#6D35D9]/30 ${
    hasError ? "border-red-400" : "border-gray-300"
  }`;

