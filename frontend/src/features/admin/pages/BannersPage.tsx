import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../../../api/banner.api";
import BannerModal from "../components/BannerModal";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { Banner, BannerPayload } from "../../../shared/types/banner.types";
/* ── columns ─────────────────────────────────────────────── */
const columns: Column<Banner>[] = [
  {
    key: "image",
    label: "Image",
    render: (b) => (
      <img
        src={b.image.url}
        alt="banner"
        className="h-14 w-28 object-cover rounded border border-gray-200"
      />
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (b) => (
      <p className="text-sm text-gray-700 max-w-xs line-clamp-2">{b.description}</p>
    ),
  },
  {
    key: "priority",
    label: "Priority",
    render: (b) => (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
        {b.priority}
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
        {b.isDeleted ? "Deleted" : "Active"}
      </span>
    ),
  },
];

/* ── component ────────────────────────────────────────────── */
export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Banner | undefined>();

  /* search / filter */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "deleted">("");

  /* pagination */
  const [page, setPage] = useState(1);
  const limit = 10;

  /* ── fetch ── */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      // Sort by priority ascending
      data.sort((a, b) => a.priority - b.priority);
      setBanners(data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── filtering ── */
  const filtered = banners.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search || b.description.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === ""
        ? true
        : statusFilter === "deleted"
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

  const handleEdit = (b: Banner) => {
    setMode("edit");
    setEditing(b);
    setModalOpen(true);
  };

  const handleDelete = async (b: Banner) => {
    if (!window.confirm(`Delete banner with priority ${b.priority}?`)) return;
    try {
      await deleteBanner(b.id);
      toast.success("Banner deleted");
      fetchAll();
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleSubmit = async (payload: BannerPayload) => {
    try {
      setSubmitting(true);
      if (mode === "create") {
        await createBanner(payload);
        toast.success("Banner created");
      } else if (editing) {
        await updateBanner(editing.id, payload);
        toast.success("Banner updated");
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
        title="Banners"
        actions={[{ label: "Add Banner", onClick: handleCreate }]}
      />

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search by description…"
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
          getRowId={(b) => b.id}
        />
      )}

      {/* ── Pagination ── */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        description={<>{filtered.length} banner{filtered.length !== 1 ? "s" : ""}</>}
      />

      {/* ── Modal ── */}
      <BannerModal
        open={modalOpen}
        mode={mode}
        initialData={editing}
        existingBanners={banners}
        loading={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </AdminPageContainer>
  );
}
