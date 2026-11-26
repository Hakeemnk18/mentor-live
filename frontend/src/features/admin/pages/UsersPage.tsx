import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminFilter, AdminFilterBar, AdminFilterSelect, AdminSearchInput } from "../components/ui";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import UserFormModal from "../components/UserFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import { getUsers, createUser, editUser, blockUser, unblockUser } from "../../../api/user.api";
import type { Column } from "../components/AdminTable";
import type { AdminUser, CreateUserPayload, EditUserPayload, UserRole } from "../../../shared/types/user.types";

/* ── helpers ─────────────────────────────────────────────────── */
const ROLE_LABELS: Record<UserRole, string> = {
  user: "User",
  admin: "Admin",
  salesPerson: "Sales Person",
};

const ROLE_COLORS: Record<UserRole, string> = {
  user: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
  salesPerson: "bg-amber-100 text-amber-700",
};

/* ── columns ──────────────────────────────────────────────────── */
const columns: Column<AdminUser>[] = [
  {
    key: "name",
    label: "Name",
    render: (u) => (
      <div>
        <p className="font-medium text-gray-900 text-sm">{u.name}</p>
        <p className="text-xs text-gray-400">{u.email}</p>
      </div>
    ),
  },
  {
    key: "role",
    label: "Role",
    render: (u) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${ROLE_COLORS[u.role]}`}>
        {ROLE_LABELS[u.role]}
      </span>
    ),
  },
  {
    key: "verified",
    label: "Verified",
    render: (u) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${u.isVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
        {u.isVerified ? "Yes" : "No"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (u) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${u.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
        {u.isBlocked ? "Blocked" : "Active"}
      </span>
    ),
  },
];

/* ── sort helper ─────────────────────────────────────────────── */
type SortField = "name" | "email" | "role" | "createdAt";

function nextSort(current: string, field: SortField): string {
  if (current === field) return `-${field}`;
  if (current === `-${field}`) return "createdAt";
  return field;
}

function SortIcon({ active, desc }: { active: boolean; desc: boolean }) {
  return (
    <span className="inline-block ml-1 text-gray-400">
      {active ? (desc ? "↓" : "↑") : "↕"}
    </span>
  );
}

/* ── component ────────────────────────────────────────────────── */
/** default table order (also what "Clear filters" goes back to) */
const DEFAULT_SORT = "createdAt";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* form modal */
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<AdminUser | undefined>();

  /* confirm modal */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<AdminUser | null>(null);
  const [confirmAction, setConfirmAction] = useState<"block" | "unblock">("block");
  const [confirmLoading, setConfirmLoading] = useState(false);

  /* filters */
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "blocked">("");
  const [sort, setSort] = useState(DEFAULT_SORT);

  /* pagination */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  /* ── fetch ── */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const isBlocked =
        statusFilter === "blocked" ? true : statusFilter === "active" ? false : undefined;
      const res = await getUsers({
        page,
        limit,
        search: search || undefined,
        role: roleFilter || undefined,
        isBlocked,
        sort: sort !== "createdAt" ? sort : undefined,
      });
      setUsers(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, statusFilter, sort]);

  /* ── handlers ── */
  const handleCreate = () => {
    setMode("create");
    setEditing(undefined);
    setModalOpen(true);
  };

  const handleEdit = (u: AdminUser) => {
    setMode("edit");
    setEditing(u);
    setModalOpen(true);
  };

  const handleFormSubmit = async (payload: CreateUserPayload | EditUserPayload) => {
    try {
      setSubmitting(true);
      if (mode === "create") {
        await createUser(payload as CreateUserPayload);
        toast.success("User created");
      } else if (editing) {
        await editUser(editing.id, payload as EditUserPayload);
        toast.success("User updated");
      }
      setModalOpen(false);
      setEditing(undefined);
      fetchUsers();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const openBlockConfirm = (u: AdminUser) => {
    setConfirmTarget(u);
    setConfirmAction("block");
    setConfirmOpen(true);
  };

  const openUnblockConfirm = (u: AdminUser) => {
    setConfirmTarget(u);
    setConfirmAction("unblock");
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmTarget) return;
    try {
      setConfirmLoading(true);
      if (confirmAction === "block") {
        await blockUser(confirmTarget.id);
        toast.success(`${confirmTarget.name} blocked`);
      } else {
        await unblockUser(confirmTarget.id);
        toast.success(`${confirmTarget.name} unblocked`);
      }
      setConfirmOpen(false);
      setConfirmTarget(null);
      fetchUsers();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    setSort((prev) => nextSort(prev, field));
    setPage(1);
  };


  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Users"
        actions={[{ label: "Create User", onClick: handleCreate }]}
      />

      <AdminFilterBar
        canClear={!!search || !!roleFilter || !!statusFilter || sort !== DEFAULT_SORT}
        onClear={() => { setSearch(""); setRoleFilter(""); setStatusFilter(""); setSort(DEFAULT_SORT); setPage(1); }}
      >
        <AdminFilter label="Search" wide>
          <AdminSearchInput value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Name or email…" />
        </AdminFilter>
        <AdminFilterSelect
          label="Role"
          value={roleFilter}
          onChange={(v) => { setPage(1); setRoleFilter(v); }}
          allLabel="All roles"
          options={[{ value: "user" as UserRole, label: "User" }, { value: "admin" as UserRole, label: "Admin" }, { value: "salesPerson" as UserRole, label: "Sales person" }]}
        />
        <AdminFilterSelect
          label="Status"
          value={statusFilter}
          onChange={(v) => { setPage(1); setStatusFilter(v); }}
          options={[{ value: "active", label: "Active" }, { value: "blocked", label: "Blocked" }]}
        />
        <AdminFilter label="Sort by" width="sm:w-auto" fixed className="col-span-2 sm:col-span-1">
          <div className="flex gap-1.5">
            {(["name", "email", "role"] as SortField[]).map((field) => {
              const isActive = sort === field || sort === `-${field}`;
              const isDesc = sort === `-${field}`;
              return (
                <button
                  key={field}
                  type="button"
                  onClick={() => handleSort(field)}
                  aria-pressed={isActive}
                  className={`h-[42px] px-3.5 inline-flex items-center gap-1 text-sm font-semibold rounded-full border cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#6D35D9] text-white border-[#6D35D9]"
                      : "bg-white border-[#E4DDF2] text-[#655B7E] hover:border-[#CBB9F0] hover:text-[#6D35D9]"
                  }`}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <SortIcon active={isActive} desc={isDesc} />
                </button>
              );
            })}
          </div>
        </AdminFilter>
      </AdminFilterBar>

      {/* ── Table ── */}
      {loading ? (
        <TopLoader loading={loading} />
      ) : (
        <AdminTable
          data={users}
          columns={columns}
          actions={[
            {
              label: "Edit",
              onClick: handleEdit,
              className: "text-sm font-medium cursor-pointer text-gray-600 hover:text-[#6D35D9]",
            },
            {
              label: (u) => (u.isBlocked ? "Unblock" : "Block"),
              onClick: (u) => (u.isBlocked ? openUnblockConfirm(u) : openBlockConfirm(u)),
              className: (u) =>
                u.isBlocked
                  ? "text-sm font-medium cursor-pointer text-green-600 hover:opacity-80"
                  : "text-sm font-medium cursor-pointer text-red-500 hover:opacity-80",
            },
          ]}
          getRowId={(u) => u.id}
        />
      )}

      {/* ── Pagination ── */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        description={<>{total} user{total !== 1 ? "s" : ""}</>}
      />

      {/* ── Form Modal ── */}
      <UserFormModal
        open={modalOpen}
        mode={mode}
        initialData={editing}
        loading={submitting}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        onSubmit={handleFormSubmit}
      />

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        open={confirmOpen}
        title={confirmAction === "block" ? "Block User" : "Unblock User"}
        message={
          confirmAction === "block"
            ? `Are you sure you want to block ${confirmTarget?.name}? They will not be able to log in.`
            : `Are you sure you want to unblock ${confirmTarget?.name}? They will regain access.`
        }
        confirmLabel={confirmAction === "block" ? "Block" : "Unblock"}
        confirmVariant={confirmAction === "block" ? "danger" : "warning"}
        loading={confirmLoading}
        onConfirm={handleConfirm}
        onClose={() => { setConfirmOpen(false); setConfirmTarget(null); }}
      />
    </AdminPageContainer>
  );
}
