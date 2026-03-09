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

/* ── Stat card ── */
function StatCard({
  label, value, sub, icon, accent, alert, bgGradient
}: {
  label: string; value: number | string; sub?: string;
  icon: React.ReactNode; accent: string; alert?: boolean;
  bgGradient: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-white rounded-2xl border border-gray-100/60 shadow-sm hover:shadow-md transition-all duration-300 p-6 group`}>
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 blur-2xl ${bgGradient}`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${accent} ring-4 ring-white`}>
             {icon}
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
            <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">{label}</p>
          </div>
        </div>
        
        {sub && (
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap ${alert ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}`}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Quick link card ── */
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

/* ── Dashboard ── */
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [banners, setBanners] = useState<ActiveBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const results = await Promise.allSettled([
            getOneOnOneBookings({ page: 1, limit: 1 }),
            getOneOnOneBookings({ page: 1, limit: 1, isContacted: false }),
            getPoolBookings({ page: 1, limit: 1 }),
            getStudents({ page: 1, limit: 1 }),
            getBlogs({ limit: 1, page: 1 }),
            getTestimonials(),
            getBanners(),
          ]);

        const [oto, otoUncontacted, pool, students, blogs, testimonials, bannersData] = results;

        setStats({
          oneOnOneTotal: oto.status === "fulfilled" ? (oto.value.total ?? 0) : 0,
          oneOnOneUncontacted: otoUncontacted.status === "fulfilled" ? (otoUncontacted.value.total ?? 0) : 0,
          poolTotal: pool.status === "fulfilled" ? (pool.value.total ?? 0) : 0,
          studentsTotal: students.status === "fulfilled" ? (students.value.total ?? 0) : 0,
          blogsActive: blogs.status === "fulfilled" && blogs.value.data ? blogs.value.data.filter((b: any) => !b.isDeleted).length : 0,
          testimonialsActive: testimonials.status === "fulfilled" ? testimonials.value.filter((t: any) => !t.isDeleted).length : 0,
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

  const iconClass = "w-6 h-6";

  return (
    <AdminPageContainer>
      {/* ── Header ── */}
      <div className="mb-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 -mb-10 w-32 h-32 bg-[#DB313E] opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base max-w-xl">
            Welcome back to the MentorLive Admin Panel. Here's a summary of what's happening across your platform today.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-gray-200/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* ── Primary Metrics ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Platform Metrics</h2>
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Live Data</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <StatCard
                label="1:1 Bookings"
                value={stats?.oneOnOneTotal ?? 0}
                sub={stats?.oneOnOneUncontacted ? `${stats.oneOnOneUncontacted} Pending` : 'All caught up'}
                alert={!!stats?.oneOnOneUncontacted}
                accent="bg-[#DB313E] text-white"
                bgGradient="bg-[#DB313E]"
                icon={
                  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                }
              />
              <StatCard
                label="Pool Bookings"
                value={stats?.poolTotal ?? 0}
                sub="Total Groups"
                accent="bg-blue-600 text-white"
                bgGradient="bg-blue-600"
                icon={
                  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Registered Students"
                value={stats?.studentsTotal ?? 0}
                sub="Active Users"
                accent="bg-emerald-500 text-white"
                bgGradient="bg-emerald-500"
                icon={
                  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                }
              />
              <StatCard
                label="Public Blogs"
                value={stats?.blogsActive ?? 0}
                sub="Published Posts"
                accent="bg-violet-600 text-white"
                bgGradient="bg-violet-600"
                icon={
                  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                  </svg>
                }
              />
            </div>
          </section>

          {/* ── Quick Directory Navs ── */}
          <section className="bg-white border border-gray-100/60 shadow-sm rounded-2xl p-6">
             <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Directory Access</h2>
              <p className="text-sm text-gray-500 mt-1">Quick links to manage your platform content</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <QuickLink desc="Review student session bookings" path="/admin/bookings" label="Bookings Management" icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              } />
              <QuickLink desc="Directory of user accounts" path="/admin/students" label="Registered Students" icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              } />
              <QuickLink desc="Manage tutor and teacher profiles" path="/admin/faculty" label="Faculty Team" icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              } />
              <QuickLink desc="Edit homepage hero visuals" path="/admin/banners" label="Hero Banners" icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              } />
            </div>
          </section>

          {/* ── Active Banners Preview ── */}
          {banners.length > 0 && (
            <section className="bg-white border border-gray-100/60 shadow-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Active Homepage Banners</h2>
                  <p className="text-sm text-gray-500 mt-1">Sorted by display priority order</p>
                </div>
                <div className="hidden sm:flex bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  {banners.length} Live Banners
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((b) => (
                  <div key={b.id} className="bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                    <div className="relative overflow-hidden">
                      <img
                        src={b.image.url}
                        alt="banner"
                        className="w-full aspect-[21/9] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-bold bg-white/90 text-gray-900 backdrop-blur-md shadow-sm">
                        Priority #{b.priority}
                      </span>
                    </div>
                    {b.description && (
                      <p className="px-4 py-3.5 text-sm text-gray-600 leading-relaxed font-medium">
                        {b.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </AdminPageContainer>
  );
}