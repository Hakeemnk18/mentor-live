import { useEffect, useState } from "react";
import type { AdminUser, CreateUserPayload, EditUserPayload, UserRole } from "../../../shared/types/user.types";
import AdminModal from "./ui/AdminModal";
import AdminField from "./ui/AdminField";
import AdminButton from "./ui/AdminButton";
import AdminSelect from "./ui/AdminSelect";
import { adminInputCls } from "./ui/styles";

type Mode = "create" | "edit";

type Props = {
  open: boolean;
  mode: Mode;
  initialData?: AdminUser;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload | EditUserPayload) => void;
};

const ROLES: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "salesPerson", label: "Sales Person" },
];

type FormState = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState, mode: Mode): FormErrors {
  const errors: FormErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();

  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (name.length > 100) {
    errors.name = "Name must be less than 100 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email address";
  }

  if (mode === "create") {
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (form.password.length > 50) {
      errors.password = "Password must be less than 50 characters";
    }
  } else if (form.password) {
    if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (form.password.length > 50) {
      errors.password = "Password must be less than 50 characters";
    }
  }

  return errors;
}

export default function UserFormModal({
  open,
  mode,
  initialData,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: initialData?.name ?? "",
        email: initialData?.email ?? "",
        password: "",
        role: initialData?.role ?? "user",
      });
      setErrors({});
    }
  }, [open, initialData]);

  if (!open) return null;

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const errs = validate(form, mode);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (mode === "create") {
      onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      } as CreateUserPayload);
    } else {
      const payload: EditUserPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      };
      if (form.password) payload.password = form.password;
      onSubmit(payload);
    }
  };

  const close = () => {
    if (!loading) onClose();
  };
  const inputCls = (field: keyof FormState) =>
    `${adminInputCls(errors[field])} h-11 sm:h-10 !py-0 disabled:bg-[#F4F1FA] disabled:text-[#8A80A3]`;

  return (
    <AdminModal
      open={open}
      onClose={close}
      size="sm"
      zIndex={1000}
      title={mode === "create" ? "Create User" : "Edit User"}
      description={mode === "create" ? "Give someone access to the admin panel." : "Update this user's details or role."}
      footer={
        <>
          <AdminButton variant="outline" onClick={close} disabled={loading}>
            Cancel
          </AdminButton>
          <AdminButton onClick={handleSubmit} loading={loading}>
            {loading ? (mode === "create" ? "Creating…" : "Saving…") : mode === "create" ? "Create User" : "Save changes"}
          </AdminButton>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
        className="space-y-4"
      >
        <AdminField label="Name" required htmlFor="u-name" error={errors.name}>
          <input
            id="u-name"
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Enter full name"
            maxLength={100}
            disabled={loading}
            autoComplete="off"
            className={inputCls("name")}
          />
        </AdminField>

        <AdminField label="Email" required htmlFor="u-email" error={errors.email}>
          <input
            id="u-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="Enter email address"
            disabled={loading}
            autoComplete="off"
            className={inputCls("email")}
          />
        </AdminField>

        <AdminField
          label="Password"
          required={mode === "create"}
          hint={mode === "edit" ? "(leave blank to keep it)" : undefined}
          htmlFor="u-password"
          error={errors.password}
        >
          <input
            id="u-password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder={mode === "create" ? "At least 6 characters" : "New password (optional)"}
            maxLength={50}
            disabled={loading}
            autoComplete="new-password"
            className={inputCls("password")}
          />
        </AdminField>

        <AdminField label="Role" required>
          <AdminSelect<UserRole>
            value={form.role}
            onChange={(role) => {
              setForm((prev) => ({ ...prev, role }));
              setErrors((prev) => ({ ...prev, role: undefined }));
            }}
            options={ROLES}
            label="Role"
            disabled={loading}
          />
        </AdminField>

        {/* lets Enter submit from any field */}
        <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
      </form>
    </AdminModal>
  );
}
