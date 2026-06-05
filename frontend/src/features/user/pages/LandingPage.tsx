import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import heroImage from "/hero-image.png";
import { getFaculties } from "../../../api/faculty.api";
import { getFeaturedBlogs } from "../../../api/blog.api";
import { getTestimonials } from "../../../api/testimonial.api";
import FacultyCard from "../components/FacultyCard";
import BlogCard from "../components/BlogCard";
import TestimonialCard from "../components/TestimonialCard";
import BannerCarousel from "../components/BannerCarousel";

const stats = [
  { value: "500+", label: "QUALIFIED TUTORS" },
  { value: "50+", label: "SUBJECTS COVERED" },
  { value: "10k+", label: "HAPPY STUDENTS" },
  { value: "4.9/5", label: "AVG RATING" },
];

const LandingPage: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div>

      {/* ─── Hero Section ─── */}
      <section className="bg-[#FAFAFA] py-12 md:py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Left – Copy */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-[52px] leading-[1.15] font-extrabold text-gray-900">
              Master Your{" "}
              <br className="hidden sm:block" />
              Future with{" "}
              <br className="hidden sm:block" />
              <span className="text-[#DB313E]">Expert Guidance</span>
            </h1>

            <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed">
              Connect with world-class faculty for personalized online tutoring
              that drives real academic result
            </p>

            <a
              href="/book-tutor"
              className="inline-block bg-[#DB313E] text-white font-semibold text-sm px-8 py-3.5 rounded-md hover:bg-[#c12a36] transition-colors shadow-md hover:shadow-lg"
            >
              Book Tutor
            </a>
          </div>

          {/* Right – Hero Image */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[480px]">
              <div className="absolute -inset-1 border-2 border-[#DB313E]/20 rounded-md" />
              <img
                src={heroImage}
                alt="Architectural geometry – Expert Guidance"
                className="w-full h-[320px] md:h-[380px] object-cover rounded-md grayscale relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Banner Carousel ─── */}
      <BannerCarousel />

      {/* ─── Stats Section ─── */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-[11px] md:text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pool Learning Advantages Section ─── */}
      <section className="bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20">

            {/* Left – Copy */}
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-[42px] leading-[1.15] font-extrabold text-gray-900">
                  Learn Together.{" "}
                  <span className="text-[#DB313E]">Pay Less.</span>
                </h2>
                <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed">
                  Choose to study or share a faculty with up to 5 students
                  and split the cost without compromising quality
                </p>
              </div>

              {/* Advantage bullets */}
              <div className="space-y-5">
                {[
                  {
                    title: "Flexible Group Size",
                    desc: "Learn solo or with 2-5 students",
                  },
                  {
                    title: "Cost Sharing",
                    desc: "Split faculty fees and reduce learning cost",
                  },
                  {
                    title: "Same faculty, Same Quality",
                    desc: "No content compromise only smarter pricing",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    {/* Red check icon */}
                    <div className="flex-shrink-0 w-6 h-6 bg-[#DB313E] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/pool-classes"
                className="inline-block bg-[#DB313E] text-white font-semibold text-sm px-8 py-3.5 rounded-md hover:bg-[#c12a36] transition-colors shadow-md hover:shadow-lg"
              >
                Find Group learning Options
              </a>
            </div>

            {/* Right – Tutor-to-Students Illustration */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative w-full max-w-[420px]">
                {/* Tutor avatar */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#DB313E]/20 to-[#DB313E]/5 border-2 border-dashed border-[#DB313E]/30 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#DB313E]/10 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#DB313E]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Connector lines (SVG) */}
                <svg className="absolute top-[88px] left-1/2 -translate-x-1/2 w-[320px] h-[50px]" viewBox="0 0 320 50" fill="none">
                  <path d="M160 0 L60 50" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M160 0 L160 50" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M160 0 L260 50" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="4 3" />
                </svg>

                {/* Student groups */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {/* Group 1 – 2 Students */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center gap-1">
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                      </svg>
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500">2 Students</span>
                  </div>

                  {/* Group 2 – 2 Students */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center gap-1">
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                      </svg>
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500">2 Students</span>
                  </div>

                  {/* Group 3 – Up to 5 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center gap-0.5">
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                      </svg>
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                      </svg>
                      <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-500">Up to 5 Students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How Learning Works Section ─── */}
      <section id="how-it-works" className="bg-[#F3F3F3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-[40px] font-extrabold text-gray-900 mb-4">
              How Learning Works
            </h2>
            <div className="w-16 h-1 bg-[#DB313E] mx-auto rounded-full" />
          </div>

          {/* Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

            {/* Step 1 */}
            <div className="relative bg-white rounded-md shadow-md hover:shadow-lg transition-shadow pt-10 pb-6 px-6 text-center">
              {/* Number badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 bg-[#DB313E] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm">
                1
              </div>
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-[#DB313E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 48 48">
                  <rect x="8" y="6" width="26" height="32" rx="3" />
                  <path d="M15 16h12M15 22h12M15 28h8" strokeLinecap="round" />
                  <path d="M38 14v24a4 4 0 01-4 4H12" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                Share Your<br />Learning Needs
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Class, syllabus, goals.
              </p>
              {/* Bottom accent */}
              <div className="w-16 h-1 bg-[#DB313E] mx-auto mt-5 rounded-full" />
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-md shadow-md hover:shadow-lg transition-shadow pt-10 pb-6 px-6 text-center">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 bg-[#DB313E] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm">
                2
              </div>
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-[#DB313E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 48 48">
                  <circle cx="16" cy="16" r="6" />
                  <circle cx="32" cy="16" r="6" />
                  <path d="M6 36c0-5 4.5-8 10-8s10 3 10 8" strokeLinecap="round" />
                  <path d="M28 36c0-5 4.5-8 10-8s10 3 10 8" strokeLinecap="round" />
                  <path d="M30 24l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                Get Matched<br />& Choose Mode
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                View matched faculty.<br />
                Choose 1-to-1 or<br />
                group (pooling).
              </p>
              <div className="w-16 h-1 bg-[#DB313E] mx-auto mt-5 rounded-full" />
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-md shadow-md hover:shadow-lg transition-shadow pt-10 pb-6 px-6 text-center">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 bg-[#DB313E] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm">
                3
              </div>
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-[#DB313E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 48 48">
                  <circle cx="24" cy="14" r="7" />
                  <path d="M12 38c0-6 5-10 12-10s12 4 12 10" strokeLinecap="round" />
                  <path d="M30 18l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                Register &<br />Confirm
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Submit details.<br />
                Our team contacts you<br />
                to confirm schedule & payment.
              </p>
              <div className="w-16 h-1 bg-[#DB313E] mx-auto mt-5 rounded-full" />
            </div>

            {/* Step 4 */}
            <div className="relative bg-white rounded-md shadow-md hover:shadow-lg transition-shadow pt-10 pb-6 px-6 text-center">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 bg-[#DB313E] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm">
                4
              </div>
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-[#DB313E]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 48 48">
                  <rect x="6" y="10" width="28" height="20" rx="3" />
                  <path d="M34 20h6a2 2 0 012 2v10a2 2 0 01-2 2H22" strokeLinecap="round" />
                  <circle cx="18" cy="20" r="4" />
                  <path d="M26 26h-4" strokeLinecap="round" />
                  <path d="M26 22h-2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                Start Learning
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Live sessions begin<br />
                with your assigned faculty.
              </p>
              <div className="w-16 h-1 bg-[#DB313E] mx-auto mt-5 rounded-full" />
            </div>

          </div>
        </div>
      </section>

      {/* ─── Meet Our Top Faculty Section ─── */}
      <FacultySection />

      {/* ─── Blog Section ─── */}
      <BlogSection />

      {/* ─── Testimonials Section ─── */}
      <TestimonialSection />

    </div>
  );
};

/* ── Faculty sub-component (keeps LandingPage clean) ── */
const FacultySection: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["landing-faculties"],
    queryFn: () => getFaculties({ page: 1, limit: 4, isDeleted: false }),
  });

  const faculties: {
    id: string;
    name: string;
    qualifications: string[];
    description: string;
    image?: { url: string; publicId: string };
  }[] = data?.data ?? [];

  return (
    <section className="bg-[#FAFAFA] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-[40px] font-extrabold text-gray-900 mb-4">
            Meet Our Top Faculty
          </h2>
          <div className="w-16 h-1 bg-[#DB313E] mx-auto rounded-full" />
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-md shadow-md animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {faculties.map((f) => (
              <FacultyCard
                key={f.id}
                id={f.id}
                name={f.name}
                qualifications={f.qualifications}
                description={f.description}
                image={f.image}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ── Blog carousel sub-component ── */
const BLOGS_PER_PAGE = 3;

const BlogSection: React.FC = () => {
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ["landing-blogs-featured"],
    queryFn: getFeaturedBlogs,
  });

  const blogs = featuredData ?? [];
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(blogs.length / BLOGS_PER_PAGE));
  const visible = blogs.slice(
    page * BLOGS_PER_PAGE,
    page * BLOGS_PER_PAGE + BLOGS_PER_PAGE
  );

  const prev = () => setPage((p) => (p > 0 ? p - 1 : totalPages - 1));
  const next = () => setPage((p) => (p < totalPages - 1 ? p + 1 : 0));

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-[40px] font-extrabold text-gray-900 mb-4">
            From Our Blog
          </h2>
          <div className="w-16 h-1 bg-[#DB313E] mx-auto rounded-full" />
        </div>

        {/* View All link */}
        <div className="flex justify-end mb-8">
          <a
            href="/blogs"
            className="inline-flex items-center gap-1 text-gray-700 text-sm font-semibold hover:text-[#DB313E] transition"
          >
            View All Posts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Cards + Arrows */}
        <div className="relative">
          {/* Left arrow */}
          {blogs.length > BLOGS_PER_PAGE && (
            <button
              onClick={prev}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-md shadow-md animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visible.map((b) => (
                <BlogCard
                  key={b.id}
                  id={b.id}
                  heading={b.heading}
                  description={b.description}
                  author={b.author}
                  image={b.image}
                  topic={b.topic}
                />
              ))}
            </div>
          )}

          {/* Right arrow */}
          {blogs.length > BLOGS_PER_PAGE && (
            <button
              onClick={next}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === page ? "bg-[#DB313E]" : "bg-gray-300"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ── Testimonial carousel sub-component ── */
const TESTIMONIALS_PER_PAGE = 3;

const TestimonialSection: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["landing-testimonials"],
    queryFn: getTestimonials,
  });

  const testimonials = (data ?? []).filter((t) => !t.isDeleted);
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE));
  const visible = testimonials.slice(
    page * TESTIMONIALS_PER_PAGE,
    page * TESTIMONIALS_PER_PAGE + TESTIMONIALS_PER_PAGE
  );

  const prev = () => setPage((p) => (p > 0 ? p - 1 : totalPages - 1));
  const next = () => setPage((p) => (p < totalPages - 1 ? p + 1 : 0));

  return (
    <section className="bg-[#F3F3F3] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-[40px] font-extrabold text-gray-900 mb-4">
            See What Our Students & Parents Are Saying
          </h2>
          <div className="w-16 h-1 bg-[#DB313E] mx-auto rounded-full" />
        </div>

        {/* Cards + Arrows */}
        <div className="relative">
          {/* Left arrow */}
          {testimonials.length > TESTIMONIALS_PER_PAGE && (
            <button
              onClick={prev}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-md shadow-md animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visible.map((t, i) => (
                <TestimonialCard
                  key={t.id}
                  author={t.author}
                  designation={t.designation}
                  comment={t.comment}
                  index={page * TESTIMONIALS_PER_PAGE + i}
                />
              ))}
            </div>
          )}

          {/* Right arrow */}
          {testimonials.length > TESTIMONIALS_PER_PAGE && (
            <button
              onClick={next}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === page ? "bg-[#DB313E]" : "bg-gray-300"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LandingPage;
