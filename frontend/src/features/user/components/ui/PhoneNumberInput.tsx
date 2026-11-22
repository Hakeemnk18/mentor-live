import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { fieldCls } from "./formStyles";

/* Countries most of our students book from appear first; the rest follow A–Z. */
const PRIORITY: CountryCode[] = ["IN", "AE", "SA", "QA", "OM", "KW", "BH", "GB", "US"];

const regionName = (() => {
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    return (c: string) => dn.of(c) ?? c;
  } catch {
    return (c: string) => c;
  }
})();

/** 🇮🇳-style flag from an ISO country code */
const flag = (c: string) => String.fromCodePoint(...[...c.toUpperCase()].map((ch) => 0x1f1a5 + ch.charCodeAt(0)));

const ALL = getCountries()
  .map((c) => ({ code: c, name: regionName(c), dial: getCountryCallingCode(c) }))
  .sort((a, b) => a.name.localeCompare(b.name));
const COUNTRY_OPTIONS = [
  ...PRIORITY.map((c) => ALL.find((x) => x.code === c)!).filter(Boolean),
  ...ALL.filter((x) => !PRIORITY.includes(x.code)),
];

type Props = {
  id?: string;
  country: CountryCode;
  onCountryChange: (c: CountryCode) => void;
  /** number as typed (national digits, or a full +number which switches the country) */
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

/** Country code picker + phone number, styled like the other booking fields. Works for every country. */
export default function PhoneNumberInput({ id, country, onCountryChange, value, onChange, error }: Props) {
  return (
    <div className="flex gap-2">
      <label className="relative flex-shrink-0 w-[108px]">
        <span className="sr-only">Country code</span>
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value as CountryCode)}
          className={`${fieldCls(error)} appearance-none pr-8 pl-3 cursor-pointer text-transparent`}
          aria-label="Country code"
        >
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.code} value={c.code} className="text-[#2A1650]">
              {flag(c.code)} +{c.dial} — {c.name}
            </option>
          ))}
        </select>
        {/* show only flag + code in the closed box (the list shows full names) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-3 right-8 flex items-center text-[15px] font-semibold text-ml-ink whitespace-nowrap overflow-hidden"
        >
          {flag(country)} +{getCountryCallingCode(country)}
        </span>
        <svg
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ml-violet"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5.5 7.75 10 12.25l4.5-4.5" />
        </svg>
      </label>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d+\s()-]/g, ""))}
        placeholder="Phone number"
        className={`${fieldCls(error)} flex-1 min-w-0`}
      />
    </div>
  );
}
