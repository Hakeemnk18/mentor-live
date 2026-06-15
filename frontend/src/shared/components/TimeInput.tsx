import { useState } from "react";

type Period = "AM" | "PM";

type Props = {
  /** "HH:MM" in 24hr format when complete, "" when incomplete/invalid */
  value: string;
  onChange: (value: string) => void;
  className?: string;
  hasError?: boolean;
  disabled?: boolean;
};

const parse24 = (value: string) => {
  const m = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h24 = parseInt(m[1], 10);
  const period: Period = h24 >= 12 ? "PM" : "AM";
  const hour = h24 % 12 || 12;
  return { hour: String(hour), minute: m[2], period };
};

const toValue = (hour: string, minute: string, period: Period): string => {
  const h = parseInt(hour, 10);
  const m = parseInt(minute, 10);
  if (isNaN(h) || isNaN(m) || h < 1 || h > 12 || m < 0 || m > 59) return "";
  const h24 = (h % 12) + (period === "PM" ? 12 : 0);
  return `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/** Typable hour/minute inputs with an AM/PM toggle, emitting "HH:MM" (24hr) */
export default function TimeInput({ value, onChange, className = "", hasError = false, disabled = false }: Props) {
  const initial = parse24(value);
  const [hour, setHour] = useState(initial?.hour ?? "");
  const [minute, setMinute] = useState(initial?.minute ?? "");
  const [period, setPeriod] = useState<Period>(initial?.period ?? "PM");

  const update = (h: string, m: string, p: Period) => {
    setHour(h);
    setMinute(m);
    setPeriod(p);
    onChange(toValue(h, m, p));
  };

  const handleHourChange = (raw: string) => {
    update(raw.replace(/\D/g, "").slice(0, 2), minute, period);
  };

  const handleHourBlur = () => {
    if (!hour) return;
    const h = Math.min(Math.max(parseInt(hour, 10), 1), 12);
    update(String(h), minute, period);
  };

  const handleMinuteChange = (raw: string) => {
    update(hour, raw.replace(/\D/g, "").slice(0, 2), period);
  };

  const handleMinuteBlur = () => {
    if (!minute) return;
    const m = Math.min(parseInt(minute, 10), 59);
    update(hour, String(m).padStart(2, "0"), period);
  };

  const inputCls = `w-12 px-2 py-2 text-sm text-center border rounded focus:outline-none focus:ring-2 focus:ring-[#DB313E]/30 ${
    hasError ? "border-red-400" : "border-gray-300"
  } ${disabled ? "bg-gray-100 text-gray-400" : "bg-white"}`;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <input
        type="text"
        inputMode="numeric"
        placeholder="HH"
        value={hour}
        disabled={disabled}
        onChange={(e) => handleHourChange(e.target.value)}
        onBlur={handleHourBlur}
        className={inputCls}
      />
      <span className="text-gray-400">:</span>
      <input
        type="text"
        inputMode="numeric"
        placeholder="MM"
        value={minute}
        disabled={disabled}
        onChange={(e) => handleMinuteChange(e.target.value)}
        onBlur={handleMinuteBlur}
        className={inputCls}
      />
      <div className="flex border border-gray-300 rounded overflow-hidden ml-1">
        <button
          type="button"
          disabled={disabled}
          onClick={() => update(hour, minute, "AM")}
          className={`px-2 py-2 text-xs font-medium transition-colors ${
            period === "AM" ? "bg-[#DB313E] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          AM
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => update(hour, minute, "PM")}
          className={`px-2 py-2 text-xs font-medium border-l border-gray-300 transition-colors ${
            period === "PM" ? "bg-[#DB313E] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
}
