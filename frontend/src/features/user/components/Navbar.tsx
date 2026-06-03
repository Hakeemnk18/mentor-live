import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const LOGO_URL =
  "https://res.cloudinary.com/do1vnusmw/image/upload/v1780401724/Screenshot_2026-06-02_173134_rr96r6.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "How it Works", path: "/#how-it-works" },
];

const linkCls =
  "text-[15px] text-gray-600 hover:text-[#DB313E] transition-colors duration-150 whitespace-nowrap";

const UserNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-5 md:px-8">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
            <img
              src={LOGO_URL}
              alt="Mentor Live"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={linkCls}
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
            className="md:hidden text-gray-700 p-1 -mr-1 cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg
              className="w-6 h-6 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown — absolute so it floats over page content */}
        <div
          className={`md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-lg origin-top transition-all duration-200 ease-in-out ${
            open
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "opacity-0 scale-y-95 pointer-events-none"
          }`}
        >
          <nav className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setOpen(false)}
                className="text-[15px] text-gray-600 hover:text-[#DB313E] transition-colors duration-150"
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/book-tutor"
              onClick={() => setOpen(false)}
              className="text-center bg-[#DB313E] text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-[#c12a36] transition-colors mt-1"
            >
              Book Tutor
            </Link>
          </nav>
        </div>
      </header>

      {/* Backdrop — sits above page but below the floating dropdown, closes menu on outside click */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
    </>
  );
};

export default UserNavbar;
