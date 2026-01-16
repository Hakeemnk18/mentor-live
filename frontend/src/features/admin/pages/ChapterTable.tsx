import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import TopLoader from "../../../shared/components/TopLoader";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import { createChapter, getChapters } from "../../../api/chapter.api";
import { getClasses } from "../../../api/class.api";
import { getSyllabus } from "../../../api/syllabus.api";
import { getSubjects } from "../../../api/subject.api";
import CreateChapterModal from "../components/CreateChapterModal";

type ChapterRow = {
  _id: string;
  name: string;
  price: number;
  icon?: string;
  isDeleted: boolean;
  className: string;
  syllabusName: string;
  subjectName: string;
};

export default function ChapterPage() {
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(undefined);

  const [classId, setClassId] = useState<string | undefined>();
  const [syllabusId, setSyllabusId] = useState<string | undefined>();
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [classesList, setClassesList] = useState<
    { _id: string; name: string }[]
  >([]);
  const [syllabusList, setSyllabusList] = useState<
    { _id: string; name: string }[]
  >([]);
  const [subjectList, setSubjectList] = useState<
    { _id: string; name: string }[]
  >([]);

  const columns: Column<ChapterRow>[] = [
    {
      key: "name",
      label: "Chapter",
      render: (c) => c.name,
    },
    {
      key: "subject",
      label: "Subject",
      render: (c) => c.subjectName,
    },
    {
      key: "class",
      label: "Class",
      render: (c) => c.className,
    },
    {
      key: "syllabus",
      label: "Syllabus",
      render: (c) => c.syllabusName,
    },
    {
      key: "price",
      label: "Price",
      render: (c) => `₹${c.price}`,
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

  const fetchChapters = async () => {
    try {
      setLoading(true);

      const res = await getChapters({
        page,
        limit,
        search: search || undefined,
        classId,
        syllabusId,
        subjectId,
        isDeleted,
      });

      setChapters(res.rows);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      console.log("error fetching chapters ", err);
      toast.error(err?.response?.data?.message || "Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };
  const fetchSubjectVariants = async ({
    syllabusId,
    classId,
  }: {
    syllabusId: string;
    classId: string;
  }) => {
    const res = await getSubjectVariants({
      syllabusId,
      classId,
    });

    return res.rows.map((v) => ({
      _id: v._id,
      subjectName: v.subject.name,
    }));
  };

  useEffect(() => {
    const fetchFiltersMeta = async () => {
      try {
        const [classRes, syllabusRes, subjectRes] = await Promise.all([
          getClasses({ page: 1, limit: 100 }),
          getSyllabus({ page: 1, limit: 100 }),
          getSubjects({ page: 1, limit: 100 }),
        ]);

        setClassesList(classRes.rows);
        setSyllabusList(syllabusRes.rows);
        setSubjectList(subjectRes.rows);
      } catch {
        toast.error("Failed to load filters");
      }
    };

    fetchFiltersMeta();
  }, []);

  useEffect(() => {
    fetchChapters();
  }, [page, limit, search, isDeleted, classId, syllabusId, subjectId]);
  const handleCreateChapter = async (data: {
    name: string;
    price: number;
    subjectVariant: string;
    icon: string;
  }) => {
    try {
      setCreating(true);

      await createChapter({
        name: data.name,
        price: data.price,
        subjectVariant: data.subjectVariant,
        icon: data.icon,
      });

      toast.success("Chapter created successfully");
      setCreateOpen(false);
      fetchChapters();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create chapter");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Chapters"
        actions={[
          {
            label: "Create Chapter",
            onClick: () => setCreateOpen(true),
          },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        {/* Search */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search chapters..."
            className="w-full md:w-56 px-3 py-2 text-sm border rounded
        focus:ring-2 focus:ring-[#DB313E]/30"
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Subject</label>
          <select
            value={subjectId ?? ""}
            onChange={(e) => {
              setPage(1);
              setSubjectId(e.target.value || undefined);
            }}
            className="px-3 py-2 text-sm border rounded"
          >
            <option value="">All Subjects</option>
            {subjectList.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Class */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Class</label>
          <select
            value={classId ?? ""}
            onChange={(e) => {
              setPage(1);
              setClassId(e.target.value || undefined);
            }}
            className="px-3 py-2 text-sm border rounded"
          >
            <option value="">All Classes</option>
            {classesList.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Syllabus */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Syllabus</label>
          <select
            value={syllabusId ?? ""}
            onChange={(e) => {
              setPage(1);
              setSyllabusId(e.target.value || undefined);
            }}
            className="px-3 py-2 text-sm border rounded"
          >
            <option value="">All Syllabus</option>
            {syllabusList.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            value={
              isDeleted === undefined ? "" : isDeleted ? "deleted" : "active"
            }
            onChange={(e) => {
              setPage(1);
              setIsDeleted(
                e.target.value === "" ? undefined : e.target.value === "deleted"
              );
            }}
            className="px-3 py-2 text-sm border rounded"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="deleted">Inactive</option>
          </select>
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Entries</label>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="px-3 py-2 text-sm border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        {/* Clear Filters */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 opacity-0">
            Clear
          </label>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setClassId(undefined);
              setSyllabusId(undefined);
              setSubjectId(undefined);
              setIsDeleted(undefined);
              setPage(1);
            }}
            className="
      px-4 py-2 text-sm
      border border-gray-300 rounded
      text-gray-700
      cursor-pointer
      bg-white
      hover:bg-gray-100
      transition-colors
    "
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TopLoader loading />
      ) : (
        <AdminTable
          data={chapters}
          columns={columns}
          actions={[
            {
              label: "Edit",
              onClick: (row) => toast(`Edit ${row.name}`),
            },
          ]}
          getRowId={(row) => row._id}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <CreateChapterModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        loading={creating}
        syllabuses={syllabusList}
        classes={classesList}
        fetchSubjectVariants={fetchSubjectVariants}
        onCreate={handleCreateChapter}
      />
    </AdminPageContainer>
  );
}
