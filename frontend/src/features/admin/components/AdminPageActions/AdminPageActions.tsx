import type { PageAction } from "./types";

type Props = {
  title: string;
  actions?: PageAction[];
  children?: React.ReactNode; // filters/search slot
};

export default function AdminPageHeader({
  title,
  actions,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          {title}
        </h1>
        {children && <div className="mt-2">{children}</div>}
      </div>

      {/* Right: Actions */}
      {actions && (
        <div className="flex gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`px-4 py-2 text-sm rounded font-medium ${
                action.variant === "secondary"
                  ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-[#DB313E] text-white hover:opacity-90"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
