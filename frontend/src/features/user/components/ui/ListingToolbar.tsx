type ListingToolbarProps = {
  /** Left side — usually <SubjectPills/> (optional) */
  filters?: React.ReactNode;
  /** Right side — usually <SearchInput/> */
  search: React.ReactNode;
  /** Small text under the bar, e.g. "Showing 8 tutors" */
  resultLabel?: React.ReactNode;
};

/** White floating card that holds the subject pills + search on listing pages. */
const ListingToolbar: React.FC<ListingToolbarProps> = ({ filters, search, resultLabel }) => (
  <>
    <div className="bg-white rounded-[26px] p-3 shadow-[0_20px_44px_-24px_rgba(42,22,80,.4)] flex flex-wrap gap-3 items-center justify-between">
      {filters && <div className="flex-[10_1_380px] min-w-0">{filters}</div>}
      <div className={`${filters ? "flex-[1_1_240px]" : "flex-1"} max-w-full`}>{search}</div>
    </div>
    {resultLabel && <div className="mt-[22px] mx-1 text-sm font-bold text-ml-muted">{resultLabel}</div>}
  </>
);

export default ListingToolbar;
