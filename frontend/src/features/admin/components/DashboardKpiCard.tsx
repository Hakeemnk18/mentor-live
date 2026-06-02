import React from "react";
import { useNavigate } from "react-router-dom";

export type BackendKpiData = {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  trend?: { percentageChange: number; direction: "up" | "down" | "flat"; comparedTo: string };
  action?: { label: string; href: string };
  sparkline?: number[];
};

type KpiCardProps = {
  data: BackendKpiData;
};

// Helper function to assign icons and colors based on the backend 'key'
const getKpiStyling = (key: string) => {
  switch (key) {
    case "total_bookings":
      return { accent: "bg-blue-600 text-white", bgGradient: "bg-blue-600", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> };
    case "total_faculties":
      return { accent: "bg-violet-600 text-white", bgGradient: "bg-violet-600", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> };
    case "total_students":
      return { accent: "bg-emerald-500 text-white", bgGradient: "bg-emerald-500", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg> };
    case "uncontacted_bookings":
    default:
      return { accent: "bg-[#DB313E] text-white", bgGradient: "bg-[#DB313E]", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> };
  }
};

export default function DashboardKpiCard({ data }: KpiCardProps) {
  const navigate = useNavigate();
  const style = getKpiStyling(data.key);

  const isTrendUp = data.trend?.direction === "up";
  const trendColor = isTrendUp ? "text-emerald-500" : data.trend?.direction === "down" ? "text-rose-500" : "text-gray-400";
  const trendArrow = isTrendUp ? "↗" : data.trend?.direction === "down" ? "↘" : "→";

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100/60 shadow-sm hover:shadow-md transition-all duration-300 p-5 group flex flex-col justify-between h-full min-h-[220px]">
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 blur-2xl ${style.bgGradient}`} />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${style.accent} ring-4 ring-white`}>
          {style.icon}
        </div>
        
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{data.label}</p>
          {data.trend && (
            <span className={`text-xs font-bold ${trendColor}`}>
              {trendArrow} {data.trend.percentageChange}%
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-6 mb-4">
        <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{data.formattedValue}</p>
      </div>

      <div className="relative z-10 mt-auto pt-2">
        {data.action ? (
          <button 
            onClick={() => navigate(data.action!.href)}
            className="w-full bg-gray-50 hover:bg-[#DB313E]/10 text-gray-600 hover:text-[#DB313E] border border-gray-100 hover:border-[#DB313E]/20 text-sm font-bold py-2.5 px-4 rounded-xl flex justify-between items-center transition-all duration-200"
          >
            {data.action.label}
            <span className="text-lg leading-none">&rarr;</span>
          </button>
        ) : (
          <div className={`h-1.5 w-full rounded-full opacity-80 ${style.bgGradient}`} />
        )}
      </div>
    </div>
  );
}