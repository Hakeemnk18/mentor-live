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
    <div className="border-b border-gray-200 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {title}
          </h1>

          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        {actions && (
          <div className="flex gap-2">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`px-4 py-2 text-sm rounded-md font-medium transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB313E]/40
                  ${
                    action.variant === "secondary"
                      ? "border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                      : "bg-[#DB313E] text-white hover:opacity-90 cursor-pointer"
                  }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
