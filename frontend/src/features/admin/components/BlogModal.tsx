import { useEffect, useState } from "react";
import type { Blog, BlogPayload } from "../../../shared/types/blog.types";
interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Blog & { content?: string };
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: BlogPayload) => Promise<void>;
}

export default function BlogModal({
  open,
  mode,
  initialData,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [author, setAuthor] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setAuthor(initialData.author);
      setHeading(initialData.heading);
      setDescription(initialData.description);
      setContent(initialData.content ?? "");
    } else if (open && mode === "create") {
      setAuthor("");
      setHeading("");
      setDescription("");
      setContent("");
    }
    setErrors({});
  }, [open, mode, initialData]);

  if (!open) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!author.trim()) {
      e.author = "Author is required";
    } else if (author.trim().length < 2) {
      e.author = "Author must be at least 2 characters";
    } else if (author.trim().length > 100) {
      e.author = "Author must be under 100 characters";
    }
    if (!heading.trim()) {
      e.heading = "Heading is required";
    } else if (heading.trim().length < 5) {
      e.heading = "Heading must be at least 5 characters";
    } else if (heading.trim().length > 150) {
      e.heading = "Heading must be under 150 characters";
    }
    if (!description.trim()) {
      e.description = "Description is required";
    } else if (description.trim().length < 20) {
      e.description = "Description must be at least 20 characters";
    } else if (description.trim().length > 300) {
      e.description = "Description must be under 300 characters";
    }
    if (!content.trim()) {
      e.content = "Content is required";
    } else if (content.trim().length < 50) {
      e.content = "Content must be at least 50 characters";
    }
    return e;
  };

  const clearFieldError = (field: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSubmit({
      author: author.trim(),
      heading: heading.trim(),
      description: description.trim(),
      content: content.trim(),
    });
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
          className="pointer-events-auto w-full max-w-2xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
            <h2 className="text-base font-semibold text-gray-900">
              {mode === "create" ? "New Blog Post" : "Edit Blog Post"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Author */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Author *</label>
              <input
                value={author}
                onChange={(e) => { setAuthor(e.target.value); clearFieldError("author"); }}
                maxLength={100}
                placeholder="e.g. Muhammed Hakeem"
                className={inp(errors.author)}
              />
              {errors.author && <p className="text-xs text-red-500 mt-0.5">{errors.author}</p>}
            </div>

            {/* Heading */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Heading *</label>
              <input
                value={heading}
                onChange={(e) => { setHeading(e.target.value); clearFieldError("heading"); }}
                maxLength={150}
                placeholder="e.g. Understanding Node.js"
                className={inp(errors.heading)}
              />
              {errors.heading && <p className="text-xs text-red-500 mt-0.5">{errors.heading}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => { setDescription(e.target.value); clearFieldError("description"); }}
                maxLength={300}
                placeholder="Short summary of the post…"
                className={inp(errors.description) + " resize-none"}
              />
              <div className="flex items-center justify-between mt-0.5">
                {errors.description
                  ? <p className="text-xs text-red-500">{errors.description}</p>
                  : <span />}
                <span className={`text-xs ${description.length > 280 ? "text-red-500" : "text-gray-400"}`}>
                  {description.length}/300
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Content *</label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => { setContent(e.target.value); clearFieldError("content"); }}
                placeholder="Full blog content…"
                className={inp(errors.content) + " resize-y"}
              />
              <div className="flex items-center justify-between mt-0.5">
                {errors.content
                  ? <p className="text-xs text-red-500">{errors.content}</p>
                  : <span />}
                <span className={`text-xs ${content.length > 9500 ? "text-red-500" : "text-gray-400"}`}>
                  {content.length.toLocaleString()} chars
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t">
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
                {loading ? "Saving…" : mode === "create" ? "Publish Blog" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
