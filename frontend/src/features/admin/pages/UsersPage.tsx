import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
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
  const [sort, setSort] = useState("createdAt");

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
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (err: any) {
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
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    setSort((prev) => nextSort(prev, field));
    setPage(1);
  };

  const sel =
    "px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30";

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Users"
        actions={[{ label: "Create User", onClick: handleCreate }]}
      />

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row md:items-end gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 flex-wrap">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Name or email…"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          />
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Role</label>
          <select
            value={roleFilter}
            onChange={(e) => { setPage(1); setRoleFilter(e.target.value as UserRole | ""); }}
            className={sel}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="salesPerson">Sales Person</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value as "" | "active" | "blocked"); }}
            className={sel}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Sort by</label>
          <div className="flex gap-1">
            {(["name", "email", "role"] as SortField[]).map((field) => {
              const isActive = sort === field || sort === `-${field}`;
              const isDesc = sort === `-${field}`;
              return (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`px-3 py-2 text-xs rounded border transition ${
                    isActive
                      ? "bg-[#DB313E] text-white border-[#DB313E]"
                      : "border-gray-300 text-gray-600 hover:border-[#DB313E] hover:text-[#DB313E]"
                  }`}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <SortIcon active={isActive} desc={isDesc} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
              className: "text-sm font-medium cursor-pointer text-gray-600 hover:text-[#DB313E]",
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
