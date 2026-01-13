import { useMemo, useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

const columns = [
  { key: "name", label: "Name" },
  {
    key: "subject",
    label: "Subject",
    render: (f: any) => f.SubjectVariant?.subject?.name,
  },
  {
    key: "price",
    label: "Price",
    render: (f: any) => `₹${f.price}`,
  },
];

const facultyData = [
  {
    id: "1",
    name: "Dr. Anoop Menon",
    price: 1200,
    isDeleted: false,
    SubjectVariant: { subject: { name: "Physics" } },
  },
  {
    id: "2",
    name: "Ms. Sneha Raj",
    price: 950,
    isDeleted: false,
    SubjectVariant: { subject: { name: "Mathematics" } },
  },
  {
    id: "3",
    name: "Mr. Rahul Nair",
    price: 1100,
    isDeleted: true,
    SubjectVariant: { subject: { name: "Chemistry" } },
  },
];

export default function FacultyPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [page, setPage] = useState(1);
const navigate = useNavigate();
  // 🔍 FILTER
  const filtered = useMemo(() => {
    return facultyData.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // ↕ SORT
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      return a.name.localeCompare(b.name);
    });
  }, [filtered, sortBy]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      <AdminPageActions
        title="Faculty"
        actions={[
          {
            label: "+ Create Faculty",
            onClick: () => navigate("/admin/faculty/create"),
          },
        ]}
      />

      {/* 🔧 FILTER + SORT BAR */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search faculty..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {/* 📊 TABLE */}
      <AdminTable
        data={paginated}
        columns={columns}
        actions={[
          { label: "Edit", onClick: (f) => console.log(f) },
          { label: "Delete", variant: "danger", onClick: (f) => console.log(f) },
        ]}
      />

      {/* 📄 PAGINATION CONTROLS */}
      <div className="flex items-center justify-between text-sm">
        <span>
          Page {page} of {totalPages}
        </span>

        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
