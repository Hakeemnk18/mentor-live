import { useEffect, useState } from "react";
import type { StatusTone } from "../components/ui";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminFilter, AdminFilterBar, AdminFilterSelect, AdminPageSize, AdminSearchInput, AdminSelect, AdminStatusSelect, AdminBadge } from "../components/ui";
import type { StatusOption } from "../components/ui";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import { getLeads, updateLeadStatus } from "../../../api/lead.api";
import type { Lead, LeadStatus, LeadType } from "../../../shared/types/lead.types";
import Tooltip from "../../../shared/components/Tooltip";

/* ── helpers ─────────────────────────────────────────────── */
const TYPE_TONES: Record<LeadType, StatusTone> = {
  inquiry: "info",
  request: "violet",
};

/** status choices shown in the table (New → Contacted → Resolved, can be changed back) */
const LEAD_STATUS_OPTIONS: StatusOption<LeadStatus>[] = [
  { value: "new", label: "New", tone: "info" },
  { value: "contacted", label: "Contacted", tone: "warning" },
  { value: "resolved", label: "Resolved", tone: "success" },
];

const LEAD_STATUS_TONES: Record<LeadStatus, StatusTone> = {
  new: "warning",
  contacted: "info",
  resolved: "success",
};

/* ── columns ─────────────────────────────────────────────── */
const columns: Column<Lead>[] = [
  {
    key: "contact",
    label: "Contact",
    render: (l) => (
      <div>
        <p className="font-medium text-gray-900 text-sm">{l.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{l.phone}</p>
        {l.email && <p className="text-xs text-gray-400">{l.email}</p>}
      </div>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (l) => (
      <AdminBadge tone={TYPE_TONES[l.type]} className="capitalize">{l.type}</AdminBadge>
    ),
  },
  {
    key: "purpose",
    label: "Purpose / Message",
    render: (l) => {
      const academicInfo =
        l.type === "request" && l.className
          ? `${l.className}${l.syllabusName ? ` · ${l.syllabusName}` : ""}`
          : null;

      return (
        <Tooltip
          className="max-w-[260px] cursor-help"
          content={
            <div className="space-y-1.5">
              <p>{l.purpose}</p>
              {academicInfo && <p className="text-gray-400">{academicInfo}</p>}
              {l.message && <p className="italic text-gray-400">"{l.message}"</p>}
            </div>
          }
        >
          <p className="text-sm text-gray-700 line-clamp-2">{l.purpose}</p>
          {academicInfo && (
            <p className="text-xs text-gray-400 mt-0.5">{academicInfo}</p>
          )}
          {l.message ? (
            <p className="text-xs text-gray-500 mt-1 italic line-clamp-2 bg-gray-50 px-2 py-1 rounded">
              "{l.message}"
            </p>
          ) : (
            <p className="text-xs text-gray-300 mt-1 italic">No message</p>
          )}
        </Tooltip>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (l) => (
      <AdminBadge tone={LEAD_STATUS_TONES[l.status]} className="capitalize">{l.status}</AdminBadge>
    ),
  },
  {
    key: "date",
    label: "Received",
    render: (l) => (
      <span className="text-xs text-gray-500">
        {new Date(l.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
];

/* ── component ────────────────────────────────────────────── */
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true); // starts loading: shows placeholder rows, not "No records found"

  /* filters */
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<LeadType | "">("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [sortValue, setSortValue] = useState("newest");

  /* pagination */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);

  /* ── fetch ── */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await getLeads({
        page,
        limit,
        search: search || undefined,
        sort: sortValue,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      });
      setLeads(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAll(); }, [page, limit, search, typeFilter, statusFilter, sortValue]);

  /* ── status update ── */
  const handleStatusChange = async (lead: Lead, status: LeadStatus) => {
    try {
      await updateLeadStatus(lead.id, status);
      toast.success(`Marked as ${status}`);
      fetchAll();
    } catch (err: unknown) {
      handleApiError(err);
    }
  };


  /* status can be changed straight from the table */
  const tableColumns: typeof columns = columns.map((col) =>
    col.key === "status"
      ? {
          ...col,
          render: (l: Lead) => (
            <AdminStatusSelect<LeadStatus>
              label="Lead status"
              value={l.status}
              options={LEAD_STATUS_OPTIONS}
              onChange={(next) => handleStatusChange(l, next)}
            />
          ),
        }
      : col,
  );

  return (
    <AdminPageContainer>
      <AdminPageActions title="Leads" actions={[]} />

      <AdminFilterBar
        canClear={!!search || !!typeFilter || !!statusFilter || sortValue !== "newest"}
        onClear={() => { setSearch(""); setTypeFilter(""); setStatusFilter(""); setSortValue("newest"); setPage(1); }}
      >
        <AdminFilter label="Search" wide>
          <AdminSearchInput value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Name, phone, purpose…" />
        </AdminFilter>
        <AdminFilterSelect
          label="Type"
          value={typeFilter}
          onChange={(v) => { setPage(1); setTypeFilter(v); }}
          options={[{ value: "inquiry" as LeadType, label: "Inquiry" }, { value: "request" as LeadType, label: "Request" }]}
          allLabel="All types"
        />
        <AdminFilterSelect
          label="Status"
          value={statusFilter}
          onChange={(v) => { setPage(1); setStatusFilter(v); }}
          options={[{ value: "new" as LeadStatus, label: "New" }, { value: "contacted" as LeadStatus, label: "Contacted" }, { value: "resolved" as LeadStatus, label: "Resolved" }]}
        />
        <AdminFilter label="Sort">
          <AdminSelect
            value={sortValue}
            onChange={(v) => { setPage(1); setSortValue(v); }}
            label="Sort"
            options={[{ value: "newest", label: "Newest first" }, { value: "oldest", label: "Oldest first" }]}
          />
        </AdminFilter>
        <AdminFilter label="Rows per page" width="sm:w-32">
          <AdminPageSize value={limit} onChange={(n) => { setPage(1); setLimit(n); }} />
        </AdminFilter>
      </AdminFilterBar>

      {/* ── Table ── */}
      {/* table stays on screen while loading, so it never jumps */}
      <AdminTable
        loading={loading}
        data={leads}
        columns={tableColumns}
        getRowId={(l) => l.id}
      />

      {/* ── Pagination ── */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        description={<>{total} lead{total !== 1 ? "s" : ""}</>}
      />
    </AdminPageContainer>
  );
}
