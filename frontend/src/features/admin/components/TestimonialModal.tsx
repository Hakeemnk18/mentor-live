import { useEffect, useState } from "react";
import type { Testimonial, TestimonialPayload } from "../../../shared/types/testimonial.types";
import AdminModal from "./ui/AdminModal";
import AdminField from "./ui/AdminField";
import AdminButton from "./ui/AdminButton";
import { adminInputCls } from "./ui/styles";
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const close = () => {
    if (!loading) onClose();
  };
  const formId = "testimonial-form";
  const field = (err?: string) => `${adminInputCls(err)} h-11 sm:h-10 !py-0`;

  return (
    <AdminModal
      open={open}
      onClose={close}
      size="md"
      zIndex={1000}
      title={mode === "create" ? "Add Testimonial" : "Edit Testimonial"}
      description="Shown in the testimonials section on the website."
      footer={
        <>
          <AdminButton variant="outline" onClick={close} disabled={loading}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" form={formId} loading={loading}>
            {loading ? "Saving…" : mode === "create" ? "Add Testimonial" : "Save changes"}
          </AdminButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Author Name" required htmlFor="t-author" error={errors.author}>
            <input
              id="t-author"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                clearFieldError("author");
              }}
              maxLength={100}
              placeholder="e.g. Ananya Sharma"
              className={field(errors.author)}
            />
          </AdminField>
          <AdminField label="Designation" required htmlFor="t-designation" error={errors.designation}>
            <input
              id="t-designation"
              value={designation}
              onChange={(e) => {
                setDesignation(e.target.value);
                clearFieldError("designation");
              }}
              maxLength={100}
              placeholder="e.g. Class 10 CBSE Student"
              className={field(errors.designation)}
            />
          </AdminField>
        </div>

        <div>
          <AdminField label="Comment" required hint="(20–500 characters)" htmlFor="t-comment" error={errors.comment}>
            <textarea
              id="t-comment"
              rows={5}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                clearFieldError("comment");
              }}
              maxLength={500}
              placeholder="Write the testimonial comment…"
              className={`${adminInputCls(errors.comment)} resize-none leading-relaxed`}
            />
          </AdminField>
          <p className={`m-0 mt-1 text-xs text-right tabular-nums ${comment.length > 480 ? "text-[#C8372D]" : "text-[#8A80A3]"}`}>
            {comment.length}/500
          </p>
        </div>
      </form>
    </AdminModal>
  );
}
