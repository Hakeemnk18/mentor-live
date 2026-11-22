import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import { formatTimeAMPM } from "../../../shared/utils/time.utils";
import { AdminPageActions } from "../components/AdminPageActions";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import Pagination from "../../../shared/components/Pagination";
import TopLoader from "../../../shared/components/TopLoader";
import type { Column } from "../components/AdminTable";
import {
  getOneOnOneBookings,
  getPoolBookings,
  getAllBookings,
  exportOneOnOneBookings,
  exportPoolBookings,
  exportAllBookings,
  confirmSlotBooking,
  markBookingContacted,
} from "../../../api/booking.api";
import toast from "react-hot-toast";
import { AdminContactActions, AdminStatusSelect } from "../components/ui";
import type { StatusOption } from "../components/ui";
import ExportButton from "../../../shared/components/ExportButton";
import { downloadBlob } from "../../../shared/utils/download.util";
import { getClassesList } from "../../../api/class.api";
import { getSyllabusList } from "../../../api/syllabus.api";
import OneOnOneBookingModal from "../components/OneOnOneBookingModal";
import PoolBookingModal from "../components/PoolBookingModal";
import { handleApiError } from "../../../shared/utils/handle.api.error";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthUser } from "../../auth/type/auth.type";

import type { OneOnOneBooking, PoolBooking, AllBooking, BookingType } from "../../../shared/types/booking.types";
/* ─── helpers ─────────────────────────────────────────── */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const sel =
  "w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6D35D9]/30";

/* ─── status options (only the changes the API supports: Pending → Confirmed, Pending → Contacted) ─── */
type BookingStatusValue = "interested" | "confirmed" | "cancelled" | "expired";
const BOOKING_STATUS_LABEL: Record<BookingStatusValue, StatusOption<BookingStatusValue>> = {
  interested: { value: "interested", label: "Pending", tone: "info" },
  confirmed: { value: "confirmed", label: "Confirmed", tone: "success" },
  cancelled: { value: "cancelled", label: "Cancelled", tone: "danger" },
  expired: { value: "expired", label: "Expired", tone: "neutral" },
};
type ContactedValue = "pending" | "contacted";
const CONTACTED_OPTIONS: StatusOption<ContactedValue>[] = [
  { value: "pending", label: "Pending", tone: "warning", disabled: true, hint: "Can't be undone once contacted" },
  { value: "contacted", label: "Contacted", tone: "success" },
];
/** row fields the status cells need (shared by One-on-One and All Bookings rows) */
type StatusRow = { id: string; status: string; isContacted: boolean; mode: "slot" | "chapter"; type?: "oneToOne" | "pooling" };

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
    label: "Subject",
    render: (b) => b.subject?.name ?? "—",
  },
  {
    key: "chapter",
    label: "Chapter",
    render: (b) => b.chapter?.name ?? "—",
  },
  {
    key: "time",
    label: "Time",
    render: (b) => formatTimeAMPM(b.slot?.time) ?? "—",
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
        {b.status === "interested" ? "Pending" : b.status}
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
    label: "Subject",
    render: (b) => b.subject?.name ?? "—",
  },
  {
    key: "chapter",
    label: "Chapter",
    render: (b) => b.chapter?.name ?? "—",
  },
  {
    key: "time",
    label: "Time",
    render: (b) => formatTimeAMPM(b.slot?.time) ?? "—",
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

const allBookingColumns: Column<AllBooking>[] = [
  {
    key: "type",
    label: "Type",
    render: (b) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          b.type === "oneToOne"
            ? "bg-purple-100 text-purple-700"
            : "bg-indigo-100 text-indigo-700"
        }`}
      >
        {b.type === "oneToOne" ? "One-to-One" : "Pooling"}
      </span>
    ),
  },
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
    label: "Subject",
    render: (b) => b.subject?.name ?? "—",
  },
  {
    key: "chapter",
    label: "Chapter",
    render: (b) => b.chapter?.name ?? "—",
  },
  {
    key: "time",
    label: "Time",
    render: (b) => formatTimeAMPM(b.slot?.time) ?? "—",
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
        {b.status === "interested" ? "Pending" : b.status}
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

/* ─── component ───────────────────────────────────────── */

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

  /* ── Inline status changes (same API calls as the View screen) ── */
  const statusCell = (b: StatusRow, openDetails?: () => void) => {
    const value = (b.status in BOOKING_STATUS_LABEL ? b.status : "expired") as BookingStatusValue;
    const isPool = b.type === "pooling";
    const options: StatusOption<BookingStatusValue>[] =
      value === "interested"
        ? [
            BOOKING_STATUS_LABEL.interested,
            {
              ...BOOKING_STATUS_LABEL.confirmed,
              hint: b.mode === "chapter" ? "Opens booking details to pick a time" : undefined,
            },
          ]
        : [BOOKING_STATUS_LABEL[value]];
    return (
      <AdminStatusSelect
        label="Booking status"
        value={value}
        options={options}
        // pool bookings are confirmed per group from the Pool tab; sales staff can't confirm
        readOnly={readOnly || isPool || (b.mode === "chapter" && !openDetails)}
        confirm={(next) =>
          next === "confirmed" && b.mode === "slot"
            ? { title: "Confirm this booking?", message: "The student's class will be confirmed. This can't be undone.", confirmLabel: "Confirm booking" }
            : null
        }
        onChange={async (next) => {
          if (next !== "confirmed") return;
          if (b.mode === "chapter") {
            openDetails?.(); // a time has to be picked — use the existing details screen
            return;
          }
          try {
            await confirmSlotBooking(b.id);
            toast.success("Booking confirmed");
            triggerRefresh();
          } catch (err: unknown) {
            handleApiError(err);
          }
        }}
      />
    );
  };

  /** shared by the Contacted dropdown and the "Mark as contacted?" prompt after calling */
  const markContacted = async (id: string) => {
    try {
      await markBookingContacted(id);
      toast.success("Marked as contacted");
      triggerRefresh();
    } catch (err: unknown) {
      handleApiError(err);
    }
  };

  /* ── Student cell: name, phone, Call · WhatsApp · Copy ── */
  const studentCell = (b: StatusRow & { student: { name: string; phone: string } }) => (
    <div className="min-w-[150px]">
      <p className="font-medium text-gray-900">{b.student.name}</p>
      <p className="text-xs text-gray-400">{b.student.phone}</p>
      <div className="mt-1.5">
        <AdminContactActions
          phone={b.student.phone}
          name={b.student.name}
          onReachOut={() => {
            // after calling / messaging, offer to mark the booking contacted (one-on-one only, like the dropdown)
            if (b.isContacted || b.type === "pooling") return;
            toast(
              (t) => (
                <span className="flex items-center gap-3 text-sm">
                  <span>
                    Reached <b>{b.student.name}</b>?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      toast.dismiss(t.id);
                      void markContacted(b.id);
                    }}
                    className="shrink-0 h-8 px-3 rounded-full bg-[#6D35D9] text-white text-xs font-semibold hover:bg-[#5B2BC0] cursor-pointer"
                  >
                    Mark as contacted
                  </button>
                </span>
              ),
              { id: `contact-${b.id}`, duration: 10000 }
            );
          }}
        />
      </div>
    </div>
  );

  const contactedCell = (b: StatusRow) => (
    <AdminStatusSelect
      label="Contacted"
      value={(b.isContacted ? "contacted" : "pending") as ContactedValue}
      options={CONTACTED_OPTIONS}
      // pool bookings: contact status is shown only (same as the Pool details screen)
      readOnly={b.type === "pooling"}
      onChange={async (next) => {
        if (next === "contacted") await markContacted(b.id);
      }}
    />
  );

  const oneOnOneCols: Column<OneOnOneBooking>[] = oneOnOneColumns.map((c) =>
    c.key === "student"
      ? { ...c, render: (b) => studentCell({ ...b, type: "oneToOne" }) }
      : c.key === "status"
      ? { ...c, render: (b) => statusCell({ ...b, type: "oneToOne" }, () => setSelectedBooking(b)) }
      : c.key === "isContacted"
      ? { ...c, render: (b) => contactedCell(b) }
      : c
  );
  const allBookingCols: Column<AllBooking>[] = allBookingColumns.map((c) =>
    c.key === "student"
      ? { ...c, render: (b) => studentCell(b) }
      : c.key === "status"
      ? { ...c, render: (b) => statusCell(b) }
      : c.key === "isContacted"
      ? { ...c, render: (b) => contactedCell(b) }
      : c
  );

  /* data */
  const [oneOnOneData, setOneOnOneData] = useState<OneOnOneBooking[]>([]);
  const [poolData, setPoolData] = useState<PoolBooking[]>([]);
  const [allBookingsData, setAllBookingsData] = useState<AllBooking[]>([]);
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
  /* All Bookings tab only */
  const [bookingTypeFilter, setBookingTypeFilter] = useState<"" | "oneToOne" | "pooling">("");
  const [status, setStatus] = useState<"" | "interested" | "confirmed" | "cancelled" | "expired">("");

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
      type: bookingTypeFilter || undefined,
      status: status || undefined,
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    if (bookingType === "one-on-one") {
      getOneOnOneBookings(filters)
        .then((r) => {
          setOneOnOneData(r.data);
          setTotal(r.total);
        })
        .catch(handleApiError)
        .finally(() => setLoading(false));
    } else if (bookingType === "pool") {
      getPoolBookings(filters)
        .then((r) => {
          setPoolData(r.data);
          setTotal(r.total);
        })
        .catch(handleApiError)
        .finally(() => setLoading(false));
    } else {
      getAllBookings(filters)
        .then((r) => {
          setAllBookingsData(r.data);
          setTotal(r.total);
        })
        .catch(handleApiError)
        .finally(() => setLoading(false));
    }
  }, [bookingType, page, limit, search, mode, classId, syllabusId, isContacted, bookingTypeFilter, status, refreshKey]);

  /* reset page when switching type or filters change */
  const resetPage = () => setPage(1);

  const switchType = (t: BookingType) => {
    setBookingType(t);
    resetPage();
  };

  /* export current filters (all matching rows, ignoring pagination) */
  const handleExport = async () => {
    const filters = {
      search: search || undefined,
      mode: (mode || undefined) as "chapter" | "slot" | undefined,
      classId: classId || undefined,
      syllabusId: syllabusId || undefined,
      isContacted: isContacted === "" ? undefined : isContacted === "true",
      type: bookingTypeFilter || undefined,
      status: status || undefined,
    };

    if (bookingType === "one-on-one") {
      downloadBlob(await exportOneOnOneBookings(filters), "one-to-one-bookings.csv");
    } else if (bookingType === "pool") {
      downloadBlob(await exportPoolBookings(filters), "pool-bookings.csv");
    } else {
      downloadBlob(await exportAllBookings(filters), "all-bookings.csv");
    }
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
              ? "bg-white text-[#6D35D9] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          One-on-One
        </button>
        <button
          onClick={() => switchType("pool")}
          className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
            bookingType === "pool"
              ? "bg-white text-[#6D35D9] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Pool Bookings
        </button>
        <button
          onClick={() => switchType("all")}
          className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
            bookingType === "all"
              ? "bg-white text-[#6D35D9] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Bookings
        </button>
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-[#E4DDF2] bg-[#FAF8FE] p-4 mb-4">
        {/* Search */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            placeholder={
              bookingType === "pool" ? "Faculty…" : "Student / faculty…"
            }
            className={sel}
          />
        </div>

        {/* Mode */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Mode</label>
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value as "" | "chapter" | "slot"); resetPage(); }}
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

        {/* Booking Type (all bookings only) */}
        {bookingType === "all" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Type</label>
            <select
              value={bookingTypeFilter}
              onChange={(e) => { setBookingTypeFilter(e.target.value as "" | "oneToOne" | "pooling"); resetPage(); }}
              className={`${sel} w-36`}
            >
              <option value="">All</option>
              <option value="oneToOne">One-to-One</option>
              <option value="pooling">Pooling</option>
            </select>
          </div>
        )}

        {/* Status (all bookings only) */}
        {bookingType === "all" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value as "" | "interested" | "confirmed" | "cancelled" | "expired"); resetPage(); }}
              className={`${sel} w-36`}
            >
              <option value="">All</option>
              <option value="interested">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        )}

        {/* Contacted (one-on-one + all bookings) */}
        {(bookingType === "one-on-one" || bookingType === "all") && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Contacted</label>
            <select
              value={isContacted}
              onChange={(e) => { setIsContacted(e.target.value as "" | "true" | "false"); resetPage(); }}
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

        {/* Export */}
        <div className="ml-auto">
          <ExportButton onExport={handleExport} />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      {loading ? (
        <TopLoader loading />
      ) : bookingType === "one-on-one" ? (
        <AdminTable
          data={oneOnOneData}
          columns={oneOnOneCols}
          actions={[{ label: "View", onClick: (row) => setSelectedBooking(row) }]}
          getRowId={(row) => row.id}
        />
      ) : bookingType === "pool" ? (
        <AdminTable
          data={poolData}
          columns={poolColumns}
          actions={[{ label: "View", onClick: (row) => setSelectedPoolBooking(row) }]}
          getRowId={(_, i) => String(i)}
        />
      ) : (
        <AdminTable
          data={allBookingsData}
          columns={allBookingCols}
          getRowId={(row) => row.id}
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
