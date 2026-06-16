import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import {
  getBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerShow,
} from "../../../api/banner.api";
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
    render: (b) =>
      b.priority != null ? (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
          {b.priority}
        </span>
      ) : (
        <span className="text-xs text-gray-400">—</span>
      ),
  },
  {
    key: "isShow",
    label: "Visibility",
    render: (b) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          b.isShow ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        }`}
      >
        {b.isShow ? "Visible" : "Hidden"}
      </span>
    ),
  },
];

/* ── toggle-show confirmation state ─────────────────────── */
type ToggleTarget = { banner: Banner; nextShow: boolean; priority?: number };

/* ── component ────────────────────────────────────────────── */
export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* form modal */
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Banner | undefined>();

  /* confirm delete */
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* confirm toggle visibility */
  const [toggleTarget, setToggleTarget] = useState<ToggleTarget | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  /* priority prompt when showing a no-priority banner */
  const [priorityPrompt, setPriorityPrompt] = useState<Banner | null>(null);
  const [promptedPriority, setPromptedPriority] = useState<number | "">("");

  /* search / filter */
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"" | "visible" | "hidden">("");

  /* pagination */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  /* ── fetch ── */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const isShow =
        visibilityFilter === "visible"
          ? true
          : visibilityFilter === "hidden"
          ? false
          : undefined;
      const res = await getBannersAdmin({
        page,
        limit,
        search: search || undefined,
        isShow,
        sort: "priority",
      });
      setBanners(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAll(); }, [page, search, visibilityFilter]);

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
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── visibility toggle ── */
  const handleToggleShow = (b: Banner) => {
    if (!b.isShow) {
      /* Turning ON — need a priority */
      if (b.priority != null) {
        setToggleTarget({ banner: b, nextShow: true, priority: b.priority });
      } else {
        /* No priority yet — prompt for one */
        setPromptedPriority("");
        setPriorityPrompt(b);
      }
    } else {
      setToggleTarget({ banner: b, nextShow: false });
    }
  };

  const confirmToggle = async () => {
    if (!toggleTarget) return;
    try {
      setToggleLoading(true);
      await toggleBannerShow(
        toggleTarget.banner.id,
        toggleTarget.nextShow,
        toggleTarget.priority,
      );
      toast.success(
        toggleTarget.nextShow ? "Banner is now visible" : "Banner is now hidden",
      );
      setToggleTarget(null);
      fetchAll();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setToggleLoading(false);
    }
  };

  const confirmPriorityPrompt = () => {
    if (!priorityPrompt || promptedPriority === "") return;
    setToggleTarget({ banner: priorityPrompt, nextShow: true, priority: Number(promptedPriority) });
    setPriorityPrompt(null);
    setPromptedPriority("");
  };

  /* ── delete ── */
  const handleDeleteClick = (b: Banner) => setDeleteTarget(b);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteBanner(deleteTarget.id);
      toast.success("Banner deleted");
      setDeleteTarget(null);
      fetchAll();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  /* Taken priorities for the priority prompt (excluding banner being changed) */
  const takenPriorities = new Set(
    banners.filter((b) => b.isShow && b.priority != null && b.id !== priorityPrompt?.id).map((b) => b.priority as number),
  );
  const availableForPrompt = [1, 2, 3, 4, 5].filter((p) => !takenPriorities.has(p));

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
          <label className="text-xs font-medium text-gray-600">Visibility</label>
          <select
            value={visibilityFilter}
            onChange={(e) => { setPage(1); setVisibilityFilter(e.target.value as "" | "visible" | "hidden"); }}
            className={sel}
          >
            <option value="">All</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <TopLoader loading={loading} />
      ) : (
        <AdminTable
          data={banners}
          columns={columns}
          actions={[
            { label: "Edit", onClick: handleEdit },
            {
              label: (b) => (b.isShow ? "Hide" : "Show"),
              onClick: handleToggleShow,
              className: (b) =>
                b.isShow
                  ? "text-sm font-medium cursor-pointer text-amber-600 hover:opacity-80"
                  : "text-sm font-medium cursor-pointer text-green-600 hover:opacity-80",
            },
            {
              label: "Delete",
              onClick: handleDeleteClick,
              variant: "danger",
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
        description={<>{total} banner{total !== 1 ? "s" : ""}</>}
      />

      {/* ── Form Modal ── */}
      <BannerModal
        open={modalOpen}
        mode={mode}
        initialData={editing}
        existingBanners={banners}
        loading={submitting}
        onClose={() => { setModalOpen(false); setEditing(undefined); }}
        onSubmit={handleSubmit}
      />

      {/* ── Priority Prompt (Show banner that has no priority) ── */}
      {priorityPrompt && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPriorityPrompt(null)} />
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Set a Priority to Show</h2>
            <p className="text-sm text-gray-500 mb-4">
              This banner has no priority assigned. Choose a slot (1–5) to display it in the carousel.
            </p>
            <select
              value={promptedPriority}
              onChange={(e) => setPromptedPriority(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 mb-4"
            >
              <option value="">Select priority…</option>
              {availableForPrompt.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {availableForPrompt.length === 0 && (
              <p className="text-xs text-amber-600 mb-3">
                All 5 priority slots are taken. Hide another visible banner first.
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPriorityPrompt(null)}
                className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmPriorityPrompt}
                disabled={promptedPriority === "" || availableForPrompt.length === 0}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
              >
                Show Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Visibility Toggle ── */}
      <ConfirmModal
        open={!!toggleTarget}
        title={toggleTarget?.nextShow ? "Show Banner" : "Hide Banner"}
        message={
          toggleTarget?.nextShow
            ? `Make this banner visible to users at priority ${toggleTarget.priority}?`
            : "Hide this banner from users? It will remain in the list."
        }
        confirmLabel={toggleTarget?.nextShow ? "Show" : "Hide"}
        confirmVariant={toggleTarget?.nextShow ? "warning" : "danger"}
        loading={toggleLoading}
        onConfirm={confirmToggle}
        onClose={() => setToggleTarget(null)}
      />

      {/* ── Confirm Delete ── */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Banner"
        message={`Permanently delete this banner? This cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </AdminPageContainer>
  );
}
