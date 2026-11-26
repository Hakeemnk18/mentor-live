import AdminButton from "../ui/AdminButton";
import type { PageAction } from "./types";

type Props = {
  title: string;
  actions?: PageAction[];
  children?: React.ReactNode; // filters/search slot
};

/** Page title + main buttons (e.g. "Create Faculty") at the top of every admin page. */
export default function AdminPageHeader({ title, actions, children }: Props) {
  return (
    <div className="pt-1 pb-4 sm:pb-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="m-0 text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[#2A1650]">{title}</h1>
          {children && <div className="mt-3">{children}</div>}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <AdminButton
                key={action.label}
                onClick={action.onClick}
                variant={action.variant === "secondary" ? "outline" : "primary"}
                icon={
                  action.variant === "secondary" ? undefined : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  )
                }
              >
                {action.label}
              </AdminButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
