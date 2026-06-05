type FacultyItem = {
  facultyId: string;
  name: string;
  totalBookings?: number;
  confirmedBookings?: number;
  iconUrl?: string;
};

type Props = {
  title: string;
  badgeText?: string;
  items: FacultyItem[];
  type?: "faculty" | "chapter"; // Kept here just in case you need it later
};

// REMOVED 'type = "faculty"' from the destructuring below
export default function DashboardRankingList({ title, badgeText, items }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100/60 shadow-sm p-6 h-full min-h-[300px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          {badgeText && (
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {badgeText}
            </span>
          )}
        </div>
      </div>

      {(!items || items.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
          No data available
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.facultyId || index} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                {/* Avatar/Icon Placeholder */}
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                  {item.iconUrl ? (
                    <img src={item.iconUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-[#DB313E] transition-colors">
                    {item.name}
                  </p>
                  {item.totalBookings !== undefined && (
                    <p className="text-xs text-gray-500">
                      Confirmed: {item.confirmedBookings || 0}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Stat Badge */}
              {item.totalBookings !== undefined && (
                <div className="flex items-center justify-center min-w-[2rem] h-8 px-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100">
                  {item.totalBookings}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}