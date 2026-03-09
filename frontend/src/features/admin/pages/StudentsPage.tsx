import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import type { Student } from "../../../api/student.api";
import { getStudents, blockStudent, unblockStudent } from "../../../api/student.api";
import { getClasses } from "../../../api/class.api";
import { getSyllabus } from "../../../api/syllabus.api";

/* ── types ─────────────────────────────────────────────────── */
type ClassOption = { _id: string; name: string };
type SyllabusOption = { _id: string; name: string };

/* ── Phone contact cell ────────────────────────────────────── */
function PhoneCell({
  student,
  openId,
  setOpenId,
}: {
  student: Student;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isOpen = openId === student.id;
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Compute position when opening
  const handleToggle = () => {
    if (isOpen) { setOpenId(null); return; }
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const POPOVER_HEIGHT = 50; // approx height of popover
      const spaceBelow = window.innerHeight - r.bottom;
      const top = spaceBelow >= POPOVER_HEIGHT + 8
        ? r.bottom + 4          // open downward
        : r.top - POPOVER_HEIGHT - 4; // flip upward
      setPos({ top, left: r.left });
    }
    setOpenId(student.id);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpenId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, setOpenId]);

  // Close on scroll
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => setOpenId(null);
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [isOpen, setOpenId]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="flex items-center gap-1 text-sm text-[#DB313E] hover:underline font-medium"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 5.25v1.5z" />
        </svg>
        {student.phoneNumber}
      </button>

      {isOpen && pos && createPortal(
        <div
          ref={popoverRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden min-w-[140px]"
        >
          <a
            href={`tel:${student.phoneNumber}`}
            onClick={() => setOpenId(null)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 5.25v1.5z" />
            </svg>
            Call
          </a>
        </div>,
        document.body
      )}
    </>
  );
}

/* ── columns (built with shared openId state) ──────────────── */
function buildColumns(openId: string | null, setOpenId: (id: string | null) => void): Column<Student>[] {
  return [
  {
    key: "name",
    label: "Student",
    render: (s) => (
      <div>
        <p className="font-medium text-gray-900">{s.name}</p>
        <p className="text-xs text-gray-400">{s.place}</p>
      </div>
    ),
  },
  {
    key: "phone",
    label: "Phone",
    render: (s) => <PhoneCell student={s} openId={openId} setOpenId={setOpenId} />,
  },
  {
    key: "school",
    label: "School",
    render: (s) => <span className="text-sm text-gray-700 max-w-xs line-clamp-1">{s.school}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (s) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          s.isDeleted ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
        }`}
      >
        {s.isDeleted ? "Blocked" : "Active"}
      </span>
    ),
  },
  ];
}

/* ── component ────────────────────────────────────────────── */
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [syllabuses, setSyllabuses] = useState<SyllabusOption[]>([]);
  const [contactOpenId, setContactOpenId] = useState<string | null>(null);

  const columns = buildColumns(contactOpenId, setContactOpenId);

  /* filters */
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [syllabusId, setSyllabusId] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "blocked">("");

  /* pagination */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  /* ── load dropdowns once ── */
  useEffect(() => {
    getClasses({ page: 1, limit: 200 })
      .then((r) => setClasses(r.rows))
      .catch(() => {});
    getSyllabus({ page: 1, limit: 200 })
      .then((r) => setSyllabuses(r.rows))
      .catch(() => {});
  }, []);

  /* ── fetch students (server-side) ── */
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const isDeleted =
        statusFilter === "blocked" ? true : statusFilter === "active" ? false : undefined;
      const res = await getStudents({
        page,
        limit,
        search: search || undefined,
        class: classId || undefined,
        syllabus: syllabusId || undefined,
        isDeleted,
      });
      setStudents(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search, classId, syllabusId, statusFilter]);

  /* ── handlers ── */
  const handleToggleBlock = async (s: Student) => {
    try {
      if (s.isDeleted) {
        await unblockStudent(s.id);
        toast.success(`${s.name} unblocked`);
      } else {
        await blockStudent(s.id);
        toast.success(`${s.name} blocked`);
      }
      fetchStudents();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed");
    }
  };

  const sel =
    "px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30";

  return (
    <AdminPageContainer>
      <AdminPageActions title="Students" actions={[]} />

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row md:items-end gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 flex-wrap">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Name, school, place…"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30"
          />
        </div>

        {/* Class */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Class</label>
          <select
            value={classId}
            onChange={(e) => { setPage(1); setClassId(e.target.value); }}
            className={sel}
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Syllabus */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Syllabus</label>
          <select
            value={syllabusId}
            onChange={(e) => { setPage(1); setSyllabusId(e.target.value); }}
            className={sel}
          >
            <option value="">All Syllabuses</option>
            {syllabuses.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any); }}
            className={sel}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <TopLoader loading={loading} />
      ) : (
        <AdminTable
          data={students}
          columns={columns}
          actions={[
            {
              label: (s) => (s.isDeleted ? "Unblock" : "Block"),
              onClick: handleToggleBlock,
              className: (s) =>
                s.isDeleted
                  ? "text-sm font-medium cursor-pointer text-green-600 hover:opacity-80"
                  : "text-sm font-medium cursor-pointer text-red-500 hover:opacity-80",
            },
          ]}
          getRowId={(s) => s.id}
        />
      )}

      {/* ── Pagination ── */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        description={<>{total} student{total !== 1 ? "s" : ""}</>}
      />
    </AdminPageContainer>
  );
}
