import { useEffect, useState } from "react";
import SearchableSelect from "../../../shared/components/SearchableSelect";
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

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={!loading ? onClose : undefined}
      />

      <div className="relative w-full max-w-lg mx-4 rounded-lg bg-white shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "create" ? "Create Subject" : "Edit Subject"}
          </h2>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Subject Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!!loading}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm
                focus:border-[#6D35D9] focus:outline-none disabled:bg-gray-100"
            />
          </div>

          {/* ── Existing Variants (edit mode) ─────────────────────────── */}
          {mode === "edit" && existingGrouped.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Existing Variants
              </p>
              <div className="space-y-2">
                {existingGrouped.map(({ syllabusId, classIds }) => (
                  <div
                    key={syllabusId}
                    className="rounded border border-gray-200 bg-gray-50 p-3"
                  >
                    <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      {syllabuses.find((s) => s._id === syllabusId)?.name ??
                        syllabusId}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {classIds.map((cid) => (
                        <span
                          key={cid}
                          className="px-2 py-0.5 rounded-full border border-gray-300 bg-white text-xs text-gray-600"
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

          {/* ── New Variant Groups ────────────────────────────────────── */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {mode === "edit" ? "Add New Variants" : "Subject Variants"}
            </p>

            <div className="space-y-3">
              {syllabusGroups.map((group, idx) => {
                // Syllabuses available for this slot = all minus those used in OTHER new groups
                const syllabusOptions = syllabuses
                  .filter(
                    (s) =>
                      s._id === group.syllabusId ||
                      !newGroupSyllabusIds.has(s._id)
                  )
                  .map((s) => ({ value: s._id, label: s.name }));

                // Classes available = all classes minus those already saved for this syllabus
                const alreadySaved = group.syllabusId
                  ? existingClassesBySyllabus[group.syllabusId] ?? new Set<string>()
                  : new Set<string>();

                const availableClasses = classes.filter(
                  (c) => !alreadySaved.has(c._id)
                );

                const allSelected =
                  availableClasses.length > 0 &&
                  availableClasses.every((c) => group.classIds.includes(c._id));

                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-gray-200 p-3 space-y-2.5"
                  >
                    {/* Syllabus select row */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <SearchableSelect
                          value={group.syllabusId}
                          onChange={(val) => updateGroupSyllabus(idx, val)}
                          options={syllabusOptions}
                          placeholder="Select syllabus…"
                          disabled={!!loading}
                        />
                      </div>
                      {syllabusGroups.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGroup(idx)}
                          disabled={!!loading}
                          className="text-sm text-red-500 hover:text-red-700 disabled:opacity-40 shrink-0"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Classes */}
                    {!group.syllabusId ? (
                      <p className="text-xs text-gray-400 italic">
                        Select a syllabus to pick classes.
                      </p>
                    ) : availableClasses.length === 0 ? (
                      <p className="text-xs text-amber-600 italic">
                        All classes are already added for this syllabus.
                      </p>
                    ) : (
                      <>
                        {/* Select-all / Clear row */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {group.classIds.length} / {availableClasses.length} selected
                          </span>
                          <div className="flex gap-3">
                            {!allSelected && (
                              <button
                                type="button"
                                onClick={() => selectAll(idx, availableClasses)}
                                disabled={!!loading}
                                className="text-xs text-[#6D35D9] hover:underline disabled:opacity-40"
                              >
                                Select all
                              </button>
                            )}
                            {group.classIds.length > 0 && (
                              <button
                                type="button"
                                onClick={() => clearAll(idx)}
                                disabled={!!loading}
                                className="text-xs text-gray-500 hover:underline disabled:opacity-40"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Checkbox grid */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {availableClasses.map((cls) => {
                            const checked = group.classIds.includes(cls._id);
                            return (
                              <label
                                key={cls._id}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded border text-sm cursor-pointer select-none transition-colors ${
                                  checked
                                    ? "border-[#6D35D9]/40 bg-[#6D35D9]/5 text-[#6D35D9] font-medium"
                                    : "border-gray-200 hover:bg-gray-50 text-gray-700"
                                } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleClass(idx, cls._id)}
                                  className="accent-[#6D35D9] shrink-0"
                                  disabled={!!loading}
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
                disabled={!!loading}
                className="text-sm text-[#6D35D9] font-medium hover:underline disabled:opacity-40"
              >
                + Add another syllabus
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={!!loading}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          {mode === "create" && (
            <button
              disabled={!canCreate || !!loading}
              onClick={() => onCreate(buildCreatePayload())}
              className="px-4 py-2 text-sm rounded bg-[#6D35D9] text-white
                hover:bg-[#5B2BC0] disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Subject"}
            </button>
          )}

          {mode === "edit" && (
            <>
              <button
                disabled={!canUpdateName || !!loading}
                onClick={() =>
                  onUpdateName({ _id: initialData!._id!, name: name.trim() })
                }
                className="px-4 py-2 text-sm rounded border hover:bg-gray-100 disabled:opacity-50"
              >
                Update Name
              </button>
              <button
                disabled={!canAddVariants || !!loading}
                onClick={() =>
                  onAddVariants({
                    _id: initialData!._id!,
                    variants: buildFlatVariants(),
                  })
                }
                className="px-4 py-2 text-sm rounded bg-[#6D35D9] text-white
                  hover:bg-[#5B2BC0] disabled:opacity-50"
              >
                {loading ? "Saving…" : "Add Variants"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
