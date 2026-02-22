import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import TopLoader from "../../../shared/components/TopLoader";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import type { Testimonial, TestimonialPayload } from "../../../api/testimonial.api";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../../api/testimonial.api";
import TestimonialModal from "../components/TestimonialModal";

/* ── columns ─────────────────────────────────────────────── */
const columns: Column<Testimonial>[] = [
  {
    key: "author",
    label: "Author",
    render: (t) => (
      <div>
        <p className="font-medium text-gray-900">{t.author}</p>
        <p className="text-xs text-gray-400">{t.designation}</p>
      </div>
    ),
  },
  {
    key: "comment",
    label: "Comment",
    render: (t) => (
      <p className="text-sm text-gray-700 max-w-sm line-clamp-2">{t.comment}</p>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (t) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          t.isDeleted
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {t.isDeleted ? "Deleted" : "Active"}
      </span>
    ),
  },
];

/* ── component ────────────────────────────────────────────── */
export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Testimonial | undefined>();

  /* search / filter (client-side since API returns all) */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "deleted">("");

  /* pagination */
  const [page, setPage] = useState(1);
  const limit = 10;

  /* ── fetch ── */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── filtering (client-side) ── */
  const filtered = testimonials.filter((t) => {
    const matchesSearch =
      !search ||
      t.author.toLowerCase().includes(search.toLowerCase()) ||
      t.designation.toLowerCase().includes(search.toLowerCase()) ||
      t.comment.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === ""
        ? true
        : statusFilter === "deleted"
        ? t.isDeleted
        : !t.isDeleted;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  /* ── handlers ── */
  const handleCreate = () => {
    setMode("create");
    setEditing(undefined);
    setModalOpen(true);
  };

  const handleEdit = (t: Testimonial) => {
    setMode("edit");
    setEditing(t);
    setModalOpen(true);
  };

  const handleDelete = async (t: Testimonial) => {
    if (!window.confirm(`Delete testimonial by "${t.author}"?`)) return;
    try {
      await deleteTestimonial(t.id);
      toast.success("Testimonial deleted");
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  const handleSubmit = async (payload: TestimonialPayload) => {
    try {
      setSubmitting(true);
      if (mode === "create") {
        await createTestimonial(payload);
        toast.success("Testimonial created");
      } else if (editing) {
        await updateTestimonial(editing.id, payload);
        toast.success("Testimonial updated");
      }
      setModalOpen(false);
      setEditing(undefined);
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const sel =
    "px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30";

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Testimonials"
        actions={[{ label: "Add Testimonial", onClick: handleCreate }]}
      />

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search by author, designation, comment…"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any); }}
            className={sel}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <TopLoader loading={loading} />
      ) : (
        <AdminTable
          data={paginated}
          columns={columns}
          actions={[
            { label: "Edit", onClick: handleEdit },
            { label: "Delete", onClick: handleDelete },
          ]}
          getRowId={(t) => t.id}
        />
      )}

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages} &nbsp;·&nbsp; {filtered.length} testimonial{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      <TestimonialModal
        open={modalOpen}
        mode={mode}
        initialData={editing}
        loading={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </AdminPageContainer>
  );
}
