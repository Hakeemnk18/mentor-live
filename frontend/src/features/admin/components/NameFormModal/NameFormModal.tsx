import { useEffect, useState } from "react";
import type { NameFormData, NameFormMode } from "./types";

type Props = {
  open: boolean;
  mode: NameFormMode;
  initialData?: NameFormData;
  onClose: () => void;
  onSubmit: (data: NameFormData) => void;
  loading?: boolean;

  /** Generic customization */
  title: string; // e.g. "Class", "Syllabus"
  label: string; // e.g. "Class Name"
  placeholder?: string;
};

export default function NameFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
  loading,
  title,
  label,
  placeholder,
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
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {mode === "create" ? `Create ${title}` : `Edit ${title}`}
        </h2>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
              disabled={loading}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#DB313E] focus:outline-none disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 
               cursor-pointer transition-colors 
               hover:bg-gray-100 
               disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={!name.trim() || loading}
            className="px-4 py-2 text-sm rounded 
               bg-[#DB313E] text-white 
               cursor-pointer transition-colors 
               hover:bg-[#c72b36] 
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create"
              : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
