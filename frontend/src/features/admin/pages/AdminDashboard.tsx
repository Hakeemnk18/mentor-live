import React from "react";
import { useNavigate } from "react-router-dom";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";
import DashboardMotivationCard from "../components/DashboardMotivationCard";
import DashboardKpiCard from "../components/DashboardKpiCard";
import DashboardRankingList from "../components/DashboardRankingList";

// Custom Hooks
import { useMotivationSummary } from "../hooks/use.motivation.summary";
import { useKpiCards } from "../hooks/use.kpi.cards"; 
import { useAnalysisTable } from "../hooks/use.analysis.table";

/* ── Quick link card component (Included here for completeness) ── */
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
        <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#DB313E] animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading Platform Data...</p>
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

        {/* ── Row 2: Analysis Tables ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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