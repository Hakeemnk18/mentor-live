import React from "react";
import { useNavigate } from "react-router-dom";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import DashboardMotivationCard from "../components/DashboardMotivationCard";
import DashboardKpiCard from "../components/DashboardKpiCard";
import DashboardRankingList from "../components/DashboardRankingList";
import DashboardBookingChart from "../components/DashboardBookingChart";

// Custom Hooks
import { useMotivationSummary } from "../hooks/use.motivation.summary";
import { useKpiCards } from "../hooks/use.kpi.cards"; 
import { useAnalysisTable } from "../hooks/use.analysis.table";

/* ── Quick link card component ── */
function QuickLink({ label, path, icon, desc }: { label: string; path: string; icon: React.ReactNode, desc: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="flex items-start gap-4 bg-white border border-gray-100/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group w-full"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-50/80 group-hover:bg-[#DB313E]/10 flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-[#DB313E] transition-colors border border-gray-100 group-hover:border-[#DB313E]/20">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#DB313E] transition-colors">{label}</h3>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}

export default function AdminDashboardPage() {
  // Fetch data using the custom hooks
  const { data: motivationSummary, isLoading: motivationIsLoading } = useMotivationSummary();
  const { data: kpiCards, isLoading: kpiIsLoading } = useKpiCards();
  const { data: analysisTables, isLoading: tablesIsLoading } = useAnalysisTable();

  const isLoading = motivationIsLoading || kpiIsLoading || tablesIsLoading;

  if (isLoading) {
    return (
      <AdminPageContainer>
        <div className="w-full space-y-6 pb-12">
          {/* ── Row 1 Skeletons: Motivation + KPIs ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
            {/* Motivation Card Skeleton */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100/50 to-transparent"></div>
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded-md w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded-md w-2/3"></div>
              </div>
              <div className="animate-pulse mt-8">
                <div className="h-10 bg-gray-200 rounded-md w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
              </div>
            </div>

            {/* KPI Cards Skeleton */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-h-[220px] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"></div>
                <div className="flex justify-between items-start animate-pulse">
                  <div className="w-11 h-11 bg-gray-100 rounded-xl"></div>
                  <div className="w-16 h-4 bg-gray-100 rounded-md mt-1"></div>
                </div>
                <div className="mt-6 mb-4 animate-pulse">
                  <div className="h-10 bg-gray-200 rounded-md w-1/2"></div>
                </div>
                <div className="mt-auto animate-pulse">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Row 2 Skeletons: Chart + Analysis Tables ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Chart skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-h-[300px] relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"></div>
              <div className="animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  <div className="h-4 bg-gray-100 rounded w-24"></div>
                </div>
                <div className="h-28 bg-gray-100 rounded-xl"></div>
                <div className="border-t border-gray-100 pt-3 space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-1">
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-100 rounded w-12"></div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Ranking list skeletons */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[300px] relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"></div>
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-8"></div>
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0"></div>
                          <div className="w-full">
                            <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded-md w-1/3"></div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <div className="w-full space-y-6 pb-12">
        
        {/* ── Row 1: Primary Metrics ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
          {/* Motivation Card: Spans 2 columns */}
          <div className="lg:col-span-2">
            <DashboardMotivationCard data={motivationSummary} />
          </div>

          {/* Dynamic KPI Cards mapping directly from backend data array */}
          {kpiCards?.map((kpiData: any) => (
            <div key={kpiData.key} className="lg:col-span-1">
              <DashboardKpiCard data={kpiData} />
            </div>
          ))}
        </div>

        {/* ── Row 2: Chart + Analysis Tables ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <DashboardBookingChart />

          <DashboardRankingList 
            title="Top Performing Faculty" 
            badgeText={`Range: ${analysisTables?.topFacultyBookings?.range || '1y'}`}
            items={analysisTables?.topFacultyBookings?.faculties || []} 
          />
          
          <DashboardRankingList 
            title="Low Booking Faculty" 
            badgeText={`Range: ${analysisTables?.lowFacultyBookings?.range || '1y'}`}
            items={analysisTables?.lowFacultyBookings?.faculties || []} 
          />

          {/* Using the chapters list from the zero bookings data */}
          <DashboardRankingList 
            title="Zero Booking Chapters" 
            badgeText={`Range: ${analysisTables?.zeroBookingItems?.range || '1y'}`}
            type="chapter"
            items={analysisTables?.zeroBookingItems?.chapters?.map((c: any) => ({
              facultyId: c.chapterId, // Map to component props
              name: c.name,
              iconUrl: c.iconUrl
            })) || []} 
          />
        </div>

        {/* ── Row 3: Directory Access ── */}
        <section className="bg-white border border-gray-100/60 shadow-sm rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Directory Access</h2>
            <p className="text-sm text-gray-500 mt-1">Quick links to manage your platform content</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickLink path="/admin/bookings" label="Bookings Management" desc="Review student session bookings" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            } />
            <QuickLink path="/admin/students" label="Registered Students" desc="Directory of user accounts" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            } />
            <QuickLink path="/admin/faculty" label="Faculty Team" desc="Manage tutor and teacher profiles" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
            } />
            <QuickLink path="/admin/banners" label="Hero Banners" desc="Edit homepage hero visuals" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            } />
          </div>
        </section>

      </div>
    </AdminPageContainer>
  );
}