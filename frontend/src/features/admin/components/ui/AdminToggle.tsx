type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  /** Helper text under the label; may depend on the state. */
  description?: string;
  disabled?: boolean;
};

/** On/off setting row. The whole row is the tap target (role="switch"). */
export default function AdminToggle({ checked, onChange, label, description, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        "w-full flex items-center justify-between gap-4 rounded-2xl border p-3.5 sm:p-4 text-left transition-colors",
        "focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6D35D9]/20",
        checked ? "border-[#D9CCF5] bg-[#F4F1FA]" : "border-[#E4DDF2] bg-[#FAF8FE] hover:border-[#CBB9F0]",
        disabled ? "opacity-55 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#2A1650]">{label}</span>
        {description && <span className="block text-xs text-gray-500 mt-0.5">{description}</span>}
      </span>
      <span
        aria-hidden
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#6D35D9]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
