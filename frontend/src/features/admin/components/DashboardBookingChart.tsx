import { useState, useEffect } from "react";
import { useAnalysisChart } from "../hooks/use.analysis.chart";
import { useBookingStatus } from "../hooks/use.booking.status";
import type { BookingChartRange } from "../types/admin.types";

const RANGES: BookingChartRange[] = ["Year", "Month", "Week", "Daily"];

const CHART_HEIGHT = 110;

const STATUS_COLORS: Record<string, string> = {
  interested: "#3B82F6",
  confirmed: "#10B981",
  expired: "#EF4444",
  cancelled: "#F59E0B",
  completed: "#6366F1",
};

export default function DashboardBookingChart() {
  const [range, setRange] = useState<BookingChartRange>("Year");
  const [mounted, setMounted] = useState(false);

  const { data: chartData, isLoading: chartLoading } = useAnalysisChart(range);
  const { data: statusData, isLoading: statusLoading } = useBookingStatus();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (chartLoading || statusLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-h-[300px] relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-50/50 to-transparent" />
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-28" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
          <div className="flex gap-3 mt-1">
            <div className="h-3 bg-gray-100 rounded w-20" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
          <div className="h-28 bg-gray-100 rounded-xl mt-2" />
          <div className="border-t border-gray-100 pt-4">
            <div className="h-4 bg-gray-200 rounded w-36 mb-3" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="h-3 bg-gray-100 rounded w-12" />
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allValues = chartData?.series.flatMap((s) => s.data) ?? [];
  const max = Math.max(...allValues, 1);
  const yTicks = [1, 0.5, 0].map((p) => Math.round(max * p));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">

      {/* ── Booking Trend ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800">Booking Trend</h3>
          <div className="flex gap-0.5 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-[9px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                  range === r
                    ? "bg-[#DB313E] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 mb-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-[#DB313E]" />
            <span className="text-[9px] text-gray-500 font-medium">One-to-One</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-[#3B82F6]" />
            <span className="text-[9px] text-gray-500 font-medium">Pooling</span>
          </div>
        </div>

        {/* Y-axis + bars */}
        <div className="flex w-full">
          {/* Y-axis labels */}
          <div
            className="flex flex-col justify-between items-end pr-1.5 shrink-0"
            style={{ height: CHART_HEIGHT }}
          >
            {yTicks.map((tick) => (
              <span key={tick} className="text-[8px] text-gray-400 leading-none">
                {tick}
              </span>
            ))}
          </div>

          {/* Chart area */}
          <div className="flex-1 flex flex-col">
            {/* Bars */}
            <div
              className="flex items-end gap-1 w-full"
              style={{ height: CHART_HEIGHT }}
            >
              {chartData?.categories.map((cat, idx) => {
                const v1 = chartData.series[0]?.data[idx] ?? 0;
                const v2 = chartData.series[1]?.data[idx] ?? 0;
                const h1 = max > 0 ? (v1 / max) * CHART_HEIGHT : 0;
                const h2 = max > 0 ? (v2 / max) * CHART_HEIGHT : 0;
                return (
                  <div key={cat} className="flex items-end gap-0.5 flex-1 min-w-0">
                    <div
                      className="flex-1 bg-[#DB313E] rounded-t-sm transition-all duration-500"
                      style={{
                        height: mounted ? h1 : 0,
                        minHeight: v1 > 0 ? 1 : 0,
                      }}
                      title={`One-to-One: ${v1}`}
                    />
                    <div
                      className="flex-1 bg-[#3B82F6] rounded-t-sm transition-all duration-500"
                      style={{
                        height: mounted ? h2 : 0,
                        minHeight: v2 > 0 ? 1 : 0,
                      }}
                      title={`Pooling: ${v2}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex gap-1 mt-1">
              {chartData?.categories.map((cat, idx) => (
                <div key={idx} className="flex-1 min-w-0 flex justify-center">
                  <span className="text-[7px] text-gray-400 truncate">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Distribution ── */}
      <div className="border-t border-gray-100 pt-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800">Status Distribution</h3>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            {statusData?.totalBookings ?? 0} total
          </span>
        </div>

        <div className="space-y-2.5">
          {statusData?.statuses.map((s) => (
            <div key={s.status}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 capitalize font-medium">
                  {s.status}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-800">{s.count}</span>
                  <span className="text-[10px] text-gray-400">({s.percentage}%)</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: mounted ? `${s.percentage}%` : "0%",
                    backgroundColor: STATUS_COLORS[s.status] ?? "#E5E7EB",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
