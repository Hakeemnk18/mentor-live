import type { Column, TableAction } from "./types";

type AdminTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  getRowId?: (row: T, index: number) => string;
};

/** Rounded pill shape shared by every row action; pages may still pass their own colour classes. */
const ACTION_SHAPE =
  "inline-flex items-center px-3 py-1.5 rounded-full transition-colors hover:bg-[#F4F1FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D35D9]/30";

export default function AdminTable<T>({
  data,
  columns,
  actions,
  getRowId,
}: AdminTableProps<T>) {
  const colSpan = columns.length + (actions ? 1 : 0);

  return (
    <div className="rounded-2xl border border-[#E4DDF2] bg-white shadow-[0_12px_32px_-22px_rgba(42,22,80,0.35)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F4F1FA] text-[#655B7E]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={getRowId ? getRowId(row, idx) : String(idx)}
                  className="border-t border-[#EFE9FA] transition-colors hover:bg-[#FAF8FE]"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      {col.render(row)}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        {actions.map((action) => {
                          const label =
                            typeof action.label === "function"
                              ? action.label(row)
                              : action.label;
                          const customClass =
                            typeof action.className === "function"
                              ? action.className(row)
                              : action.className;
                          return (
                            <button
                              key={label}
                              onClick={() => action.onClick(row)}
                              className={`${ACTION_SHAPE} ${
                                customClass ??
                                `text-sm font-medium cursor-pointer ${
                                  action.variant === "danger"
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-gray-600 hover:text-[#6D35D9]"
                                }`
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
