import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import {
  getBlogs,
  createBlog,
  updateBlog,
  blockBlog,
  unblockBlog,
} from "../../../api/blog.api";
import BlogModal from "../components/BlogModal";

import type { Blog, BlogPayload } from "../../../shared/types/blog.types";
/* ── columns ─────────────────────────────────────────────── */
const columns: Column<Blog>[] = [
  {
    key: "heading",
    label: "Heading",
    render: (b) => (
      <div>
        <p className="font-medium text-gray-900 max-w-xs line-clamp-1">{b.heading}</p>
        <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{b.description}</p>
      </div>
    ),
  },
  {
    key: "author",
    label: "Author",
    render: (b) => <span className="text-sm text-gray-700">{b.author}</span>,
  },
  {
    key: "slug",
    label: "Slug",
    render: (b) => (
      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
        {b.slug}
      </code>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (b) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          b.isDeleted
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {b.isDeleted ? "Blocked" : "Active"}
      </span>
    ),
  },
];

/* ── component ────────────────────────────────────────────── */
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Blog | undefined>();

  /* search / filter */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "blocked">("");

  /* pagination */
  const [page, setPage] = useState(1);
  const limit = 10;

  /* ── fetch ── */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const response = await getBlogs();
      setBlogs(response.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── client-side filtering ── */
  const filtered = blogs.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      b.heading.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === ""
        ? true
        : statusFilter === "blocked"
        ? b.isDeleted
        : !b.isDeleted;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  /* ── handlers ── */
  const handleCreate = () => {
    setMode("create");
    setEditing(undefined);
    setModalOpen(true);
  };

  const handleEdit = (b: Blog) => {
    setMode("edit");
    setEditing(b);
    setModalOpen(true);
  };

  const handleToggleBlock = async (b: Blog) => {
    try {
      if (b.isDeleted) {
        await unblockBlog(b.id);
        toast.success("Blog unblocked");
      } else {
        await blockBlog(b.id);
        toast.success("Blog blocked");
      }
      fetchAll();
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleSubmit = async (payload: BlogPayload) => {
    try {
      setSubmitting(true);
      if (mode === "create") {
        await createBlog(payload);
        toast.success("Blog published");
      } else if (editing) {
        await updateBlog(editing.id, payload);
        toast.success("Blog updated");
      }
      setModalOpen(false);
      setEditing(undefined);
      fetchAll();
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const sel =
    "px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30";

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Blogs"
        actions={[{ label: "New Blog Post", onClick: handleCreate }]}
      />

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search by heading, author, description…"
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
            <option value="blocked">Blocked</option>
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
            {
              label: (b) => (b.isDeleted ? "Unblock" : "Block"),
              onClick: handleToggleBlock,
              className: (b) =>
                b.isDeleted
                  ? "text-sm font-medium cursor-pointer text-green-600 hover:opacity-80"
                  : "text-sm font-medium cursor-pointer text-red-500 hover:opacity-80",
            },
          ]}
          getRowId={(b) => b.id}
        />
      )}

      {/* ── Pagination ── */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        description={<>{filtered.length} post{filtered.length !== 1 ? "s" : ""}</>}
      />

      {/* ── Modal ── */}
      <BlogModal
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
