import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "How it Works", path: "/how-it-works" },
];

const UserNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition text-[15px] ${
      isActive
        ? "text-[#DB313E] font-semibold"
        : "text-gray-700 hover:text-[#DB313E]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-5 md:px-8">

        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="flex items-center">
            <span className="text-[28px] font-extrabold tracking-tight text-gray-900">
              ment
            </span>
            <span className="relative inline-flex items-center justify-center bg-[#DB313E] text-white text-[13px] font-bold rounded px-1.5 py-0.5 mx-[2px] -top-[1px]">
              Live
            </span>
            <span className="text-[28px] font-extrabold tracking-tight text-gray-900">
              r
            </span>
          </div>
          <span className="text-[10px] text-gray-400 tracking-wide -ml-1 mt-5 hidden sm:block">
            customized online learning
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={linkClasses}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/book-tutor"
            className="bg-[#DB313E] text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-[#c12a36] transition-colors shadow-sm"
          >
            Book Tutor
          </Link>
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
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-5">
          <nav className="flex flex-col space-y-4 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
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
            <Link
              to="/book-tutor"
              onClick={() => setOpen(false)}
              className="inline-block text-center bg-[#DB313E] text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-[#c12a36] transition-colors"
            >
              Book Tutor
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
