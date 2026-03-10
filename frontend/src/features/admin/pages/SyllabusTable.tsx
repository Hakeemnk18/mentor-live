import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
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

type SyllabusRow = {
  _id: string;
  name: string;
  isDeleted: boolean;
};

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
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(undefined);
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
        <span
          className={`px-2 py-1 rounded text-xs ${
            s.isDeleted
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {s.isDeleted ? "Inactive" : "Active"}
        </span>
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
        const created = await createSyllabus({ name: data.name });

        toast.success("Syllabus created");
      }

      if (mode === "edit" && data._id) {
        const updated = await updateSyllabus(data._id, {
          name: data.name,
        });

        toast.success("Syllabus updated");
      }

      setModalOpen(false);
      setMode("create");
      setEditing(undefined);
    } catch (error: any) {
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
      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        {/* Search */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search syllabuses..."
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
