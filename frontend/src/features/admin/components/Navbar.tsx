import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../../shared/utils/logout";
import { useLogout } from "../../auth/hooks/useLogout";
import toast from "react-hot-toast";

const navItems = [
  { label: "Faculty", path: "/admin/faculty" },
  { label: "Classes", path: "/admin/class" },
  { label: "Syllabus", path: "/admin/syllabus" },
  { label: "Subjects", path: "/admin/subjects" },
  { label: "Chapters", path: "/admin/chapters" },
  { label: "Bookings", path: "/admin/bookings" },
  { label: "Students", path: "/admin/students" },
];

const AdminNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useLogout();
  const navigate = useNavigate();

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
    `transition ${
      isActive
        ? "text-[#DB313E] font-semibold"
        : "text-gray-600 hover:text-[#DB313E]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-[#DB313E] text-white flex items-center justify-center font-bold">
            ML
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              Mentor Live
            </p>
            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
            className="text-[#DB313E] cursor-pointer"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-800"
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

      {/* Mobile Menu */}
      {/* Mobile Menu */}
{open && (
  <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4">
    <nav className="flex flex-col space-y-4 text-sm">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `block w-full ${
              isActive
                ? "text-[#DB313E] font-semibold"
                : "text-gray-700 hover:text-[#DB313E]"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}

     <button
  onClick={handleLogout}
  className="block w-full text-left text-[#DB313E] font-medium pt-3 border-t border-gray-200 cursor-pointer transition-opacity hover:opacity-80"
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
