import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminBadge, AdminFilter, AdminFilterBar, AdminPageSize, AdminSearchInput } from "../components/ui";
import {
  createSubject,
  updateSubject,
  getSubjects,
  getSubjectById,
  addSubjectVariants,
} from "../../../api/subject.api";
import toast from "react-hot-toast";
import TopLoader from "../../../shared/components/TopLoader";
import Pagination from "../../../shared/components/Pagination";
import type { Column } from "../components/AdminTable";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import { getSyllabus } from "../../../api/syllabus.api";
import { getClasses } from "../../../api/class.api";
import SubjectFormModal from "../components/SubjectFormModal";
import type { CreateSubjectPayload, SubjectRow, SubjectVariantForm } from "../../../shared/types/subject.types";

export default function SubjectPage() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingSubject, setEditingSubject] = useState<
    | {
        _id?: string;
        name: string;
        variants: SubjectVariantForm[];
      }
    | undefined
  >();
  const [submitting, setSubmitting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [isDeleted] = useState<boolean | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(1);
  const [syllabuses, setSyllabuses] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [classes, setClasses] = useState<{ _id: string; name: string }[]>([]);

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
        <AdminBadge tone={s.isDeleted ? "danger" : "success"}>{s.isDeleted ? "Inactive" : "Active"}</AdminBadge>
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
    } catch (err: unknown) {
      console.log("error fetching subjects ", err);
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchSubjects();
  }, [page, limit, search, isDeleted]);
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [syllabusRes, classRes] = await Promise.all([
          getSyllabus({ page: 1, limit: 100 }),
          getClasses({ page: 1, limit: 100 }),
        ]);

        setSyllabuses(syllabusRes.rows);
        setClasses(classRes.rows);
      } catch (err) {
        handleApiError(err);
      }
    };

    fetchMeta();
  }, []);

  const handleCreate = () => {
    setMode("create");
    setEditingSubject(undefined);
    setModalOpen(true);
  };

  const handleEdit = async (subject: SubjectRow) => {
    try {
      setMode("edit");

      const fullSubject = await getSubjectById(subject._id);

      setEditingSubject({
        _id: fullSubject._id,
        name: fullSubject.name,
        variants: fullSubject.variants.map((v) => ({
          syllabusId: v.syllabusId,
          classId: v.classId,
        })),
      });

      setModalOpen(true);
    } catch (err) {
      handleApiError(err);
    }
  };

 const handleCreateSubject = async (data: CreateSubjectPayload) => {
  try {
    setSubmitting(true);

    await createSubject({
      name: data.name,
      syllabusAndClass: data.syllabusAndClass,
    });

    toast.success("Subject created successfully");

    setModalOpen(false);
    setEditingSubject(undefined);
    setMode("create");

    await fetchSubjects();
  } catch (err: unknown) {
    handleApiError(err);
  } finally {
    setSubmitting(false);
  }
};


  const handleUpdateSubjectName = async (data: {
    _id: string;
    name: string;
  }) => {
    try {
      setSubmitting(true);

      await updateSubject(data._id, { name: data.name });

      toast.success("Subject name updated");

      await fetchSubjects();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };
  const handleAddSubjectVariants = async (data: {
    _id: string;
    variants: SubjectVariantForm[];
  }) => {
    try {
      setSubmitting(true);

      const res = await addSubjectVariants(data._id, data.variants);

      toast.success(res?.message || "Variants added successfully");

      setModalOpen(false);
      setEditingSubject(undefined);
      setMode("create");

      await fetchSubjects();
    } catch (err: unknown) {
      handleApiError(err);
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
            placeholder="Search subjects…"
          />
        </AdminFilter>

        {/* Status Filter */}
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal */}
      <SubjectFormModal
        open={modalOpen}
        mode={mode}
        initialData={editingSubject}
        loading={submitting}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateSubject}
        onUpdateName={handleUpdateSubjectName}
        onAddVariants={handleAddSubjectVariants}
        syllabuses={syllabuses}
        classes={classes}
      />
    </AdminPageContainer>
  );
}
