import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import {
  createChapter,
//   updateChapter,
  getChapters,
  getSubjectVariants,
  updateChapter,
} from "../../../api/chapter.api";
import { getClasses } from "../../../api/class.api";
import { getSyllabus } from "../../../api/syllabus.api";
import { getSubjects } from "../../../api/subject.api";
import ChapterFormModal from "../components/ChapterFormModal";

type ChapterRow = {
  _id: string;
  name: string;
  price: number;
  icon?: string;
  isDeleted: boolean;
  className: string;
  syllabusName: string;
  subjectName: string;

  // 🔴 REQUIRED FOR EDIT
  classId: string;
  syllabusId: string;
  subjectVariantId: string;
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

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [saving, setSaving] = useState(false);

  const [editingChapter, setEditingChapter] =
    useState<any | undefined>();

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

  /* ---------------- TABLE ---------------- */

  const columns: Column<ChapterRow>[] = [
    { key: "name", label: "Chapter", render: (c) => c.name },
    { key: "subject", label: "Subject", render: (c) => c.subjectName },
    { key: "class", label: "Class", render: (c) => c.className },
    { key: "syllabus", label: "Syllabus", render: (c) => c.syllabusName },
    { key: "price", label: "Price", render: (c) => `₹${c.price}` },
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

  /* ---------------- DATA ---------------- */

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
    } catch {
      toast.error("Failed to load chapters");
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
    const res = await getSubjectVariants({ syllabusId, classId });
    return res.rows.map((v) => ({
      _id: v._id,
      subjectName: v.subject.name,
    }));
  };

  useEffect(() => {
    fetchChapters();
  }, [page, limit, search, isDeleted, classId, syllabusId, subjectId]);

  useEffect(() => {
    Promise.all([
      getClasses({ page: 1, limit: 100 }),
      getSyllabus({ page: 1, limit: 100 }),
      getSubjects({ page: 1, limit: 100 }),
    ])
      .then(([c, s, sub]) => {
        setClassesList(c.rows);
        setSyllabusList(s.rows);
        setSubjectList(sub.rows);
      })
      .catch(() => toast.error("Failed to load filters"));
  }, []);

  /* ---------------- CREATE / EDIT ---------------- */

  const openCreate = () => {
    setFormMode("create");
    setEditingChapter(undefined);
    setFormOpen(true);
  };

  const openEdit = (row: ChapterRow) => {
    setFormMode("edit");
    setEditingChapter(row);
    setFormOpen(true);
  };

  const handleCreate = async (data: any) => {
    try {
      setSaving(true);
      await createChapter(data);
      toast.success("Chapter created");
      setFormOpen(false);
      fetchChapters();
    } catch {
            console.log("error creating chapter ",err);

    toast.error(err?.response?.data?.message || "Failed to create chapter");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (
  id: string,
  data: {
    name: string;
    price: number;
    subjectVariant: string;
    icon: string | null;
  }
) => {
  try {
    setSaving(true);

    await updateChapter(id, data);

    toast.success("Chapter updated");
    setFormOpen(false);
    fetchChapters();
  } catch (err: any) {
    console.log("error updating chapter ",err);
    
    toast.error(err?.response?.data?.message || "Failed to update chapter");
  } finally {
    setSaving(false);
  }
};


  /* ---------------- UI ---------------- */

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Chapters"
        actions={[{ label: "Create Chapter", onClick: openCreate }]}
      />
      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">

  {/* Syllabus */}
  <div className="flex flex-col gap-1 w-full md:w-auto">
    <label className="text-xs font-medium text-gray-600">Syllabus</label>
    <select
      value={syllabusId ?? ""}
      onChange={(e) => {
        setPage(1);
        setSyllabusId(e.target.value || undefined);
      }}
      className="w-full md:w-44 px-3 py-2 text-sm border border-gray-300 rounded
        focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
    >
      <option value="">All</option>
      {syllabusList.map((s) => (
        <option key={s._id} value={s._id}>
          {s.name}
        </option>
      ))}
    </select>
  </div>

  {/* Class */}
  <div className="flex flex-col gap-1 w-full md:w-auto">
    <label className="text-xs font-medium text-gray-600">Class</label>
    <select
      value={classId ?? ""}
      onChange={(e) => {
        setPage(1);
        setClassId(e.target.value || undefined);
      }}
      className="w-full md:w-40 px-3 py-2 text-sm border border-gray-300 rounded
        focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
    >
      <option value="">All</option>
      {classesList.map((c) => (
        <option key={c._id} value={c._id}>
          {c.name}
        </option>
      ))}
    </select>
  </div>

  {/* Subject */}
  <div className="flex flex-col gap-1 w-full md:w-auto">
    <label className="text-xs font-medium text-gray-600">Subject</label>
    <select
      value={subjectId ?? ""}
      onChange={(e) => {
        setPage(1);
        setSubjectId(e.target.value || undefined);
      }}
      className="w-full md:w-44 px-3 py-2 text-sm border border-gray-300 rounded
        focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
    >
      <option value="">All</option>
      {subjectList.map((s) => (
        <option key={s._id} value={s._id}>
          {s.name}
        </option>
      ))}
    </select>
  </div>

  {/* Status */}
  <div className="flex flex-col gap-1 w-full md:w-auto">
    <label className="text-xs font-medium text-gray-600">Status</label>
    <select
      value={isDeleted === undefined ? "" : isDeleted ? "deleted" : "active"}
      onChange={(e) => {
        setPage(1);
        if (e.target.value === "") setIsDeleted(undefined);
        else setIsDeleted(e.target.value === "deleted");
      }}
      className="w-full md:w-36 px-3 py-2 text-sm border border-gray-300 rounded
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


      {loading ? (
        <TopLoader loading />
      ) : (
        <AdminTable
          data={chapters}
          columns={columns}
          actions={[{ label: "Edit", onClick: openEdit }]}
          getRowId={(row) => row._id}
        />
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ChapterFormModal
        open={formOpen}
        mode={formMode}
        initialData={editingChapter}
        onClose={() => setFormOpen(false)}
        loading={saving}
        syllabuses={syllabusList}
        classes={classesList}
        fetchSubjectVariants={fetchSubjectVariants}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </AdminPageContainer>
  );
}
