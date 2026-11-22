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
  getBlogsAdmin,
  createBlog,
  updateBlog,
  blockBlog,
  unblockBlog,
  getBlogById,
} from "../../../api/blog.api";
import BlogModal from "../components/BlogModal";

import type { Blog, BlogPayload } from "../../../shared/types/blog.types";

/* ── columns ─────────────────────────────────────────────── */
const columns: Column<Blog>[] = [
  {
    key: "heading",
    label: "Heading",
    render: (b) => (
      <div className="flex items-center gap-3">
        {b.image?.url ? (
          <img
            src={b.image.url}
            alt={b.heading}
            className="w-10 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-slate-400">
              {b.heading.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900 max-w-[220px] line-clamp-1">{b.heading}</p>
          <p className="text-xs text-gray-400 line-clamp-1 max-w-[220px]">{b.description}</p>
        </div>
      </div>
    ),
  },
  {
    key: "author",
    label: "Author",
    render: (b) => <span className="text-sm text-gray-700">{b.author}</span>,
  },
  {
    key: "topic",
    label: "Topic",
    render: (b) => (
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
        {b.topic || "—"}
      </span>
    ),
  },
  {
    key: "featured",
    label: "Featured",
    render: (b) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          b.isFeatured ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
        }`}
      >
        {b.isFeatured ? `⭐ #${b.priority ?? "—"}` : "No"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (b) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          b.isDeleted ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
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

  /* filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "blocked">("");
  const [featuredFilter, setFeaturedFilter] = useState<"" | "true" | "false">("");
  const [sortValue, setSortValue] = useState("newest");

  /* pagination */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);

  /* ── server-side fetch ── */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const isDeleted =
        statusFilter === "blocked" ? true : statusFilter === "active" ? false : undefined;
      const isFeatured =
        featuredFilter === "true" ? true : featuredFilter === "false" ? false : undefined;

      const res = await getBlogsAdmin({
        page,
        limit,
        search: search || undefined,
        sort: sortValue,
        isDeleted,
        isFeatured,
      });
      setBlogs(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAll(); }, [page, limit, search, statusFilter, featuredFilter, sortValue]);

  /* ── handlers ── */
  const handleCreate = () => {
    setMode("create");
    setEditing(undefined);
    setModalOpen(true);
  };

  const handleEdit = async (b: Blog) => {
    try {
      const full = await getBlogById(b.id);
      setMode("edit");
      setEditing(full as Blog);
      setModalOpen(true);
    } catch (err: unknown) {
      handleApiError(err);
    }
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
    } catch (err: unknown) {
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
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const sel =
    "px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6D35D9]/30";

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Blogs"
        actions={[{ label: "New Blog Post", onClick: handleCreate }]}
      />

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row md:items-end gap-3 rounded-2xl border border-[#E4DDF2] bg-[#FAF8FE] p-4 mb-4 flex-wrap">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Heading, author, topic…"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6D35D9]/30"
          />
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

        {/* Featured */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Featured</label>
          <select
            value={featuredFilter}
            onChange={(e) => { setPage(1); setFeaturedFilter(e.target.value as "" | "true" | "false"); }}
            className={sel}
          >
            <option value="">All</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
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
            <option value="featured">Featured + Priority</option>
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
          data={blogs}
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
        description={<>{total} post{total !== 1 ? "s" : ""}</>}
      />

      {/* ── Modal ── */}
      <BlogModal
        open={modalOpen}
        mode={mode}
        initialData={editing}
        loading={submitting}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        onSubmit={handleSubmit}
      />
    </AdminPageContainer>
  );
}
