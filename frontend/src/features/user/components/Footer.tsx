import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded bg-[#DB313E] text-white flex items-center justify-center font-bold text-sm">
                ML
              </div>
              <p className="text-white font-semibold">Mentor Live</p>
            </Link>
            <p className="text-sm text-gray-400">
              Your gateway to expert mentorship and learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@mentorlive.com</li>
              <li>+91 00000 00000</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Mentor Live. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
