import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../../../shared/utils/logout";
import { useLogout } from "../../auth/hooks/useLogout";
import toast from "react-hot-toast";
import type { AuthUser } from "../../auth/type/auth.type";
import BrandMark from "../../user/components/ui/BrandMark";

const ALL_NAV_ITEMS = [
  { label: "Faculty",      path: "/admin/faculty" },
  { label: "Classes",      path: "/admin/class" },
  { label: "Syllabus",     path: "/admin/syllabus" },
  { label: "Subjects",     path: "/admin/subjects" },
  { label: "Chapters",     path: "/admin/chapters" },
  { label: "Bookings",     path: "/admin/bookings" },
  { label: "Testimonials", path: "/admin/testimonials" },
  { label: "Blogs",        path: "/admin/blogs" },
  { label: "Banners",      path: "/admin/banners" },
  { label: "Students",     path: "/admin/students" },
  { label: "Users",        path: "/admin/users" },
  { label: "Leads",        path: "/admin/leads" },
];

const SALES_PERSON_PATHS = new Set(["/admin/bookings"]);

const AdminNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useLogout();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<AuthUser>(["auth-user"]);

  const navItems =
    user?.role === "salesPerson"
      ? ALL_NAV_ITEMS.filter((item) => SALES_PERSON_PATHS.has(item.path))
      : ALL_NAV_ITEMS;

  const handleLogout = async () => {
    try {
      await mutateAsync();
    } finally {
      logout();
      toast.success("Logged out successfully");
      navigate("/admin/login", { replace: true });
    }
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `inline-block py-2 transition whitespace-nowrap ${
      isActive
        ? "text-[#6D35D9] font-semibold underline decoration-[#FF6B5E] decoration-2 underline-offset-[6px]"
        : "text-gray-600 hover:text-[#6D35D9]"
    }`;

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-200"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">

        {/* Brand - Added shrink-0 and min-w-max so it never squishes */}
        <Link to="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0">
          <BrandMark className="h-7 sm:h-8 lg:h-6 xl:h-8" />
          <span className="hidden sm:inline-flex lg:hidden xl:inline-flex items-center h-6 px-2.5 rounded-full bg-[#F4F1FA] border border-[#E4DDF2] text-[11px] font-semibold uppercase tracking-wider text-[#6D35D9]">
            Admin
          </span>
        </Link>

        {/* Desktop Nav - Changed hidden md:flex to hidden lg:flex */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-6 text-sm font-medium overflow-x-auto no-scrollbar pl-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClasses}
            >
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="text-[#6D35D9] cursor-pointer whitespace-nowrap ml-2"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Toggle - Changed md:hidden to lg:hidden */}
        <button
          className="lg:hidden text-gray-800 shrink-0 ml-4"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                open
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu - Changed md:hidden to lg:hidden */}
      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 absolute w-full shadow-md">
          <nav className="flex flex-col space-y-4 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block w-full border-l-2 pl-2.5 ${
                    isActive
                      ? "border-[#FF6B5E] text-[#6D35D9] font-semibold"
                      : "border-transparent text-gray-700 hover:text-[#6D35D9]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="block w-full text-left text-[#6D35D9] font-medium pt-3 border-t border-gray-200 cursor-pointer transition-opacity hover:opacity-80"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;