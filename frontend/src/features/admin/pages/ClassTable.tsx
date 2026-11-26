import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminBadge, AdminFilter, AdminFilterBar, AdminPageSize, AdminSearchInput } from "../components/ui";
import { createClass, updateClass, getClasses } from "../../../api/class.api";
import toast from "react-hot-toast";
import TopLoader from "../../../shared/components/TopLoader";
import Pagination from "../../../shared/components/Pagination";
import type { Column } from "../components/AdminTable";
import NameFormModal from "../components/NameFormModal/NameFormModal";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import type { ClassRow } from "../../../shared/types/class.types";
export default function ClassPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingClass, setEditingClass] = useState<ClassRow | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [isDeleted] = useState<boolean | undefined>(undefined);

  const [totalPages, setTotalPages] = useState(1);

  const columns: Column<ClassRow>[] = [
    {
      key: "name",
      label: "Class Name",
      render: (c) => c.name,
    },
    {
      key: "status",
      label: "Status",
      render: (c) => (
        <AdminBadge tone={c.isDeleted ? "danger" : "success"}>{c.isDeleted ? "Inactive" : "Active"}</AdminBadge>
      ),
    },
  ];
  const fetchClasses = async () => {
    try {
      setLoading(true);

      const res = await getClasses({
        page,
        limit,
        search: search || undefined,
        isDeleted,
      });
      console.log("response from getClasses", res);
      setClasses(res.rows);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      console.log("error fetching classes", err);
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchClasses(); }, [page, search, isDeleted, limit]);

  const handleCreate = () => {
    setMode("create");
    setEditingClass(undefined);
    setModalOpen(true);
  };

  const handleEdit = (cls: ClassRow) => {
    setMode("edit");
    setEditingClass(cls);
    setModalOpen(true);
  };

  const handleSubmit = async (data: { _id?: string; name: string }) => {
    try {
      setSubmitting(true);

      if (mode === "create") {
        await createClass({ name: data.name });
        toast.success("Class created successfully");
      }

      if (mode === "edit" && data._id) {
        await updateClass(data._id, { name: data.name });
        toast.success("Class updated successfully");
      }

      setModalOpen(false);
      setEditingClass(undefined);
      setMode("create");

      await fetchClasses();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Classes"
        actions={[
          {
            label: "Create Class",
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
            placeholder="Search classes…"
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
          data={classes}
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
        initialData={editingClass}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={submitting}
        title="Class"
        label="Class Name"
      />
    </AdminPageContainer>
  );
}
