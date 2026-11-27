import { useEffect, useState } from "react";
import type { StatusTone } from "../components/ui";
import toast from "react-hot-toast";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminFilter, AdminFilterBar, AdminFilterSelect, AdminSearchInput, AdminActiveStatus, AdminBadge } from "../components/ui";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import UserFormModal from "../components/UserFormModal";
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

const ROLE_TONES: Record<UserRole, StatusTone> = {
  user: "info",
  admin: "violet",
  salesPerson: "warning",
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
      <AdminBadge tone={ROLE_TONES[u.role]}>{ROLE_LABELS[u.role]}</AdminBadge>
    ),
  },
  {
    key: "verified",
    label: "Verified",
    render: (u) => (
      <AdminBadge tone={u.isVerified ? "success" : "neutral"}>{u.isVerified ? "Yes" : "No"}</AdminBadge>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (u) => (
      <AdminBadge tone={u.isBlocked ? "danger" : "success"}>{u.isBlocked ? "Blocked" : "Active"}</AdminBadge>
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
  const [loading, setLoading] = useState(true); // starts loading: shows placeholder rows, not "No records found"
  const [submitting, setSubmitting] = useState(false);

  /* form modal */
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<AdminUser | undefined>();

  /* confirm modal */

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




  const handleSort = (field: SortField) => {
    setSort((prev) => nextSort(prev, field));
    setPage(1);
  };


  /* status can be changed straight from the table */
  const tableColumns: typeof columns = columns.map((col) =>
    col.key === "status" ? { ...col, render: (u) => (
        <AdminActiveStatus
          active={!u.isBlocked}
          inactiveLabel="Blocked"
          confirmInactive={{ title: `Block ${u.name}?`, message: "They won't be able to log in to the admin panel until unblocked.", confirmLabel: "Block" }}
          confirmActive={{ title: `Unblock ${u.name}?`, message: "They will be able to log in to the admin panel again.", confirmLabel: "Unblock" }}
          onChange={async (on) => {
            try {
              await (on ? unblockUser(u.id) : blockUser(u.id));
              toast.success(`${u.name} ${on ? "unblocked" : "blocked"}`);
              fetchUsers();
            } catch (err: unknown) {
              handleApiError(err);
            }
          }}
        />
      ) } : col,
  );

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
      {/* table stays on screen while loading, so it never jumps */}
      <AdminTable
        loading={loading}
        data={users}
        columns={tableColumns}
        actions={[
          {
            label: "Edit",
            onClick: handleEdit,
            className: "text-sm font-medium cursor-pointer text-gray-600 hover:text-[#6D35D9]",
          },
        ]}
        getRowId={(u) => u.id}
      />

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
    </AdminPageContainer>
  );
}
