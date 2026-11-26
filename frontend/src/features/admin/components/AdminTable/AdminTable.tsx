import type { Column, TableAction } from "./types";

type AdminTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  getRowId?: (row: T, index: number) => string;
  /**
   * Phones (under 640px): show each row as a card instead of a sideways-scrolling table.
   * Set to false to go back to the scrolling table everywhere.
   */
  mobileCards?: boolean;
};

/** Rounded pill shape shared by every row action; pages may still pass their own colour classes. */
const ACTION_SHAPE =
  "inline-flex items-center px-3 py-1.5 rounded-full transition-colors hover:bg-[#F4F1FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D35D9]/30";

export default function AdminTable<T>({
  data,
  columns,
  actions,
  getRowId,
  mobileCards = true,
}: AdminTableProps<T>) {
  const colSpan = columns.length + (actions ? 1 : 0);
  const rowKey = (row: T, idx: number) => (getRowId ? getRowId(row, idx) : String(idx));

  const renderActions = (row: T) =>
    actions!.map((action) => {
      const label = typeof action.label === "function" ? action.label(row) : action.label;
      const customClass = typeof action.className === "function" ? action.className(row) : action.className;
      return (
        <button
          key={label}
          type="button"
          onClick={() => action.onClick(row)}
          className={`${ACTION_SHAPE} ${
            customClass ??
            `text-sm font-medium cursor-pointer ${
              action.variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-gray-600 hover:text-[#6D35D9]"
            }`
          }`}
        >
          {label}
        </button>
      );
    });

  const [titleCol, ...detailCols] = columns;

  return (
    <>
    {/* ── Phone: one card per row ── */}
    {mobileCards && (
      <div className="sm:hidden">
        {data.length === 0 ? (
          <div className="rounded-2xl border border-[#E4DDF2] bg-white px-4 py-10 text-center text-sm text-gray-500">
            No records found
          </div>
        ) : (
          <ul className="m-0 p-0 list-none flex flex-col gap-3">
            {data.map((row, idx) => (
              <li
                key={rowKey(row, idx)}
                className="rounded-2xl border border-[#E4DDF2] bg-white p-4 shadow-[0_10px_24px_-20px_rgba(42,22,80,0.45)]"
              >
                {titleCol && (
                  <div className="text-[15px] font-semibold text-[#2A1650] min-w-0 break-words">{titleCol.render(row)}</div>
                )}
                {detailCols.length > 0 && (
                  <dl className="m-0 mt-3 grid grid-cols-[minmax(84px,auto)_1fr] gap-x-4 gap-y-2.5 text-sm">
                    {detailCols.map((col) => (
                      <div key={col.key} className="contents">
                        <dt className="pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A80A3]">{col.label}</dt>
                        <dd className="m-0 min-w-0 break-words text-gray-700">{col.render(row)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {actions && actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EFE9FA] flex flex-wrap justify-end gap-1">{renderActions(row)}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}

    {/* ── Laptop / tablet (and phones when mobileCards is off): the table ── */}
    <div className={`${mobileCards ? "hidden sm:block" : ""} rounded-2xl border border-[#E4DDF2] bg-white shadow-[0_12px_32px_-22px_rgba(42,22,80,0.35)] overflow-hidden`}>
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
                  key={rowKey(row, idx)}
                  className="border-t border-[#EFE9FA] transition-colors hover:bg-[#FAF8FE]"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      {col.render(row)}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1">{renderActions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
