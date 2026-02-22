import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOneOnOneBookings, getPoolBookings } from "../../../api/booking.api";
import { getStudents } from "../../../api/student.api";
import { getBanners } from "../../../api/banner.api";
import { getBlogs } from "../../../api/blog.api";
import { getTestimonials } from "../../../api/testimonial.api";
import AdminPageContainer from "../../../shared/components/AdminPageContainer";

/* ── Types ─────────────────────────────────────────────── */
interface Stats {
  oneOnOneTotal: number;
  oneOnOneUncontacted: number;
  poolTotal: number;
  studentsTotal: number;
  blogsActive: number;
  testimonialsActive: number;
}

interface ActiveBanner {
  id: string;
  image: { url: string };
  description: string;
  priority: number;
}

/* ── Stat card ─────────────────────────────────────────── */
function StatCard({
  label, value, sub, icon, accent, alert,
}: {
  label: string; value: number | string; sub?: string;
  icon: React.ReactNode; accent: string; alert?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className="flex items-end gap-2 mt-0.5">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {alert && sub && (
            <span className="mb-0.5 px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">
              {sub} pending
            </span>
          )}
        </div>
        {!alert && sub && (
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

/* ── Quick link card ───────────────────────────────────── */
function QuickLink({ label, path, icon }: { label: string; path: string; icon: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-[#DB313E]/40 hover:shadow-md transition-all text-left group"
    >
      <span className="w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-[#DB313E]/10 flex items-center justify-center transition-colors flex-shrink-0 text-gray-500 group-hover:text-[#DB313E]">
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-[#DB313E] transition-colors">{label}</span>
    </button>
  );
}

/* ── Dashboard ─────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [banners, setBanners] = useState<ActiveBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [oto, otoUncontacted, pool, students, blogs, testimonials, bannersData] =
          await Promise.allSettled([
            getOneOnOneBookings({ page: 1, limit: 1 }),
            getOneOnOneBookings({ page: 1, limit: 1, isContacted: false }),
            getPoolBookings({ page: 1, limit: 1 }),
            getStudents({ page: 1, limit: 1 }),
            getBlogs(),
            getTestimonials(),
            getBanners(),
          ]);

        setStats({
          oneOnOneTotal: oto.status === "fulfilled" ? (oto.value.total ?? 0) : 0,
          oneOnOneUncontacted: otoUncontacted.status === "fulfilled" ? (otoUncontacted.value.total ?? 0) : 0,
          poolTotal: pool.status === "fulfilled" ? (pool.value.total ?? 0) : 0,
          studentsTotal: students.status === "fulfilled" ? (students.value.total ?? 0) : 0,
          blogsActive: blogs.status === "fulfilled" ? blogs.value.filter((b) => !b.isDeleted).length : 0,
          testimonialsActive: testimonials.status === "fulfilled" ? testimonials.value.filter((t) => !t.isDeleted).length : 0,
        });

        if (bannersData.status === "fulfilled") {
          setBanners(bannersData.value.filter((b) => !b.isDeleted).sort((a, b) => a.priority - b.priority));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const iconClass = "w-5 h-5";

  return (
    <AdminPageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back — here's what's happening today</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="1:1 Bookings"
              value={stats?.oneOnOneTotal ?? 0}
              sub={stats?.oneOnOneUncontacted ? `${stats.oneOnOneUncontacted} uncontacted` : undefined}
              alert={!!stats?.oneOnOneUncontacted}
              accent="bg-[#DB313E]/10 text-[#DB313E]"
              icon={
                <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
            />
            <StatCard
              label="Pool Bookings"
              value={stats?.poolTotal ?? 0}
              sub="group bookings"
              accent="bg-blue-50 text-blue-600"
              icon={
                <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              }
            />
            <StatCard
              label="Students"
              value={stats?.studentsTotal ?? 0}
              sub="registered"
              accent="bg-emerald-50 text-emerald-600"
              icon={
                <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              }
            />
            <StatCard
              label="Active Blogs"
              value={stats?.blogsActive ?? 0}
              sub="published"
              accent="bg-violet-50 text-violet-600"
              icon={
                <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                </svg>
              }
            />
            <StatCard
              label="Testimonials"
              value={stats?.testimonialsActive ?? 0}
              sub="active"
              accent="bg-amber-50 text-amber-600"
              icon={
                <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              }
            />
            <StatCard
              label="Live Banners"
              value={banners.length}
              sub="on homepage"
              accent="bg-rose-50 text-rose-500"
              icon={
                <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              }
            />
          </div>

          {/* ── Active Banners Preview ── */}
          {banners.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">Active Banners</h2>
                <span className="text-xs text-gray-400">Sorted by priority</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map((b) => (
                  <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="relative">
                      <img
                        src={b.image.url}
                        alt="banner"
                        className="w-full aspect-video object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-sm">
                        #{b.priority}
                      </span>
                    </div>
                    <p className="px-3 py-2.5 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Quick Navigation ── */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick Access</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <QuickLink path="/admin/bookings" label="Bookings" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              } />
              <QuickLink path="/admin/students" label="Students" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              } />
              <QuickLink path="/admin/faculty" label="Faculty" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              } />
              <QuickLink path="/admin/blogs" label="Blogs" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                </svg>
              } />
              <QuickLink path="/admin/banners" label="Banners" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              } />
              <QuickLink path="/admin/testimonials" label="Testimonials" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              } />
              <QuickLink path="/admin/class" label="Classes" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              } />
              <QuickLink path="/admin/chapters" label="Chapters" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              } />
            </div>
          </section>
        </>
      )}
    </AdminPageContainer>
  );
}