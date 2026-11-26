import { useEffect, useId, useRef, useState } from "react";
import type { NameFormData, NameFormMode } from "./types";
import AdminModal from "../ui/AdminModal";
import AdminField from "../ui/AdminField";
import AdminButton from "../ui/AdminButton";
import { adminInputCls } from "../ui/styles";

type Props = {
  open: boolean;
  mode: NameFormMode;
  initialData?: NameFormData;
  onClose: () => void;
  onSubmit: (data: NameFormData) => void;
  loading?: boolean;

  /** Generic customization */
  title: string;   // e.g. "Class", "Syllabus"
  label: string;   // e.g. "Class Name"
  placeholder?: string;
  /** Optional min length override (default 2) */
  minLength?: number;
  /** Optional max length override (default 100) */
  maxLength?: number;
};

/** Create / edit a record that only has a name (Class, Syllabus). */
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
  minLength = 2,
  maxLength = 100,
}: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialData?.name ?? "");
      setError("");
      // put the cursor in the field once the dialog is on screen
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(`${label} is required`);
      return false;
    }
    if (trimmed.length < minLength) {
      setError(`${label} must be at least ${minLength} characters`);
      return false;
    }
    if (trimmed.length > maxLength) {
      setError(`${label} must be under ${maxLength} characters`);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      // send the cursor back to the field so the admin can fix it straight away
      inputRef.current?.focus();
      return;
    }
    onSubmit({ _id: initialData?._id, name: name.trim() });
  };

  // don't close while saving
  const close = () => {
    if (!loading) onClose();
  };

  const isCreate = mode === "create";
  const nearLimit = name.length > maxLength * 0.9;

  return (
    <AdminModal
      open={open}
      onClose={close}
      size="sm"
      zIndex={1000}
      title={isCreate ? `Create ${title}` : `Edit ${title}`}
      description={isCreate ? `Add a new ${title.toLowerCase()} to the list.` : `Rename this ${title.toLowerCase()}.`}
      footer={
        <>
          <AdminButton variant="outline" onClick={close} disabled={loading}>
            Cancel
          </AdminButton>
          <AdminButton onClick={handleSubmit} loading={loading}>
            {loading ? (isCreate ? "Creating…" : "Saving…") : isCreate ? `Create ${title}` : "Save changes"}
          </AdminButton>
        </>
      }
    >
      <AdminField label={label} required htmlFor={inputId} error={error}>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
          maxLength={maxLength}
          disabled={loading}
          aria-invalid={!!error}
          className={`${adminInputCls(error)} h-11 sm:h-10 !py-0 disabled:bg-[#F4F1FA] disabled:text-[#8A80A3]`}
        />
      </AdminField>
      <p className={`m-0 mt-1.5 text-xs text-right tabular-nums ${nearLimit ? "text-[#C8372D]" : "text-[#8A80A3]"}`}>
        {name.length}/{maxLength}
      </p>
    </AdminModal>
  );
}
