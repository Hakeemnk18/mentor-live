import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminFilter, AdminFilterBar, AdminFilterSelect, AdminPageSize, AdminSearchInput, AdminSelect } from "../components/ui";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import { getLeads, updateLeadStatus } from "../../../api/lead.api";
import type { Lead, LeadStatus, LeadType } from "../../../shared/types/lead.types";
import Tooltip from "../../../shared/components/Tooltip";

/* ── helpers ─────────────────────────────────────────────── */
const TYPE_COLORS: Record<LeadType, string> = {
  inquiry: "bg-blue-100 text-blue-700",
  request: "bg-purple-100 text-purple-700",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
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
      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${TYPE_COLORS[l.type]}`}>
        {l.type}
      </span>
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
      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${STATUS_COLORS[l.status]}`}>
        {l.status}
      </span>
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
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      setUpdatingId(lead.id);
      await updateLeadStatus(lead.id, status);
      toast.success(`Marked as ${status}`);
      fetchAll();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setUpdatingId(null);
    }
  };


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
      {loading ? (
        <TopLoader loading={loading} />
      ) : (
        <AdminTable
          data={leads}
          columns={columns}
          actions={[
            {
              label: (l) =>
                l.status === "new"
                  ? "Mark Contacted"
                  : l.status === "contacted"
                  ? "Mark Resolved"
                  : "Reopen",
              onClick: (l) => {
                const next: LeadStatus =
                  l.status === "new"
                    ? "contacted"
                    : l.status === "contacted"
                    ? "resolved"
                    : "new";
                handleStatusChange(l, next);
              },
              className: (l) => {
                if (updatingId === l.id) return "text-sm font-medium text-gray-400 cursor-not-allowed";
                if (l.status === "resolved") return "text-sm font-medium cursor-pointer text-gray-500 hover:opacity-80";
                if (l.status === "contacted") return "text-sm font-medium cursor-pointer text-green-600 hover:opacity-80";
                return "text-sm font-medium cursor-pointer text-blue-600 hover:opacity-80";
              },
            },
          ]}
          getRowId={(l) => l.id}
        />
      )}

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
