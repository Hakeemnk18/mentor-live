import { Link } from "react-router-dom";
import BrandMark from "./ui/BrandMark";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, WHATSAPP_URL } from "../../../shared/constants/contact";
import { SocialIconLinks } from "./ui/SocialIcons";
import Bear from "./ui/Bear";
import SnowCanvas from "./ui/SnowCanvas";

const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "Book Tutor", to: "/book-tutor" },
  { label: "Blogs", to: "/blogs" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const IceChunk = ({ w, h, o1, o2 }: { w: number; h: number; o1: number; o2: number }) => (
  <svg width={w} height={h} viewBox="0 0 70 46" aria-hidden="true">
    <polygon points="4,40 18,10 34,2 52,14 66,40" fill="#9CC2F2" opacity={o1} />
    <polygon points="18,10 34,2 30,40 4,40" fill="#CFE3FF" opacity={o2} />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-ml-night text-ml-soft">
      {/* Top wave out of the page background */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" className="absolute left-0 -top-px w-full h-10 block -scale-y-100">
        <path d="M0 30 C200 60 400 0 720 26 C1040 52 1240 8 1440 30 L1440 60 L0 60 Z" fill="#F7F5FC" />
      </svg>

      <SnowCanvas flakes={70} speed={0.7} />

      {/* Floating ice chunks (desktop only) */}
      <div className="hidden lg:block absolute left-[36%] top-[70px] pointer-events-none">
        <div className="animate-ml-float" style={{ animationDuration: "9s" }}>
          <IceChunk w={70} h={46} o1={0.35} o2={0.35} />
        </div>
      </div>
      <div className="hidden lg:block absolute left-[52%] top-[170px] pointer-events-none">
        <div className="animate-ml-float" style={{ animationDuration: "11s" }}>
          <IceChunk w={42} h={28} o1={0.28} o2={0.3} />
        </div>
      </div>

      {/* Ice-shelf landscape + walking bear */}
      <div className="absolute inset-x-0 bottom-0 h-[clamp(150px,17vw,240px)] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className="absolute inset-0 w-full h-full block">
          <defs>
            <linearGradient id="mlIceA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B4FA8" /><stop offset="1" stopColor="#3D2770" /></linearGradient>
            <linearGradient id="mlIceB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8F2FF" /><stop offset=".55" stopColor="#B9D5F8" /><stop offset="1" stopColor="#8DB4EC" /></linearGradient>
            <linearGradient id="mlIceC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DCEAFB" /></linearGradient>
          </defs>
          <polygon points="0,260 0,140 110,80 200,120 330,30 440,110 560,70 690,130 800,40 930,100 1050,20 1180,110 1300,60 1440,120 1440,260" fill="url(#mlIceA)" />
          <polygon points="330,30 380,120 300,120" fill="#8A70C2" opacity=".45" />
          <polygon points="800,40 850,130 770,130" fill="#8A70C2" opacity=".45" />
          <polygon points="1050,20 1110,120 1020,120" fill="#8A70C2" opacity=".45" />
          <polygon points="0,260 0,180 80,140 170,170 290,90 400,160 520,130 640,180 760,105 880,165 1000,120 1120,175 1240,95 1350,150 1440,130 1440,260" fill="url(#mlIceB)" />
          <polygon points="290,90 330,170 250,175" fill="#fff" opacity=".55" />
          <polygon points="760,105 800,180 730,180" fill="#fff" opacity=".55" />
          <polygon points="1240,95 1285,175 1205,175" fill="#fff" opacity=".55" />
          <polygon points="520,130 560,190 500,190" fill="#fff" opacity=".4" />
          <polygon points="0,260 0,222 150,200 320,218 500,196 700,222 900,200 1100,220 1280,204 1440,218 1440,260" fill="url(#mlIceC)" />
        </svg>
        <div className="absolute left-[68%] bottom-[clamp(30px,3.6vw,52px)] w-[clamp(56px,6vw,84px)]">
          <div className="animate-ml-bob" style={{ animationDuration: "2.2s" }}>
            <Bear pose="walk" />
          </div>
        </div>
      </div>

      <div className="relative max-w-[1200px] mx-auto px-5 pt-20 pb-[clamp(170px,19vw,260px)] flex flex-col gap-10">
        <div className="flex flex-wrap gap-9 justify-between">
          <div className="flex-[1_1_280px] flex flex-col gap-4 max-w-[360px]">
            <Link to="/" className="self-start hover:opacity-90 transition-opacity" aria-label="Mentorlive home">
              <BrandMark tone="dark" className="h-11" />
            </Link>
            <p className="m-0 text-[15px] leading-relaxed text-[#C9BFDD]">
              Your gateway to expert mentorship and learning. Learn one-on-one or together in small pools.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-7">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-extrabold tracking-[0.16em] text-ml-peach">EXPLORE</span>
              {exploreLinks.map((l) => (
                <Link key={l.to} to={l.to} className="font-semibold text-[15px] whitespace-nowrap text-ml-soft hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-extrabold tracking-[0.16em] text-ml-peach">CONTACT</span>
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="font-extrabold text-lg text-white hover:text-ml-peach transition-colors">
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-[15px] text-ml-ice hover:text-white transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366]" aria-hidden />
                Chat on WhatsApp
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[15px] text-ml-ice hover:text-white transition-colors">
                {CONTACT_EMAIL}
              </a>
              <span className="mt-2 text-xs font-extrabold tracking-[0.16em] text-ml-peach">FOLLOW US</span>
              <SocialIconLinks />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between pt-[22px] border-t border-white/12 text-[13px] text-[#A99DC4]">
          <span>© {new Date().getFullYear()} Mentorlive. All rights reserved.</span>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="text-[#A99DC4] hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-[#A99DC4] hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
