import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminFilter, AdminFilterBar, AdminFilterSelect, AdminPageSize, AdminSearchInput, AdminActiveStatus, AdminBadge } from "../components/ui";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import type { Column } from "../components/AdminTable";
import {
  createChapter,
  getChapters,
  updateChapter,
  getChapterById,
  blockChapter,
  unblockChapter,
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
  const [loading, setLoading] = useState(true); // starts loading: shows placeholder rows, not "No records found"

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
        <AdminBadge tone={c.isDeleted ? "danger" : "success"}>{c.isDeleted ? "Inactive" : "Active"}</AdminBadge>
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

  /* status can be changed straight from the table */
  const tableColumns: typeof columns = columns.map((col) =>
    col.key === "status" ? { ...col, render: (c) => (
        <AdminActiveStatus
          active={!c.isDeleted}
          confirmInactive={{ title: `Make "${c.name}" inactive?`, message: "This chapter will be hidden from the website until made active again.", confirmLabel: "Make inactive" }}
          confirmActive={{ title: `Make "${c.name}" active?`, message: "This chapter will show on the website again.", confirmLabel: "Make active" }}
          onChange={async (on) => {
            try {
              await (on ? unblockChapter(c._id) : blockChapter(c._id));
              toast.success(`${c.name} is now ${on ? "active" : "inactive"}`);
              fetchChapters();
            } catch (err: unknown) {
              handleApiError(err);
            }
          }}
        />
      ) } : col,
  );

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Chapters"
        actions={[{ label: "Create Chapter", onClick: openCreate }]}
      />
      <AdminFilterBar
        canClear={!!search || isDeleted !== undefined || !!syllabusId || !!classId || !!subjectId}
        onClear={() => { setSearch(""); setIsDeleted(undefined); setSyllabusId(undefined); setClassId(undefined); setSubjectId(undefined); setPage(1); }}
      >
        <AdminFilter label="Search" wide>
          <AdminSearchInput value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Search chapters…" />
        </AdminFilter>
        <AdminFilterSelect
          label="Syllabus"
          value={syllabusId ?? ""}
          onChange={(v) => { setPage(1); setSyllabusId(v || undefined); }}
          options={syllabusList.map((x) => ({ value: x._id, label: x.name }))}
        />
        <AdminFilterSelect
          label="Class"
          value={classId ?? ""}
          onChange={(v) => { setPage(1); setClassId(v || undefined); }}
          options={classesList.map((x) => ({ value: x._id, label: x.name }))}
        />
        <AdminFilterSelect
          label="Subject"
          value={subjectId ?? ""}
          onChange={(v) => { setPage(1); setSubjectId(v || undefined); }}
          options={subjectList.map((x) => ({ value: x._id, label: x.name }))}
        />
        <AdminFilterSelect
          label="Status"
          value={isDeleted === undefined ? "" : isDeleted ? "deleted" : "active"}
          onChange={(v) => { setPage(1); setIsDeleted(v === "" ? undefined : v === "deleted"); }}
          options={[{ value: "active", label: "Active" }, { value: "deleted", label: "Inactive" }]}
        />
        <AdminFilter label="Rows per page" width="sm:w-32">
          <AdminPageSize value={limit} onChange={(n) => { setPage(1); setLimit(n); }} />
        </AdminFilter>
      </AdminFilterBar>


      {/* table stays on screen while loading, so it never jumps */}
      <AdminTable
        loading={loading}
        data={chapters}
        columns={tableColumns}
        actions={[{ label: "Edit", onClick: openEdit }]}
        getRowId={(row) => row._id}
      />
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
