import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminBadge, AdminFilter, AdminFilterBar, AdminPageSize, AdminSearchInput } from "../components/ui";
import NameFormModal from "../components/NameFormModal/NameFormModal";
import {
  getSyllabus,
  createSyllabus,
  updateSyllabus,
} from "../../../api/syllabus.api";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { SyllabusRow } from "../../../shared/types/syllabus.types";
export default function SyllabusPage() {
  const [syllabus, setSyllabus] = useState<SyllabusRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<SyllabusRow | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [isDeleted] = useState<boolean | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(1);

  const columns: Column<SyllabusRow>[] = [
    {
      key: "name",
      label: "Syllabus Name",
      render: (s) => s.name,
    },
    {
      key: "status",
      label: "Status",
      render: (s) => (
        <AdminBadge tone={s.isDeleted ? "danger" : "success"}>{s.isDeleted ? "Inactive" : "Active"}</AdminBadge>
      ),
    },
  ];
  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const res = await getSyllabus({
        page,
        limit,
        search: search || undefined,
        isDeleted,
      });
      setSyllabus(res.rows);
      setTotalPages(res.totalPages);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchSyllabus();
  }, [page, search, isDeleted, limit]);

  const handleCreate = () => {
    setMode("create");
    setEditing(undefined);
    setModalOpen(true);
  };

  const handleEdit = (row: SyllabusRow) => {
    setMode("edit");
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (data: { _id?: string; name: string }) => {
    try {
      setSubmitting(true);

      if (mode === "create") {
        await createSyllabus({ name: data.name });

        toast.success("Syllabus created");
      }

      if (mode === "edit" && data._id) {
        await updateSyllabus(data._id, {
          name: data.name,
        });

        toast.success("Syllabus updated");
      }

      setModalOpen(false);
      setMode("create");
      setEditing(undefined);
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
      await fetchSyllabus();
    }
  };

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Syllabus"
        actions={[
          {
            label: "Create Syllabus",
            onClick: handleCreate,
          },
        ]}
      />
      <AdminFilterBar
        canClear={!!search}
        onClear={() => { setSearch(""); setPage(1); }}
      >
        {/* Search */}
        <AdminFilter label="Search" wide>
          <AdminSearchInput
            value={search}
            onChange={(v) => {
              setPage(1);
              setSearch(v);
            }}
            placeholder="Search syllabuses…"
          />
        </AdminFilter>

        {/* Filter */}
        {/* <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            value={
              isDeleted === undefined ? "" : isDeleted ? "deleted" : "active"
            }
            onChange={(e) => {
              setPage(1);
              if (e.target.value === "") setIsDeleted(undefined);
              else setIsDeleted(e.target.value === "deleted");
            }}
            className="w-full md:w-40 px-3 py-2 text-sm border border-gray-300 rounded
                 focus:outline-none focus:ring-2 focus:ring-[#6D35D9]/30"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="deleted">Inactive</option>
          </select>
        </div> */}

        {/* Entries per page */}
        <AdminFilter label="Rows per page" width="sm:w-32">
          <AdminPageSize
            value={limit}
            onChange={(n) => {
              setPage(1);
              setLimit(n);
            }}
          />
        </AdminFilter>
      </AdminFilterBar>
      {loading ? (
        <TopLoader loading={loading} />
      ) : (
        <AdminTable
          data={syllabus}
          columns={columns}
          actions={[
            {
              label: "Edit",
              onClick: handleEdit,
            },
          ]}
          getRowId={(row) => row._id}
        />
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      <NameFormModal
        open={modalOpen}
        mode={mode}
        initialData={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={submitting}
        label="Syllabus Name"
        title="Syllabus"
      />
    </AdminPageContainer>
  );
}
