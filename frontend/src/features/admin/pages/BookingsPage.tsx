import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import { formatTimeAMPM } from "../../../shared/utils/time.utils";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import toast from "react-hot-toast";
import type { Column } from "../components/AdminTable";
import {
  getOneOnOneBookings,
  getPoolBookings,
  type 
  type 
} from "../../../api/booking.api";
import { getClassesList } from "../../../api/class.api";
import { getSyllabusList } from "../../../api/syllabus.api";
import OneOnOneBookingModal from "../components/OneOnOneBookingModal";
import PoolBookingModal from "../components/PoolBookingModal";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthUser } from "../../auth/type/auth.type";

import type { OneOnOneBooking, PoolBooking, BookingType } from "../../../shared/types/booking.types";
import type { Student } from "../../../shared/types/student.types";
/* ─── helpers ─────────────────────────────────────────── */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const sel =
  "w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30";

/* ─── columns ─────────────────────────────────────────── */
const oneOnOneColumns: Column<OneOnOneBooking>[] = [
  {
    key: "student",
    label: "Student",
    render: (b) => (
      <div>
        <p className="font-medium text-gray-900">{b.student.name}</p>
        <p className="text-xs text-gray-400">{b.student.phone}</p>
      </div>
    ),
  },
  { key: "faculty", label: "Faculty", render: (b) => b.faculty.name },
  {
    key: "subject",
    label: "Subject / Chapter",
    render: (b) =>
      b.mode === "chapter"
        ? b.chapter?.name ?? "—"
        : formatTimeAMPM(b.slot?.time) ?? "—",
  },
  { key: "class", label: "Class", render: (b) => b.class.name },
  { key: "syllabus", label: "Syllabus", render: (b) => b.syllabus.name },
  {
    key: "status",
    label: "Status",
    render: (b) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          b.status === "confirmed"
            ? "bg-green-100 text-green-700"
            : b.status === "interested"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {b.status}
      </span>
    ),
  },
  {
    key: "isContacted",
    label: "Contacted",
    render: (b) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          b.isContacted
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {b.isContacted ? "Yes" : "Pending"}
      </span>
    ),
  },
  { key: "createdAt", label: "Date", render: (b) => fmtDate(b.createdAt) },
];

const poolColumns: Column<PoolBooking>[] = [
  { key: "faculty", label: "Faculty", render: (b) => b.faculty.name },
  {
    key: "subject",
    label: "Subject / Chapter",
    render: (b) =>
      b.mode === "chapter"
        ? b.chapter?.name ?? "—"
        : formatTimeAMPM(b.slot?.time) ?? "—",
  },
  { key: "class", label: "Class", render: (b) => b.class.name },
  { key: "syllabus", label: "Syllabus", render: (b) => b.syllabus.name },
  {
    key: "totalStudents",
    label: "Students",
    render: (b) => (
      <span className="font-semibold text-gray-800">{b.totalStudents}</span>
    ),
  },
  {
    key: "hasPendingContact",
    label: "Pending Contact",
    render: (b) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          b.hasPendingContact
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {b.hasPendingContact ? "Yes" : "No"}
      </span>
    ),
  },
  { key: "createdAt", label: "Date", render: (b) => fmtDate(b.createdAt) },
];

/* ─── component ───────────────────────────────────────── */
type BookingType = "one-on-one" | "pool";

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<AuthUser>(["auth-user"]);
  const readOnly = user?.role === "salesPerson";

  const [bookingType, setBookingType] = useState<BookingType>("one-on-one");

  /* modal */
  const [selectedBooking, setSelectedBooking] = useState<OneOnOneBooking | null>(null);
  const [selectedPoolBooking, setSelectedPoolBooking] = useState<PoolBooking | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  /* data */
  const [oneOnOneData, setOneOnOneData] = useState<OneOnOneBooking[]>([]);
  const [poolData, setPoolData] = useState<PoolBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  /* filters */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"" | "chapter" | "slot">("");
  const [classId, setClassId] = useState<string>("");
  const [syllabusId, setSyllabusId] = useState<string>("");
  const [isContacted, setIsContacted] = useState<"" | "true" | "false">("");

  /* dropdown lists */
  const [classesList, setClassesList] = useState<{ _id: string; name: string }[]>([]);
  const [syllabusList, setSyllabusList] = useState<{ _id: string; name: string }[]>([]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  /* load dropdowns once — use lightweight /list endpoints (name + id only) */
  useEffect(() => {
    Promise.all([getClassesList(), getSyllabusList()])
      .then(([classes, syllabuses]) => {
        setClassesList(classes);
        setSyllabusList(syllabuses);
      })
      .catch(handleApiError);
  }, []);

  /* fetch bookings */
  useEffect(() => {
    const filters = {
      page,
      limit,
      search: search || undefined,
      mode: (mode || undefined) as "chapter" | "slot" | undefined,
      classId: classId || undefined,
      syllabusId: syllabusId || undefined,
      isContacted:
        isContacted === "" ? undefined : isContacted === "true",
    };

    setLoading(true);

    if (bookingType === "one-on-one") {
      getOneOnOneBookings(filters)
        .then((r) => {
          setOneOnOneData(r.data);
          setTotal(r.total);
        })
        .catch(handleApiError)
        .finally(() => setLoading(false));
    } else {
      getPoolBookings(filters)
        .then((r) => {
          setPoolData(r.data);
          setTotal(r.total);
        })
        .catch(handleApiError)
        .finally(() => setLoading(false));
    }
  }, [bookingType, page, limit, search, mode, classId, syllabusId, isContacted, refreshKey]);

  /* reset page when switching type or filters change */
  const resetPage = () => setPage(1);

  const switchType = (t: BookingType) => {
    setBookingType(t);
    resetPage();
  };

  return (
    <>
    <AdminPageContainer>
      <AdminPageActions title="Bookings" actions={[]} />

      {/* ── Toggle ─────────────────────────────────────── */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-4">
        <button
          onClick={() => switchType("one-on-one")}
          className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
            bookingType === "one-on-one"
              ? "bg-white text-[#DB313E] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          One-on-One
        </button>
        <button
          onClick={() => switchType("pool")}
          className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
            bookingType === "pool"
              ? "bg-white text-[#DB313E] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Pool Bookings
        </button>
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
        {/* Search */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            placeholder={
              bookingType === "one-on-one" ? "Student / faculty…" : "Faculty…"
            }
            className={sel}
          />
        </div>

        {/* Mode */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Mode</label>
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value as any); resetPage(); }}
            className={`${sel} w-36`}
          >
            <option value="">All</option>
            <option value="chapter">Chapter</option>
            <option value="slot">Slot</option>
          </select>
        </div>

        {/* Syllabus */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Syllabus</label>
          <SearchableSelect
            value={syllabusId}
            onChange={(v) => { setSyllabusId(v); resetPage(); }}
            options={[
              { value: "", label: "All" },
              ...syllabusList.map((s) => ({ value: s._id, label: s.name })),
            ]}
            placeholder="All"
            className="w-44"
          />
        </div>

        {/* Class */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Class</label>
          <SearchableSelect
            value={classId}
            onChange={(v) => { setClassId(v); resetPage(); }}
            options={[
              { value: "", label: "All" },
              ...classesList.map((c) => ({ value: c._id, label: c.name })),
            ]}
            placeholder="All"
            className="w-36"
          />
        </div>

        {/* Contacted (one-on-one only) */}
        {bookingType === "one-on-one" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Contacted</label>
            <select
              value={isContacted}
              onChange={(e) => { setIsContacted(e.target.value as any); resetPage(); }}
              className={`${sel} w-36`}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">Pending</option>
            </select>
          </div>
        )}

        {/* Per page */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Per Page</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); resetPage(); }}
            className={`${sel} w-28`}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      {loading ? (
        <TopLoader loading />
      ) : bookingType === "one-on-one" ? (
        <AdminTable
          data={oneOnOneData}
          columns={oneOnOneColumns}
          actions={[{ label: "View", onClick: (row) => setSelectedBooking(row) }]}
          getRowId={(row) => row.id}
        />
      ) : (
        <AdminTable
          data={poolData}
          columns={poolColumns}
          actions={[{ label: "View", onClick: (row) => setSelectedPoolBooking(row) }]}
          getRowId={(_, i) => String(i)}
        />
      )}

      {/* ── Pagination ─────────────────────────────────── */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        description={`${total} total`}
      />
    </AdminPageContainer>

    {/* One-on-One detail modal */}
    <OneOnOneBookingModal
      booking={selectedBooking}
      readOnly={readOnly}
      onClose={() => { setSelectedBooking(null); triggerRefresh(); }}
      onConfirmed={() => { setSelectedBooking(null); triggerRefresh(); }}
    />

    {/* Pool booking detail modal */}
    <PoolBookingModal
      booking={selectedPoolBooking}
      readOnly={readOnly}
      onClose={() => { setSelectedPoolBooking(null); triggerRefresh(); }}
      onConfirmed={() => { setSelectedPoolBooking(null); triggerRefresh(); }}
    />
    </>
  );
}
