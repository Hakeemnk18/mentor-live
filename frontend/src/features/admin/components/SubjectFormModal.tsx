import { useEffect, useState } from "react";
import AdminModal from "./ui/AdminModal";
import AdminField from "./ui/AdminField";
import AdminButton from "./ui/AdminButton";
import AdminSelect from "./ui/AdminSelect";
import { adminInputCls } from "./ui/styles";
import type {
  CreateSubjectPayload,
  SubjectFormVariant,
} from "../../../shared/types/subject.types";

type SyllabusGroup = {
  syllabusId: string;
  classIds: string[];
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: {
    _id?: string;
    name: string;
    variants: SubjectFormVariant[];
  };
  onClose: () => void;
  onCreate: (data: CreateSubjectPayload) => void;
  onUpdateName: (data: { _id: string; name: string }) => void;
  onAddVariants: (data: {
    _id: string;
    variants: SubjectFormVariant[];
  }) => void;
  loading?: boolean;
  syllabuses: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];
};

export default function SubjectFormModal({
  open,
  mode,
  initialData,
  onClose,
  loading,
  syllabuses,
  classes,
  onAddVariants,
  onUpdateName,
  onCreate,
}: Props) {
  const [name, setName] = useState("");
  const [existingVariants, setExistingVariants] = useState<SubjectFormVariant[]>([]);
  const [syllabusGroups, setSyllabusGroups] = useState<SyllabusGroup[]>([
    { syllabusId: "", classIds: [] },
  ]);

  useEffect(() => {
    if (!open) return;
    setName(initialData?.name ?? "");
    if (mode === "edit" && initialData?.variants?.length) {
      setExistingVariants(initialData.variants);
    } else {
      setExistingVariants([]);
    }
    setSyllabusGroups([{ syllabusId: "", classIds: [] }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  // ── Derived state ────────────────────────────────────────────────────────

  // Map: syllabusId → Set<classId> for existing (already-saved) variants
  const existingClassesBySyllabus = existingVariants.reduce<
    Record<string, Set<string>>
  >((acc, v) => {
    if (!acc[v.syllabusId]) acc[v.syllabusId] = new Set();
    acc[v.syllabusId].add(v.classId);
    return acc;
  }, {});

  // Existing variants grouped for read-only display
  const existingGrouped = Object.entries(existingClassesBySyllabus).map(
    ([syllabusId, classIdSet]) => ({
      syllabusId,
      classIds: Array.from(classIdSet),
    })
  );

  // Syllabuses already chosen in NEW groups (prevents duplicate syllabus groups)
  const newGroupSyllabusIds = new Set(
    syllabusGroups.map((g) => g.syllabusId).filter(Boolean)
  );

  // ── Group helpers ────────────────────────────────────────────────────────

  const updateGroupSyllabus = (idx: number, syllabusId: string) =>
    setSyllabusGroups((prev) =>
      prev.map((g, i) => (i === idx ? { syllabusId, classIds: [] } : g))
    );

  const toggleClass = (idx: number, classId: string) =>
    setSyllabusGroups((prev) =>
      prev.map((g, i) => {
        if (i !== idx) return g;
        const has = g.classIds.includes(classId);
        return {
          ...g,
          classIds: has
            ? g.classIds.filter((id) => id !== classId)
            : [...g.classIds, classId],
        };
      })
    );

  const selectAll = (idx: number, availableClasses: { _id: string }[]) =>
    setSyllabusGroups((prev) =>
      prev.map((g, i) =>
        i === idx
          ? { ...g, classIds: availableClasses.map((c) => c._id) }
          : g
      )
    );

  const clearAll = (idx: number) =>
    setSyllabusGroups((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, classIds: [] } : g))
    );

  const removeGroup = (idx: number) =>
    setSyllabusGroups((prev) => prev.filter((_, i) => i !== idx));

  const addGroup = () =>
    setSyllabusGroups((prev) => [...prev, { syllabusId: "", classIds: [] }]);

  // ── Payload builders ─────────────────────────────────────────────────────

  const buildCreatePayload = (): CreateSubjectPayload => ({
    name: name.trim(),
    syllabusAndClass: syllabusGroups
      .filter((g) => g.syllabusId && g.classIds.length > 0)
      .map((g) => ({ syllabus: g.syllabusId, classes: g.classIds })),
  });

  const buildFlatVariants = (): SubjectFormVariant[] =>
    syllabusGroups
      .filter((g) => g.syllabusId && g.classIds.length > 0)
      .flatMap((g) =>
        g.classIds.map((classId) => ({ syllabusId: g.syllabusId, classId }))
      );

  // ── Button enable flags ───────────────────────────────────────────────────

  const hasValidNewGroups = syllabusGroups.some(
    (g) => g.syllabusId && g.classIds.length > 0
  );
  const canCreate = !!name.trim() && hasValidNewGroups;
  const canAddVariants = mode === "edit" && hasValidNewGroups;
  const canUpdateName =
    mode === "edit" &&
    !!name.trim() &&
    name.trim() !== initialData?.name;

  // ── Render ────────────────────────────────────────────────────────────────

  const close = () => {
    if (!loading) onClose();
  };
  const busy = !!loading;

  return (
    <AdminModal
      open={open}
      onClose={close}
      size="md"
      zIndex={1000}
      title={mode === "create" ? "Create Subject" : "Edit Subject"}
      description={
        mode === "create"
          ? "Name the subject and choose the syllabus and classes it is taught in."
          : "Rename the subject or add it to more syllabus / classes."
      }
      footer={
        <>
          <AdminButton variant="outline" onClick={close} disabled={busy}>
            Cancel
          </AdminButton>
          {mode === "create" && (
            <AdminButton disabled={!canCreate} loading={busy} onClick={() => onCreate(buildCreatePayload())}>
              {busy ? "Creating…" : "Create Subject"}
            </AdminButton>
          )}
          {mode === "edit" && (
            <>
              <AdminButton
                variant="soft"
                disabled={!canUpdateName || busy}
                onClick={() => onUpdateName({ _id: initialData!._id!, name: name.trim() })}
              >
                Update Name
              </AdminButton>
              <AdminButton
                disabled={!canAddVariants}
                loading={busy}
                onClick={() => onAddVariants({ _id: initialData!._id!, variants: buildFlatVariants() })}
              >
                {busy ? "Saving…" : "Add Variants"}
              </AdminButton>
            </>
          )}
        </>
      }
    >
      <div className="space-y-5">
        {/* Subject name */}
        <AdminField label="Subject Name" required htmlFor="subject-name">
          <input
            id="subject-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
            placeholder="e.g. Mathematics"
            className={`${adminInputCls()} h-11 sm:h-10 !py-0 disabled:bg-[#F4F1FA]`}
          />
        </AdminField>

        {/* Existing variants (edit) */}
        {mode === "edit" && existingGrouped.length > 0 && (
          <div>
            <p className="m-0 mb-2 text-xs font-semibold text-[#2A1650]/80">Already added</p>
            <div className="space-y-2">
              {existingGrouped.map(({ syllabusId, classIds }) => (
                <div key={syllabusId} className="rounded-xl border border-[#E4DDF2] bg-[#FAF8FE] p-3">
                  <p className="m-0 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8A80A3]">
                    {syllabuses.find((s) => s._id === syllabusId)?.name ?? syllabusId}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {classIds.map((cid) => (
                      <span
                        key={cid}
                        className="px-2.5 py-1 rounded-full border border-[#E4DDF2] bg-white text-xs font-medium text-[#655B7E]"
                      >
                        {classes.find((c) => c._id === cid)?.name ?? cid}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New syllabus groups */}
        <div>
          <p className="m-0 mb-2 text-xs font-semibold text-[#2A1650]/80">
            {mode === "edit" ? "Add new syllabus / classes" : "Syllabus & classes"}
            {mode === "create" && <span className="text-[#FF6B5E] ml-0.5">*</span>}
          </p>

          <div className="space-y-3">
            {syllabusGroups.map((group, idx) => {
              // syllabuses for this group = all minus those used in OTHER new groups
              const syllabusOptions = syllabuses
                .filter((s) => s._id === group.syllabusId || !newGroupSyllabusIds.has(s._id))
                .map((s) => ({ value: s._id, label: s.name }));

              // classes = all minus those already saved for this syllabus
              const alreadySaved = group.syllabusId
                ? existingClassesBySyllabus[group.syllabusId] ?? new Set<string>()
                : new Set<string>();
              const availableClasses = classes.filter((c) => !alreadySaved.has(c._id));
              const allSelected =
                availableClasses.length > 0 && availableClasses.every((c) => group.classIds.includes(c._id));

              return (
                <div key={idx} className="rounded-2xl border border-[#E4DDF2] p-3 sm:p-3.5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <AdminSelect
                        value={group.syllabusId}
                        onChange={(val) => updateGroupSyllabus(idx, val)}
                        options={syllabusOptions}
                        placeholder="Select syllabus…"
                        label={`Syllabus ${idx + 1}`}
                        searchable={syllabusOptions.length > 8}
                        disabled={busy}
                      />
                    </div>
                    {syllabusGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGroup(idx)}
                        disabled={busy}
                        aria-label={`Remove syllabus ${idx + 1}`}
                        className="shrink-0 h-10 px-3 rounded-full text-sm font-semibold text-[#C8372D] cursor-pointer hover:bg-[#FFE3DF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {!group.syllabusId ? (
                    <p className="m-0 text-xs text-[#8A80A3]">Select a syllabus to pick classes.</p>
                  ) : availableClasses.length === 0 ? (
                    <p className="m-0 text-xs font-medium text-[#8A5A00]">All classes are already added for this syllabus.</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8A80A3] tabular-nums">
                          {group.classIds.length} / {availableClasses.length} selected
                        </span>
                        <div className="flex gap-1">
                          {!allSelected && (
                            <button
                              type="button"
                              onClick={() => selectAll(idx, availableClasses)}
                              disabled={busy}
                              className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#6D35D9] cursor-pointer hover:bg-[#F4F1FA] disabled:opacity-40"
                            >
                              Select all
                            </button>
                          )}
                          {group.classIds.length > 0 && (
                            <button
                              type="button"
                              onClick={() => clearAll(idx)}
                              disabled={busy}
                              className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#655B7E] cursor-pointer hover:bg-[#F4F1FA] disabled:opacity-40"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableClasses.map((cls) => {
                          const checked = group.classIds.includes(cls._id);
                          return (
                            <label
                              key={cls._id}
                              className={`flex items-center gap-2 h-10 px-3 rounded-xl border text-sm cursor-pointer select-none transition-colors ${
                                checked
                                  ? "border-[#6D35D9] bg-[#F4F1FA] text-[#6D35D9] font-semibold"
                                  : "border-[#E4DDF2] bg-white text-[#2A1650] hover:border-[#CBB9F0]"
                              } ${busy ? "opacity-50 pointer-events-none" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleClass(idx, cls._id)}
                                className="w-4 h-4 accent-[#6D35D9] shrink-0"
                                disabled={busy}
                              />
                              <span className="truncate">{cls.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={addGroup}
              disabled={busy}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-semibold text-[#6D35D9] bg-[#F4F1FA] cursor-pointer hover:bg-[#EDE6FB] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span aria-hidden className="text-base leading-none">+</span> Add another syllabus
            </button>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
