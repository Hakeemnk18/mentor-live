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
}: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium"
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-right">Actions</th>
            )}
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {data.map((row, idx) => (
            <tr
              key={(row as any).id || idx}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render
                    ? col.render(row)
                    : (row as any)[col.key]}
                </td>
              ))}

              {actions && (
                <td className="px-4 py-3 text-right space-x-3">
                  {actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => action.onClick(row)}
                      className={`text-sm font-medium ${
                        action.variant === "danger"
                          ? "text-red-600"
                          : "text-[#DB313E]"
                      } hover:underline`}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
