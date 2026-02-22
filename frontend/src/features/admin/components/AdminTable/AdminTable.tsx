import type { Column, TableAction } from "./types";

type AdminTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  getRowId?: (row: T, index: number) => string;
};



export default function AdminTable<T>({
  data,
  columns,
  actions,
  getRowId,
}: AdminTableProps<T>) {
  const colSpan = columns.length + (actions ? 1 : 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-medium">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={colSpan}
                className="px-4 py-10 text-center text-sm text-gray-500"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={getRowId ? getRowId(row, idx) : String(idx)}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render(row)}
                  </td>
                ))}

                {actions && (
                  <td className="px-4 py-3 text-right space-x-3">
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
                          className={
                            customClass ??
                            `text-sm font-medium cursor-pointer transition-opacity ${
                              action.variant === "danger"
                                ? "text-red-600 hover:opacity-80"
                                : "text-gray-600 hover:text-[#DB313E]"
                            }`
                          }
                        >
                          {label}
                        </button>
                      );
                    })}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
