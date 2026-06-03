import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import { getLeads, updateLeadStatus } from "../../../api/lead.api";
import type { Lead, LeadStatus, LeadType } from "../../../shared/types/lead.types";

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
    render: (l) => (
      <div className="max-w-[220px]">
        <p className="text-sm text-gray-700 line-clamp-2">{l.purpose}</p>
        {l.type === "request" && l.className && (
          <p className="text-xs text-gray-400 mt-0.5">
            {l.className}{l.syllabusName ? ` · ${l.syllabusName}` : ""}
          </p>
        )}
        {l.message ? (
          <p className="text-xs text-gray-500 mt-1 italic line-clamp-2 bg-gray-50 px-2 py-1 rounded">
            "{l.message}"
          </p>
        ) : (
          <p className="text-xs text-gray-300 mt-1 italic">No message</p>
        )}
      </div>
    ),
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
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [page, limit, search, typeFilter, statusFilter, sortValue]);

  /* ── status update ── */
  const handleStatusChange = async (lead: Lead, status: LeadStatus) => {
    try {
      setUpdatingId(lead.id);
      await updateLeadStatus(lead.id, status);
      toast.success(`Marked as ${status}`);
      fetchAll();
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const sel =
    "px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30";

  return (
    <AdminPageContainer>
      <AdminPageActions title="Leads" actions={[]} />

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row md:items-end gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 flex-wrap">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Name, phone, purpose…"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => { setPage(1); setTypeFilter(e.target.value as any); }}
            className={sel}
          >
            <option value="">All Types</option>
            <option value="inquiry">Inquiry</option>
            <option value="request">Request</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any); }}
            className={sel}
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Sort</label>
          <select
            value={sortValue}
            onChange={(e) => { setPage(1); setSortValue(e.target.value); }}
            className={sel}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Per Page */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Per Page</label>
          <select
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
            className={sel}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

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
