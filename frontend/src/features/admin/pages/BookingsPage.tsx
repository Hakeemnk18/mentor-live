import { useEffect, useState } from "react";
import { AdminTable } from "../components/AdminTable";
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
import { AdminContactActions, AdminFilter, AdminFilterBar, AdminFilterSelect, AdminPageSize, AdminSearchInput, AdminStatusSelect, AdminTabs } from "../components/ui";
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

      {/* ── Booking type switch ── */}
      <AdminTabs
        label="Booking type"
        value={bookingType}
        onChange={switchType}
        className="mb-4"
        tabs={[
          { value: "one-on-one", label: "One-on-One" },
          { value: "pool", label: "Pool Bookings" },
          { value: "all", label: "All Bookings" },
        ]}
      />

      <AdminFilterBar
        canClear={!!search || !!mode || !!syllabusId || !!classId || !!bookingTypeFilter || !!status || !!isContacted}
        onClear={() => { setSearch(""); setMode(""); setSyllabusId(""); setClassId(""); setBookingTypeFilter(""); setStatus(""); setIsContacted(""); resetPage(); }}
      >
        <AdminFilter label="Search" wide>
          <AdminSearchInput
            value={search}
            onChange={(v) => { setSearch(v); resetPage(); }}
            placeholder={bookingType === "pool" ? "Faculty…" : "Student / faculty…"}
          />
        </AdminFilter>
        <AdminFilterSelect
          label="Mode"
          value={mode}
          onChange={(v) => { setMode(v); resetPage(); }}
          options={[{ value: "chapter", label: "Chapter" }, { value: "slot", label: "Slot" }]}
        />
        <AdminFilterSelect
          label="Syllabus"
          value={syllabusId}
          onChange={(v) => { setSyllabusId(v); resetPage(); }}
          options={syllabusList.map((x) => ({ value: x._id, label: x.name }))}
        />
        <AdminFilterSelect
          label="Class"
          value={classId}
          onChange={(v) => { setClassId(v); resetPage(); }}
          options={classesList.map((x) => ({ value: x._id, label: x.name }))}
        />
        {bookingType === "all" && (
          <AdminFilterSelect
            label="Type"
            value={bookingTypeFilter}
            onChange={(v) => { setBookingTypeFilter(v); resetPage(); }}
            options={[{ value: "oneToOne", label: "One-to-One" }, { value: "pooling", label: "Pooling" }]}
          />
        )}
        {bookingType === "all" && (
          <AdminFilterSelect
            label="Status"
            value={status}
            onChange={(v) => { setStatus(v); resetPage(); }}
            options={[
              { value: "interested", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "cancelled", label: "Cancelled" },
              { value: "expired", label: "Expired" },
            ]}
          />
        )}
        {(bookingType === "one-on-one" || bookingType === "all") && (
          <AdminFilterSelect
            label="Contacted"
            value={isContacted}
            onChange={(v) => { setIsContacted(v); resetPage(); }}
            options={[{ value: "true", label: "Yes" }, { value: "false", label: "Pending" }]}
          />
        )}
        <AdminFilter label="Rows per page" width="sm:w-32">
          <AdminPageSize value={limit} onChange={(n) => { setLimit(n); resetPage(); }} />
        </AdminFilter>
        <AdminFilter end width="sm:w-auto">
          <ExportButton onExport={handleExport} />
        </AdminFilter>
      </AdminFilterBar>

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
