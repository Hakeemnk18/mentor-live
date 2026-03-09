import { useEffect, useState } from "react";
import { mapVariantsToSyllabusAndClass } from "../../../api/subject.api";
import type {
  CreateSubjectPayload,
  SyllabusAndClassPayload,
} from "../../../shared/types/api.types";

type VariantRow = {
  syllabusId: string;
  classId: string;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: {
    _id?: string;
    name: string;
    variants: VariantRow[];
  };
  onClose: () => void;

  onCreate: (data: CreateSubjectPayload) => void;

  onUpdateName: (data: { _id: string; name: string }) => void;
  onAddVariants: (data: {
    _id: string;
    variants: VariantRow[];
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
  console.log("initial data recieved ", initialData);
  const [name, setName] = useState("");
  
  const [existingVariants, setExistingVariants] = useState<VariantRow[]>([]);
  const [newVariants, setNewVariants] = useState<VariantRow[]>([
    { syllabusId: "", classId: "" },
  ]);

  useEffect(() => {
    if (!open) return;

    // Initialize once when modal opens
    setName(initialData?.name ?? "");

    if (mode === "edit" && initialData?.variants?.length) {
      setExistingVariants(initialData.variants);
      setNewVariants([{ syllabusId: "", classId: "" }]);
    } else {
      setExistingVariants([]);
      setNewVariants([{ syllabusId: "", classId: "" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const hasValidNewVariant = newVariants.some((v) => v.syllabusId && v.classId);

  const isValid = name.trim() && (mode === "edit" || hasValidNewVariant);
  const canCreate =
    name.trim() && newVariants.some((v) => v.syllabusId && v.classId);

  const canUpdateName =
    mode === "edit" && name.trim() && name.trim() !== initialData?.name;

  const canAddVariants =
    mode === "edit" && newVariants.some((v) => v.syllabusId && v.classId);
  // syllabusId|classId → used

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={!loading ? onClose : undefined}
      />

      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {mode === "create" ? "Create Subject" : "Edit Subject"}
        </h2>

        {/* Subject name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm
              focus:border-[#DB313E] focus:outline-none disabled:bg-gray-100"
          />
        </div>

        {/* Variants */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Subject Variants</p>

          {mode === "edit" && existingVariants.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Existing Variants
              </p>

              {existingVariants.map((v, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    disabled
                    value={
                      syllabuses.find((s) => s._id === v.syllabusId)?.name || ""
                    }
                    className="flex-1 px-2 py-2 text-sm border rounded bg-gray-100"
                  />
                  <input
                    disabled
                    value={classes.find((c) => c._id === v.classId)?.name || ""}
                    className="flex-1 px-2 py-2 text-sm border rounded bg-gray-100"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Add New Variants
            </p>

            {newVariants.map((variant, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <select
                  value={variant.syllabusId}
                  onChange={(e) =>
                    setNewVariants((prev) =>
                      prev.map((v, i) =>
                        i === idx ? { ...v, syllabusId: e.target.value } : v
                      )
                    )
                  }
                  className="flex-1 px-2 py-2 text-sm border rounded"
                >
                  <option value="">Select syllabus</option>
                  {syllabuses.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={variant.classId}
                  onChange={(e) =>
                    setNewVariants((prev) =>
                      prev.map((v, i) =>
                        i === idx ? { ...v, classId: e.target.value } : v
                      )
                    )
                  }
                  className="flex-1 px-2 py-2 text-sm border rounded"
                  disabled={!variant.syllabusId}
                >
                  <option value="">Select class</option>

                  {classes
                    .filter((c) => {
                      const comboKey = `${variant.syllabusId}|${c._id}`;

                      // ❗ build used combos excluding current row
                      const usedCombos = new Set<string>();

                      // existing backend variants
                      existingVariants.forEach((v) => {
                        usedCombos.add(`${v.syllabusId}|${v.classId}`);
                      });

                      // other new rows (NOT this one)
                      newVariants.forEach((v, i) => {
                        if (i !== idx && v.syllabusId && v.classId) {
                          usedCombos.add(`${v.syllabusId}|${v.classId}`);
                        }
                      });

                      // hide already-used combos
                      return !usedCombos.has(comboKey);
                    })
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>

                {newVariants.length > 1 && (
                  <button
                    onClick={() =>
                      setNewVariants((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-sm text-red-600 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() =>
                setNewVariants((prev) => [
                  ...prev,
                  { syllabusId: "", classId: "" },
                ])
              }
              className="text-sm text-[#DB313E] font-medium cursor-pointer"
            >
              + Add another variant
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          {mode === "create" && (
            <button
              disabled={!canCreate || loading}
              onClick={() =>
                onCreate({
                  name: name.trim(),
                  syllabusAndClass: mapVariantsToSyllabusAndClass(
                    newVariants.filter((v) => v.syllabusId && v.classId)
                  ),
                })
              }
              className="px-4 py-2 text-sm rounded bg-[#DB313E] text-white
        hover:bg-[#c72b36] disabled:opacity-50"
            >
              Create Subject
            </button>
          )}

          {mode === "edit" && (
            <>
              <button
                disabled={!canUpdateName || loading}
                onClick={() =>
                  onUpdateName({
                    _id: initialData!._id!,
                    name: name.trim(),
                  })
                }
                className="px-4 py-2 text-sm rounded border
          hover:bg-gray-100 disabled:opacity-50"
              >
                Update Name
              </button>

              <button
                disabled={!canAddVariants || loading}
                onClick={() =>
                  onAddVariants({
                    _id: initialData!._id!,
                    variants: newVariants.filter(
                      (v) => v.syllabusId && v.classId
                    ),
                  })
                }
                className="px-4 py-2 text-sm rounded bg-[#DB313E] text-white
          hover:bg-[#c72b36] disabled:opacity-50"
              >
                Add Variants
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
