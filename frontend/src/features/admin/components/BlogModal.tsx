import { useState } from "react";
import type { Blog, BlogPayload } from "../../../shared/types/blog.types";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Blog & { content?: string };
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: BlogPayload) => Promise<void>;
}

type FormState = {
  author: string;
  heading: string;
  description: string;
  content: string;
  errors: Record<string, string>;
};

const emptyForm: FormState = {
  author: "",
  heading: "",
  description: "",
  content: "",
  errors: {},
};

export default function BlogModal({
  open,
  mode,
  initialData,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);

  const [prevOpen, setPrevOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<(Blog & { content?: string }) | undefined>(undefined);
  if (open !== prevOpen || (open && initialData !== prevInitialData)) {
    setPrevOpen(open);
    setPrevInitialData(initialData);
    if (open) {
      if (mode === "edit" && initialData) {
        setForm({
          author: initialData.author,
          heading: initialData.heading,
          description: initialData.description,
          content: initialData.content ?? "",
          errors: {},
        });
      } else {
        setForm(emptyForm);
      }
    }
  }

  if (!open) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.author.trim()) {
      e.author = "Author is required";
    } else if (form.author.trim().length < 2) {
      e.author = "Author must be at least 2 characters";
    } else if (form.author.trim().length > 100) {
      e.author = "Author must be under 100 characters";
    }
    if (!form.heading.trim()) {
      e.heading = "Heading is required";
    } else if (form.heading.trim().length < 5) {
      e.heading = "Heading must be at least 5 characters";
    } else if (form.heading.trim().length > 150) {
      e.heading = "Heading must be under 150 characters";
    }
    if (!form.description.trim()) {
      e.description = "Description is required";
    } else if (form.description.trim().length < 20) {
      e.description = "Description must be at least 20 characters";
    } else if (form.description.trim().length > 300) {
      e.description = "Description must be under 300 characters";
    }
    if (!form.content.trim()) {
      e.content = "Content is required";
    } else if (form.content.trim().length < 50) {
      e.content = "Content must be at least 50 characters";
    }
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setForm(prev => ({ ...prev, errors: errs })); return; }
    await onSubmit({
      author: form.author.trim(),
      heading: form.heading.trim(),
      description: form.description.trim(),
      content: form.content.trim(),
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
                value={form.author}
                onChange={(e) => { const v = e.target.value; setForm(prev => { const errors = { ...prev.errors }; delete errors.author; return { ...prev, author: v, errors }; }); }}
                maxLength={100}
                placeholder="e.g. Muhammed Hakeem"
                className={inp(form.errors.author)}
              />
              {form.errors.author && <p className="text-xs text-red-500 mt-0.5">{form.errors.author}</p>}
            </div>

            {/* Heading */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Heading *</label>
              <input
                value={form.heading}
                onChange={(e) => { const v = e.target.value; setForm(prev => { const errors = { ...prev.errors }; delete errors.heading; return { ...prev, heading: v, errors }; }); }}
                maxLength={150}
                placeholder="e.g. Understanding Node.js"
                className={inp(form.errors.heading)}
              />
              {form.errors.heading && <p className="text-xs text-red-500 mt-0.5">{form.errors.heading}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => { const v = e.target.value; setForm(prev => { const errors = { ...prev.errors }; delete errors.description; return { ...prev, description: v, errors }; }); }}
                maxLength={300}
                placeholder="Short summary of the post…"
                className={inp(form.errors.description) + " resize-none"}
              />
              <div className="flex items-center justify-between mt-0.5">
                {form.errors.description
                  ? <p className="text-xs text-red-500">{form.errors.description}</p>
                  : <span />}
                <span className={`text-xs ${form.description.length > 280 ? "text-red-500" : "text-gray-400"}`}>
                  {form.description.length}/300
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Content *</label>
              <textarea
                rows={8}
                value={form.content}
                onChange={(e) => { const v = e.target.value; setForm(prev => { const errors = { ...prev.errors }; delete errors.content; return { ...prev, content: v, errors }; }); }}
                placeholder="Full blog content…"
                className={inp(form.errors.content) + " resize-y"}
              />
              <div className="flex items-center justify-between mt-0.5">
                {form.errors.content
                  ? <p className="text-xs text-red-500">{form.errors.content}</p>
                  : <span />}
                <span className={`text-xs ${form.content.length > 9500 ? "text-red-500" : "text-gray-400"}`}>
                  {form.content.length.toLocaleString()} chars
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
