import { useEffect, useState } from "react";
import type { AdminUser, CreateUserPayload, EditUserPayload, UserRole } from "../../../shared/types/user.types";

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

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const inputCls = (field: keyof FormState) =>
    `w-full rounded border px-3 py-2 text-sm focus:outline-none disabled:bg-gray-100 ${
      errors[field]
        ? "border-red-400 focus:border-red-400"
        : "border-gray-300 focus:border-[#DB313E]"
    }`;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={!loading ? onClose : undefined}
      />

      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {mode === "create" ? "Create User" : "Edit User"}
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Enter full name"
              maxLength={100}
              disabled={loading}
              className={inputCls("name")}
            />
            {errors.name && <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="Enter email address"
              disabled={loading}
              className={inputCls("email")}
            />
            {errors.email && <p className="mt-0.5 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {mode === "create" && <span className="text-red-500">*</span>}
              {mode === "edit" && <span className="text-xs text-gray-400 font-normal ml-1">(leave blank to keep unchanged)</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder={mode === "create" ? "Enter password" : "New password (optional)"}
              maxLength={50}
              disabled={loading}
              className={inputCls("password")}
            />
            {errors.password && <p className="mt-0.5 text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={form.role}
              onChange={set("role")}
              disabled={loading}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#DB313E] disabled:bg-gray-100"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-[#DB313E] text-white cursor-pointer hover:bg-[#c72b36] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === "create" ? "Creating..." : "Updating..."
              : mode === "create" ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
