import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  description?: React.ReactNode;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  description,
}: PaginationProps) {
  // Hide pagination if there's only 1 page (or 0)
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-gray-600">
        Page {page} of {totalPages} {description && <span>&nbsp;&middot;&nbsp; {description}</span>}
      </p>

      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          Prev
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
