import { Search } from "./ui/Icons";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <label className="flex items-center gap-2.5 w-full h-[46px] px-4 rounded-full bg-ml-mist text-ml-muted focus-within:ring-2 focus-within:ring-ml-violet/30 transition">
      <Search />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-[15px] text-ml-ink placeholder:text-ml-muted/80"
      />
    </label>
  );
};

export default SearchInput;
