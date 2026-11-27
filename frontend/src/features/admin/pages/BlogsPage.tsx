import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminFilter, AdminFilterBar, AdminFilterSelect, AdminPageSize, AdminSearchInput, AdminSelect, AdminActiveStatus, AdminBadge } from "../components/ui";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
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
      <AdminBadge tone={b.isFeatured ? "warning" : "neutral"} dot={false}>{b.isFeatured ? `⭐ #${b.priority ?? "—"}` : "No"}</AdminBadge>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (b) => (
      <AdminBadge tone={b.isDeleted ? "danger" : "success"}>{b.isDeleted ? "Blocked" : "Active"}</AdminBadge>
    ),
  },
];

/* ── component ────────────────────────────────────────────── */
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true); // starts loading: shows placeholder rows, not "No records found"
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


  /* status can be changed straight from the table */
  const tableColumns: typeof columns = columns.map((col) =>
    col.key === "status" ? { ...col, render: (b) => (
        <AdminActiveStatus
          active={!b.isDeleted}
          inactiveLabel="Blocked"
          confirmInactive={{ title: "Block this blog?", message: "It will be hidden from the website until unblocked.", confirmLabel: "Block" }}
          confirmActive={{ title: "Unblock this blog?", message: "It will show on the website again.", confirmLabel: "Unblock" }}
          onChange={async (on) => {
            try {
              await (on ? unblockBlog(b.id) : blockBlog(b.id));
              toast.success(on ? "Blog unblocked" : "Blog blocked");
              fetchAll();
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
        title="Blogs"
        actions={[{ label: "New Blog Post", onClick: handleCreate }]}
      />

      <AdminFilterBar
        canClear={!!search || !!statusFilter || !!featuredFilter || sortValue !== "newest"}
        onClear={() => { setSearch(""); setStatusFilter(""); setFeaturedFilter(""); setSortValue("newest"); setPage(1); }}
      >
        <AdminFilter label="Search" wide>
          <AdminSearchInput value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Heading, author, topic…" />
        </AdminFilter>
        <AdminFilterSelect
          label="Status"
          value={statusFilter}
          onChange={(v) => { setPage(1); setStatusFilter(v); }}
          options={[{ value: "active", label: "Active" }, { value: "blocked", label: "Blocked" }]}
        />
        <AdminFilterSelect
          label="Featured"
          value={featuredFilter}
          onChange={(v) => { setPage(1); setFeaturedFilter(v); }}
          options={[{ value: "true", label: "Featured" }, { value: "false", label: "Not featured" }]}
        />
        <AdminFilter label="Sort" width="sm:w-48">
          <AdminSelect
            value={sortValue}
            onChange={(v) => { setPage(1); setSortValue(v); }}
            label="Sort"
            options={[{ value: "newest", label: "Newest first" }, { value: "oldest", label: "Oldest first" }, { value: "featured", label: "Featured + priority" }]}
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
        data={blogs}
        columns={tableColumns}
        actions={[
          { label: "Edit", onClick: handleEdit },
        ]}
        getRowId={(b) => b.id}
      />

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
