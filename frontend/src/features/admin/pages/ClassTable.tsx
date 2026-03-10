import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { createClass, updateClass, getClasses } from "../../../api/class.api";
import toast from "react-hot-toast";
import TopLoader from "../../../shared/components/TopLoader";
import Pagination from "../../../shared/components/Pagination";
import type { Column } from "../components/AdminTable";
import NameFormModal from "../components/NameFormModal/NameFormModal";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import { handleApiError } from "../../../shared/utils/handle.api.error";
type ClassRow = {
  _id: string;
  name: string;
  isDeleted: boolean;
};

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
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(undefined);

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
        <span
          className={`px-2 py-1 rounded text-xs ${
            c.isDeleted
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {c.isDeleted ? "Inactive" : "Active"}
        </span>
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
    } catch (err: any) {
      console.log("error fetching classes", err);
      toast.error(err?.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page, search, isDeleted, limit]);

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
    } catch (err: any) {
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
      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        {/* Search */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full md:w-64 px-3 py-2 text-sm border border-gray-300 rounded
                 focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          />
        </div>

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
                 focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="deleted">Inactive</option>
          </select>
        </div> */}

        {/* Entries per page */}
       
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-xs font-medium text-gray-600">
            Entries Per Page
          </label>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="w-full md:w-32 px-3 py-2 text-sm border border-gray-300 rounded
                 focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
      </div>

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
