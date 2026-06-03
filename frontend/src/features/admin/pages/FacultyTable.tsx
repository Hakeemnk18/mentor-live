import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";

import { getClasses } from "../../../api/class.api";
import { getSyllabus } from "../../../api/syllabus.api";
import { getSubjects } from "../../../api/subject.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import {
  createFaculty,
  getFaculties,
} from "../../../api/faculty.api";

import FacultyModal from "../components/FacultyModal";
import { AddTimeSlotModal } from "../components/AddTimeSlotModal";
import { AddChapterSlotModal } from "../components/AddChapterSlotModal";

import type { FacultyRow } from "../../../shared/types/faculty.types";
/* ---------------- TYPES ---------------- */

/* ---------------- COMPONENT ---------------- */

export default function FacultyPage() {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(false);

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
  const [slotFacultyId, setSlotFacultyId] = useState<string | null>(null);
  const [chapterFacultyId, setChapterFacultyId] = useState<string | null>(null);

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
            className="w-10 h-10 rounded-full object-cover border"
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
            className="inline-flex items-center gap-1 text-[#DB313E] hover:underline text-xs font-medium"
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
        <span
          className={`px-2 py-1 rounded text-xs ${
            f.isDeleted
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {f.isDeleted ? "Inactive" : "Active"}
        </span>
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
      .catch(handleApiError);
  }, []);

  /* ---------------- MODAL HANDLERS ---------------- */

  const openCreate = () => {
    setModalOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    try {
      setSaving(true);
      await createFaculty(payload);
      toast.success("Faculty created");
      setModalOpen(false);
      fetchFaculties();
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <AdminPageContainer>
      <AdminPageActions
        title="Faculty"
        actions={[{ label: "Create Faculty", onClick: openCreate }]}
      />

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-45">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search faculty..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
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

      {/* TABLE */}
      {loading ? (
        <TopLoader loading />
      ) : (
        <AdminTable
          data={faculties}
          columns={columns}
          actions={[
            { label: "View", onClick: (row) => navigate(`/admin/faculty/${row.id}`) },
          ]}
          getRowId={(row) => row.id}
        />
      )}

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

      {/* SLOT MODAL */}
      {slotFacultyId && (
        <AddTimeSlotModal
          facultyId={slotFacultyId}
          onSuccess={() => {
            fetchFaculties();
            setSlotFacultyId(null);
          }}
        />
      )}

      {/* CHAPTER MODAL */}
      {chapterFacultyId && (
        <AddChapterSlotModal
          facultyId={chapterFacultyId}
          syllabuses={syllabusList}
          classes={classesList}
          onSuccess={() => {
            fetchFaculties();
            setChapterFacultyId(null);
          }}
        />
      )}
    </AdminPageContainer>
  );
}
