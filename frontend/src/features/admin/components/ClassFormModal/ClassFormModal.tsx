import { useEffect, useState } from "react";
import type { ClassFormData, ClassFormMode } from "./types";

type Props = {
  open: boolean;
  mode: ClassFormMode;
  initialData?: ClassFormData;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
};

export default function ClassFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
    }
  }, [open, initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {mode === "create" ? "Create Class" : "Edit Class"}
        </h2>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter class name"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#DB313E] focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit({
                _id: initialData?._id,
                name,
              })
            }
            disabled={!name.trim()}
            className="px-4 py-2 text-sm rounded bg-[#DB313E] text-white hover:opacity-90 disabled:opacity-50"
          >
            {mode === "create" ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
