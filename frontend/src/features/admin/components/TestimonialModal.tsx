import { useEffect, useState } from "react";
import type { Testimonial, TestimonialPayload } from "../../../shared/types/testimonial.types";
interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Testimonial;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: TestimonialPayload) => Promise<void>;
}

export default function TestimonialModal({
  open,
  mode,
  initialData,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [author, setAuthor] = useState("");
  const [designation, setDesignation] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* populate fields when editing */
  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setAuthor(initialData.author);
      setDesignation(initialData.designation);
      setComment(initialData.comment);
    } else if (open && mode === "create") {
      setAuthor("");
      setDesignation("");
      setComment("");
    }
    setErrors({});
  }, [open, mode, initialData]);

  if (!open) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!author.trim()) {
      e.author = "Author name is required";
    } else if (author.trim().length < 2) {
      e.author = "Author name must be at least 2 characters";
    } else if (author.trim().length > 100) {
      e.author = "Author name must be under 100 characters";
    }
    if (!designation.trim()) {
      e.designation = "Designation is required";
    } else if (designation.trim().length < 2) {
      e.designation = "Designation must be at least 2 characters";
    } else if (designation.trim().length > 100) {
      e.designation = "Designation must be under 100 characters";
    }
    if (!comment.trim()) {
      e.comment = "Comment is required";
    } else if (comment.trim().length < 20) {
      e.comment = "Comment must be at least 20 characters";
    } else if (comment.trim().length > 500) {
      e.comment = "Comment must be under 500 characters";
    }
    return e;
  };

  const clearFieldError = (field: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit({ author: author.trim(), designation: designation.trim(), comment: comment.trim() });
  };

  const inp = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 ${
      err ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[1000] bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-lg bg-white rounded-xl shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              {mode === "create" ? "Add Testimonial" : "Edit Testimonial"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Author */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Author Name *</label>
              <input
                value={author}
                onChange={(e) => { setAuthor(e.target.value); clearFieldError("author"); }}
                maxLength={100}
                placeholder="e.g. Ananya Sharma"
                className={inp(errors.author)}
              />
              {errors.author && <p className="text-xs text-red-500 mt-0.5">{errors.author}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Designation *</label>
              <input
                value={designation}
                onChange={(e) => { setDesignation(e.target.value); clearFieldError("designation"); }}
                maxLength={100}
                placeholder="e.g. Class 10 CBSE Student"
                className={inp(errors.designation)}
              />
              {errors.designation && <p className="text-xs text-red-500 mt-0.5">{errors.designation}</p>}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Comment *</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => { setComment(e.target.value); clearFieldError("comment"); }}
                maxLength={500}
                placeholder="Write the testimonial comment…"
                className={inp(errors.comment) + " resize-none"}
              />
              <div className="flex items-center justify-between mt-0.5">
                {errors.comment
                  ? <p className="text-xs text-red-500">{errors.comment}</p>
                  : <span />}
                <span className={`text-xs ${
                  comment.length > 480 ? "text-red-500" : "text-gray-400"
                }`}>
                  {comment.length}/500
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium bg-[#DB313E] text-white rounded-md hover:bg-[#c02535] disabled:opacity-50 transition-colors"
              >
                {loading ? "Saving…" : mode === "create" ? "Add Testimonial" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
