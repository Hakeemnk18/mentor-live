import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import BrandMark from "./ui/BrandMark";
import { ArrowRight } from "./ui/Icons";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "How it Works", path: "/#how-it-works" },
];

const UserNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  // NavLink can't tell "/" from "/#how-it-works", so work out the active item ourselves
  const isActive = (path: string) => {
    if (path === "/#how-it-works") return pathname === "/" && hash === "#how-it-works";
    if (path === "/") return pathname === "/" && hash !== "#how-it-works";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[rgba(247,245,252,0.88)] backdrop-blur-[14px] border-b border-ml-plum/8">
        <div className="max-w-[1200px] mx-auto px-5 h-[72px] flex items-center justify-between gap-4">
          <Link to="/" className="flex-shrink-0 hover:opacity-90 transition-opacity" aria-label="Mentorlive home">
            <BrandMark />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-[30px] flex-shrink-0 whitespace-nowrap">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative py-1.5 text-[15px] transition-colors hover:text-ml-violet ${
                    active ? "font-extrabold text-ml-deep" : "font-semibold text-ml-muted"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 -bottom-0.5 h-[3px] rounded-[3px] bg-ml-coral transition-[width] duration-300"
                    style={{ width: active ? "100%" : "0%" }}
                  />
                </NavLink>
              );
            })}
            <Link
              to="/book-tutor"
              className="h-11 px-[22px] rounded-full bg-ml-violet text-white font-bold text-[15px] inline-flex items-center gap-2 shadow-[0_8px_20px_-8px_rgba(109,53,217,.7)] transition-transform hover:-translate-y-0.5 hover:text-white"
            >
              Book Tutor
              <ArrowRight strokeWidth={2.6} />
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden w-[46px] h-[46px] rounded-[14px] bg-ml-lav text-ml-plum flex items-center justify-center cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
              <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile dropdown — floats over page content */}
        <div
          className={`md:hidden absolute left-3 right-3 top-[78px] bg-white rounded-3xl p-3 shadow-[0_24px_48px_-12px_rgba(42,22,80,.35)] flex flex-col gap-1 origin-top transition-all duration-200 ${
            open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-3.5 rounded-[14px] font-bold text-base ${
                  active ? "text-ml-deep bg-ml-lav" : "text-ml-muted"
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
          <Link
            to="/book-tutor"
            onClick={() => setOpen(false)}
            className="mt-1.5 h-[52px] rounded-2xl bg-ml-violet text-white font-extrabold text-base flex items-center justify-center hover:text-white"
          >
            Book Tutor
          </Link>
        </div>
      </header>

      {/* Backdrop — closes the mobile menu on outside tap */}
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
