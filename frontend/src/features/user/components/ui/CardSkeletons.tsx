/** Pulsing placeholder cards shown while a grid is loading. */
const CardSkeletons: React.FC<{ count?: number; imageHeight?: string; gridCls: string }> = ({
  count = 8,
  imageHeight = "h-[180px]",
  gridCls,
}) => (
  <div className={gridCls}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white rounded-[28px] overflow-hidden animate-pulse">
        <div className={`${imageHeight} bg-ml-lav`} />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-ml-lav rounded w-3/4" />
          <div className="h-3 bg-ml-lav rounded w-1/2" />
          <div className="h-3 bg-ml-lav rounded w-full" />
        </div>
      </div>
    ))}
  </div>
);

export default CardSkeletons;
