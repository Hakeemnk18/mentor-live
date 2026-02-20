import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import TopLoader from "../../../shared/components/TopLoader";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";

import { getClasses } from "../../../api/class.api";
import { getSyllabus } from "../../../api/syllabus.api";
import { getSubjects } from "../../../api/subject.api";
import {
  createFaculty,
  updateFaculty,
  getFaculties,
  getFacultyById,
} from "../../../api/faculty.api";

import FacultyModal from "../components/FacultyModal";
import type { FacultyModalData } from "../components/FacultyModal";
import { AddTimeSlotModal } from "../components/AddTimeSlotModal";
import { AddChapterSlotModal } from "../components/AddChapterSlotModal";

/* ---------------- TYPES ---------------- */

type FacultyRow = {
  id: string;
  name: string;
  qualifications: string[];
  description: string;
  demoClass: string;
  image: string;
  price: number;
  isDeleted: boolean;
  slots: { time: string }[];
  chapterSlots: string[];
};

/* ---------------- COMPONENT ---------------- */

export default function FacultyPage() {
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
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingFaculty, setEditingFaculty] = useState<FacultyModalData | undefined>();
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
            src={f.image}
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
      key: "price",
      label: "Price",
      render: (f) => `₹${f.price}`,
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
      setTotalPages(Math.ceil(res.total / limit));
    } catch {
      toast.error("Failed to load faculties");
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
      .catch(() => toast.error("Failed to load filters"));
  }, []);

  /* ---------------- MODAL HANDLERS ---------------- */

  const openCreate = () => {
    setEditingFaculty(undefined);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = async (row: FacultyRow) => {
    try {
      setSaving(true);
      const data = await getFacultyById(row.id);
      setEditingFaculty(data);
      setModalMode("edit");
      setModalOpen(true);
    } catch {
      toast.error("Failed to load faculty details");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (payload: any) => {
    try {
      setSaving(true);
      if (modalMode === "create") {
        await createFaculty(payload);
        toast.success("Faculty created");
      } else {
        await updateFaculty(editingFaculty!.id, payload);
        toast.success("Faculty updated");
      }
      setModalOpen(false);
      fetchFaculties();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Operation failed");
      throw err; // Let modal stop loading spinner
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
      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        {/* Search */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search faculty..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full md:w-64 px-3 py-2 text-sm border border-gray-300 rounded
              focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          />
        </div>

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

        {/* Entries */}
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

      {/* TABLE */}
      {loading ? (
        <TopLoader loading />
      ) : (
        <AdminTable
          data={faculties}
          columns={columns}
          actions={[
            { label: "Edit", onClick: openEdit },
            { label: "+ Slot", onClick: (row) => setSlotFacultyId(row.id) },
            { label: "+ Chapter", onClick: (row) => setChapterFacultyId(row.id) },
          ]}
          getRowId={(row) => row.id}
        />
      )}

      {/* PAGINATION */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

      {/* FACULTY MODAL (create + edit) */}
      <FacultyModal
        open={modalOpen}
        mode={modalMode}
        initialData={editingFaculty}
        facultyId={editingFaculty?.id}
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
