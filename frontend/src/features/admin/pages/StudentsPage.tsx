import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { AdminFilter, AdminFilterBar, AdminFilterSelect, AdminSearchInput, AdminActiveStatus, AdminBadge } from "../components/ui";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import { getStudents, blockStudent, unblockStudent } from "../../../api/student.api";
import { getClasses } from "../../../api/class.api";
import { getSyllabus } from "../../../api/syllabus.api";
import { handleApiError } from "../../../shared/utils/handle.api.error";

import type { Student } from "../../../shared/types/student.types";
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
        className="flex items-center gap-1 text-sm text-[#6D35D9] hover:underline font-medium"
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
      <AdminBadge tone={s.isDeleted ? "danger" : "success"}>{s.isDeleted ? "Blocked" : "Active"}</AdminBadge>
    ),
  },
  ];
}

/* ── component ────────────────────────────────────────────── */
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true); // starts loading: shows placeholder rows, not "No records found"
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
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchStudents();
  }, [page, search, classId, syllabusId, statusFilter]);

  /* ── handlers ── */


  /* status can be changed straight from the table */
  const tableColumns: typeof columns = columns.map((col) =>
    col.key === "status" ? { ...col, render: (s) => (
        <AdminActiveStatus
          active={!s.isDeleted}
          inactiveLabel="Blocked"
          confirmInactive={{ title: `Block ${s.name}?`, message: "This student won't be able to book classes until unblocked.", confirmLabel: "Block" }}
          confirmActive={{ title: `Unblock ${s.name}?`, message: "This student will be able to book classes again.", confirmLabel: "Unblock" }}
          onChange={async (on) => {
            try {
              await (on ? unblockStudent(s.id) : blockStudent(s.id));
              toast.success(`${s.name} ${on ? "unblocked" : "blocked"}`);
              fetchStudents();
            } catch (err: unknown) {
              handleApiError(err);
            }
          }}
        />
      ) } : col,
  );

  return (
    <AdminPageContainer>
      <AdminPageActions title="Students" actions={[]} />

      <AdminFilterBar
        canClear={!!search || !!classId || !!syllabusId || !!statusFilter}
        onClear={() => { setSearch(""); setClassId(""); setSyllabusId(""); setStatusFilter(""); setPage(1); }}
      >
        <AdminFilter label="Search" wide>
          <AdminSearchInput value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Name, school, place…" />
        </AdminFilter>
        <AdminFilterSelect
          label="Class"
          value={classId}
          onChange={(v) => { setPage(1); setClassId(v); }}
          options={classes.map((x) => ({ value: x._id, label: x.name }))}
          allLabel="All classes"
        />
        <AdminFilterSelect
          label="Syllabus"
          value={syllabusId}
          onChange={(v) => { setPage(1); setSyllabusId(v); }}
          options={syllabuses.map((x) => ({ value: x._id, label: x.name }))}
          allLabel="All syllabuses"
        />
        <AdminFilterSelect
          label="Status"
          value={statusFilter}
          onChange={(v) => { setPage(1); setStatusFilter(v); }}
          options={[{ value: "active", label: "Active" }, { value: "blocked", label: "Blocked" }]}
        />
      </AdminFilterBar>

      {/* ── Table ── */}
      {/* table stays on screen while loading, so it never jumps */}
      <AdminTable
        loading={loading}
        data={students}
        columns={tableColumns}
        getRowId={(s) => s.id}
      />

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
