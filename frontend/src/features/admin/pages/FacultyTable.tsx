import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminFilter, AdminFilterBar, AdminFilterSelect, AdminPageSize, AdminSearchInput, AdminActiveStatus, AdminBadge } from "../components/ui";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";

import { getClasses } from "../../../api/class.api";
import { getSyllabus } from "../../../api/syllabus.api";
import { getSubjects } from "../../../api/subject.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import {
  createFaculty,
  getFaculties,
  blockFaculty,
  unblockFaculty,
} from "../../../api/faculty.api";

import FacultyModal from "../components/FacultyModal";

import type { FacultyRow } from "../../../shared/types/faculty.types";
import type { FacultySubmitPayload } from "../components/FacultyModal";
/* ---------------- TYPES ---------------- */

/* ---------------- COMPONENT ---------------- */

export default function FacultyPage() {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(true); // starts loading: shows placeholder rows, not "No records found"

  /* Filters */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(undefined);
  const [classId, setClassId] = useState<string | undefined>();
  const [syllabusId, setSyllabusId] = useState<string | undefined>();
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const [totalPages, setTotalPages] = useState(1);

  /* Dropdown lists */
  const [classesList, setClassesList] = useState<{ _id: string; name: string }[]>([]);
  const [syllabusList, setSyllabusList] = useState<{ _id: string; name: string }[]>([]);
  const [subjectList, setSubjectList] = useState<{ _id: string; name: string }[]>([]);

  /* Modal state */
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  /* Slot modals */

  /* ---------------- TABLE COLUMNS ---------------- */

  const columns: Column<FacultyRow>[] = [
    {
      key: "name",
      label: "Faculty",
      render: (f) => (
        <div className="flex items-center gap-3">
          <img
            src={typeof f.image === "string" ? f.image : f.image?.url}
            alt={f.name}
            className="w-14 aspect-[7/5] h-auto max-w-none shrink-0 rounded-lg object-cover border border-[#E4DDF2]"
          />
          <span className="font-medium">{f.name}</span>
        </div>
      ),
    },
    {
      key: "qualifications",
      label: "Qualifications",
      render: (f) => f.qualifications.join(", "),
    },
    {
      key: "demoClass",
      label: "Demo Video",
      render: (f) =>
        f.demoClass ? (
          <a
            href={f.demoClass}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#6D35D9] hover:underline text-xs font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Watch
          </a>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (f) => (
        <AdminBadge tone={f.isDeleted ? "danger" : "success"}>{f.isDeleted ? "Inactive" : "Active"}</AdminBadge>
      ),
    },
  ];

  /* ---------------- DATA ---------------- */

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const res = await getFaculties({
        page,
        limit,
        search: search || undefined,
        classId,
        syllabusId,
        subjectId,
        isDeleted,
      });
      setFaculties(res.data);
      console.log("RAW FACULTY RESPONSE:", res.data[0]);
      setTotalPages(Math.ceil(res.total / limit));
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, [page, limit, search, isDeleted, classId, syllabusId, subjectId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  /* ---------------- MODAL HANDLERS ---------------- */

  const openCreate = () => {
    setModalOpen(true);
  };

  const handleSubmit = async (payload: FacultySubmitPayload) => {
    try {
      setSaving(true);
      await createFaculty(payload);
      toast.success("Faculty created");
      setModalOpen(false);
      fetchFaculties();
    } catch (err: unknown) {
      handleApiError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  /* status can be changed straight from the table */
  const tableColumns: typeof columns = columns.map((col) =>
    col.key === "status" ? { ...col, render: (f) => (
        <AdminActiveStatus
          active={!f.isDeleted}
          confirmInactive={{ title: `Make ${f.name} inactive?`, message: "This faculty will be hidden from the website and students can't book them until made active again.", confirmLabel: "Make inactive" }}
          confirmActive={{ title: `Make ${f.name} active?`, message: "This faculty will show on the website again and students can book them.", confirmLabel: "Make active" }}
          onChange={async (on) => {
            try {
              await (on ? unblockFaculty(f.id) : blockFaculty(f.id));
              toast.success(`${f.name} is now ${on ? "active" : "inactive"}`);
              fetchFaculties();
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
        title="Faculty"
        actions={[{ label: "Create Faculty", onClick: openCreate }]}
      />

      <AdminFilterBar
        canClear={!!search || isDeleted !== undefined || !!syllabusId || !!classId || !!subjectId}
        onClear={() => { setSearch(""); setIsDeleted(undefined); setSyllabusId(undefined); setClassId(undefined); setSubjectId(undefined); setPage(1); }}
      >
        <AdminFilter label="Search" wide>
          <AdminSearchInput value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Search faculty…" />
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

      {/* TABLE */}
      {/* table stays on screen while loading, so it never jumps */}
      <AdminTable
        loading={loading}
        data={faculties}
        columns={tableColumns}
        actions={[
          { label: "View", onClick: (row) => navigate(`/admin/faculty/${row.id}`) },
        ]}
        getRowId={(row) => row.id}
      />

      {/* PAGINATION */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* FACULTY MODAL (create only) */}
      <FacultyModal
        open={modalOpen}
        mode={"create"}
        syllabuses={syllabusList}
        classes={classesList}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

    </AdminPageContainer>
  );
}
