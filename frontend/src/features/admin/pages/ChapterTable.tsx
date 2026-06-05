import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import type { Column } from "../components/AdminTable";
import {
  createChapter,
  getChapters,
  updateChapter,
  getChapterById,
} from "../../../api/chapter.api";
import { getClasses } from "../../../api/class.api";
import { getSyllabus } from "../../../api/syllabus.api";
import { getSubjects } from "../../../api/subject.api";
import { getFacultiesByChapter } from "../../../api/faculty.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import ChapterFormModal from "../components/ChapterFormModal";
import type { ChapterRow, ChapterInitialData, CreateChapterPayload } from "../../../shared/types/chapter.types";
import type { FacultyListItem } from "../../../shared/types/faculty.types";
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
    useState<ChapterInitialData | undefined>();

  const [chapterFaculties, setChapterFaculties] = useState<FacultyListItem[]>([]);
  const [facultiesLoading, setFacultiesLoading] = useState(false);

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
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchChapters(); }, [page, limit, search, isDeleted, classId, syllabusId, subjectId]);

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
      .catch(handleApiError);
  }, []);

  /* ---------------- CREATE / EDIT ---------------- */

  const openCreate = () => {
    setFormMode("create");
    setEditingChapter(undefined);
    setFormOpen(true);
  };

  const openEdit = async (row: ChapterRow) => {
    setFormMode("edit");
    setChapterFaculties([]);
    setFormOpen(true);

    // fetch full chapter details and faculties in parallel
    try {
      setFacultiesLoading(true);

      const [chapterData, facultiesRes] = await Promise.all([
        getChapterById(row._id),
        getFacultiesByChapter({ chapterId: row._id }),
      ]);

      setEditingChapter(chapterData);
      setChapterFaculties(facultiesRes.data ?? []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setFacultiesLoading(false);
    }
  };

  const handleCreate = async (data: CreateChapterPayload) => {
    try {
      setSaving(true);
      await createChapter(data);
      fetchChapters();
    } catch (err: unknown) {
      console.log("error creating chapter ", err);
      handleApiError(err);
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
      icon: { url: string; publicId: string };
    }
  ) => {
    try {
      setSaving(true);
      await updateChapter(id, data);
      fetchChapters();
    } catch (err: unknown) {
      console.log("error updating chapter ", err);
      handleApiError(err);
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
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">

        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-45">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          />
        </div>

        {/* Syllabus */}
        <div className="flex flex-col gap-1 min-w-37.5">
          <label className="text-xs font-medium text-gray-600">Syllabus</label>
          <select
            value={syllabusId ?? ""}
            onChange={(e) => { setPage(1); setSyllabusId(e.target.value || undefined); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          >
            <option value="">All</option>
            {syllabusList.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Class */}
        <div className="flex flex-col gap-1 min-w-32.5">
          <label className="text-xs font-medium text-gray-600">Class</label>
          <select
            value={classId ?? ""}
            onChange={(e) => { setPage(1); setClassId(e.target.value || undefined); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          >
            <option value="">All</option>
            {classesList.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1 min-w-37.5">
          <label className="text-xs font-medium text-gray-600">Subject</label>
          <select
            value={subjectId ?? ""}
            onChange={(e) => { setPage(1); setSubjectId(e.target.value || undefined); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          >
            <option value="">All</option>
            {subjectList.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1 min-w-30">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            value={isDeleted === undefined ? "" : isDeleted ? "deleted" : "active"}
            onChange={(e) => {
              setPage(1);
              if (e.target.value === "") setIsDeleted(undefined);
              else setIsDeleted(e.target.value === "deleted");
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="deleted">Inactive</option>
          </select>
        </div>

        {/* Per Page */}
        <div className="flex flex-col gap-1 min-w-25">
          <label className="text-xs font-medium text-gray-600">Per Page</label>
          <select
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
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
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        faculties={chapterFaculties}
        facultiesLoading={facultiesLoading}
      />
    </AdminPageContainer>
  );
}
