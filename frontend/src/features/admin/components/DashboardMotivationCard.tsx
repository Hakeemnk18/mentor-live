import { useNavigate } from "react-router-dom";
import type { DashboardMotivationSummary } from "../types/admin.types";// Adjust path to where your type is

type Props = {
  data?: DashboardMotivationSummary | null;
};

export default function DashboardMotivationCard({ data }: Props) {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div className="h-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
      {/* Background glowing blobs */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-20 -mb-10 w-32 h-32 bg-[#6D35D9] opacity-20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 w-3/4">
        <h3 className="text-xl font-bold mb-1">{data.title}</h3>
        <p className="text-sm text-gray-400 font-medium leading-relaxed mt-2">
          {data.subtitle}
        </p>

        <div className="mt-6">
          <p className="text-4xl font-extrabold tracking-tight">
            {data.metric.formatted}
          </p>
          {data.target && (
            <p className="text-xs text-[#6D35D9] mt-1 font-bold tracking-wide">
              {data.target.progressPercentage}% of target achieved
            </p>
          )}
        </div>

        {data.cta && (
          <button 
            onClick={() => navigate(data.cta!.path)}
            className="mt-6 bg-[#6D35D9] hover:bg-[#5B2BC0] text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {data.cta.label}
          </button>
        )}
      </div>

      {/* Trophy / Icon Graphic */}
      <div className="absolute right-2 bottom-6 w-1/4 flex justify-end pr-4 pointer-events-none opacity-90">
        <svg viewBox="0 0 128 128" className="w-24 h-24 drop-shadow-xl">
          <path fill="#FFB02E" d="M110.1 23.5H98.9V16c0-4.4-3.6-8-8-8H37.1c-4.4 0-8 3.6-8 8v7.5H17.9c-6.6 0-12 5.4-12 12 0 16.2 10.3 29.9 24.6 34.3 3.6 15.3 16.5 26.9 32.5 28.5v13.8H48.4c-3.3 0-6 2.7-6 6v3.9h43.1v-3.9c0-3.3-2.7-6-6-6H64.9V90.3c16-1.6 28.9-13.2 32.5-28.5 14.3-4.4 24.6-18.1 24.6-34.3.1-6.6-5.3-12-11.9-12zM27.2 56.6C18.6 51 13 41.5 13 30.5c0-2.8 2.2-5 5-5h11.1v36.3c-.6-1.7-1.3-3.4-1.9-5.2zm87.8-26.1c0 11-5.6 20.5-14.2 26.1-.6 1.8-1.3 3.5-1.9 5.2V25.5h11.1c2.8 0 5 2.2 5 5z"/>
          <path fill="#F4900C" d="M98.9 16v74.3c0 14.3-11.6 25.9-25.9 25.9H55V8.1h35.9c4.4-.1 8 3.5 8 7.9z"/>
        </svg>
      </div>
    </div>
  );
}