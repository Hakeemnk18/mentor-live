import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import {
  createSubject,
  updateSubject,
  getSubjects,
} from "../../../api/subject.api";
import toast from "react-hot-toast";
import TopLoader from "../../../shared/components/TopLoader";
import type { Column } from "../components/AdminTable";
import NameFormModal from "../components/NameFormModal/NameFormModal";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";

type SubjectRow = {
  _id: string;
  name: string;
  isDeleted: boolean;
};

export default function SubjectPage() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingSubject, setEditingSubject] = useState<SubjectRow | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(1);

  const columns: Column<SubjectRow>[] = [
    {
      key: "name",
      label: "Subject Name",
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

  const fetchSubjects = async () => {
    try {
      setLoading(true);

      const res = await getSubjects({
        page,
        limit,
        search: search || undefined,
        isDeleted,
      });

      setSubjects(res.rows);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      console.log("error fetching subjects ",err)
      toast.error(err?.response?.data?.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [page, limit, search, isDeleted]);

  const handleCreate = () => {
    setMode("create");
    setEditingSubject(undefined);
    setModalOpen(true);
  };

  const handleEdit = (subject: SubjectRow) => {
    setMode("edit");
    setEditingSubject(subject);
    setModalOpen(true);
  };

  const handleSubmit = async (data: { _id?: string; name: string }) => {
    try {
      setSubmitting(true);

      if (mode === "create") {
        await createSubject({ name: data.name });
        toast.success("Subject created successfully");
      }

      if (mode === "edit" && data._id) {
        await updateSubject(data._id, { name: data.name });
        toast.success("Subject updated successfully");
      }

      setModalOpen(false);
      setEditingSubject(undefined);
      setMode("create");

      await fetchSubjects();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Subjects"
        actions={[
          {
            label: "Create Subject",
            onClick: handleCreate,
          },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        {/* Search */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full md:w-64 px-3 py-2 text-sm border border-gray-300 rounded
              focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
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
        </div>

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

      {/* Table */}
      {loading ? (
        <TopLoader loading={loading} />
      ) : (
        <AdminTable
          data={subjects}
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

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-sm border rounded
              disabled:opacity-50 cursor-pointer hover:bg-gray-100"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-sm border rounded
              disabled:opacity-50 cursor-pointer hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <NameFormModal
        open={modalOpen}
        mode={mode}
        initialData={editingSubject}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={submitting}
        title="Subject"
        label="Subject Name"
      />
    </AdminPageContainer>
  );
}
