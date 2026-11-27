import AdminStatusSelect from "./AdminStatusSelect";
import type { StatusConfirm } from "./AdminStatusSelect";
import type { StatusTone } from "./styles";

type Value = "on" | "off";

type Props = {
  /** current state (e.g. not blocked / visible) */
  active: boolean;
  /** called with the new state; should catch its own errors. The badge shows a spinner until it settles. */
  onChange: (nextActive: boolean) => Promise<void>;
  /** names the control for screen readers / phone sheet title, e.g. "Status" */
  label?: string;
  activeLabel?: string;
  inactiveLabel?: string;
  inactiveTone?: StatusTone;
  /** "Are you sure?" before switching OFF (e.g. blocking). Switching ON applies straight away unless confirmActive is set. */
  confirmInactive?: StatusConfirm;
  confirmActive?: StatusConfirm;
  readOnly?: boolean;
};

/**
 * Two-state status badge you can change from the table (Active ⇄ Blocked, Visible ⇄ Hidden …).
 * Built on AdminStatusSelect, so it looks and behaves like the Bookings status.
 */
export default function AdminActiveStatus({
  active,
  onChange,
  label = "Status",
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  inactiveTone = "danger",
  confirmInactive,
  confirmActive,
  readOnly,
}: Props) {
  return (
    <AdminStatusSelect<Value>
      label={label}
      value={active ? "on" : "off"}
      readOnly={readOnly}
      options={[
        { value: "on", label: activeLabel, tone: "success" },
        { value: "off", label: inactiveLabel, tone: inactiveTone },
      ]}
      confirm={(next) => (next === "off" ? confirmInactive ?? null : confirmActive ?? null)}
      onChange={(next) => onChange(next === "on")}
    />
  );
}
