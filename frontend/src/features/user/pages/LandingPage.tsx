import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import BannerCarousel from "../components/BannerCarousel";
import HomeHero from "../components/home/HomeHero";
import HomeStats from "../components/home/HomeStats";
import PoolSection from "../components/home/PoolSection";
import ClassSizeSection from "../components/home/ClassSizeSection";
import HowItWorks from "../components/home/HowItWorks";
import FacultySection from "../components/home/FacultySection";
import TestimonialSection from "../components/home/TestimonialSection";
import BlogSection from "../components/home/BlogSection";
import CtaSection from "../components/home/CtaSection";

const LandingPage: React.FC = () => {
  const { hash } = useLocation();
  const howRef = useRef<HTMLElement>(null);

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
      <HomeHero onHowItWorks={() => howRef.current?.scrollIntoView({ behavior: "smooth" })} />
      <HomeStats />
      <BannerCarousel />
      <PoolSection />
      <ClassSizeSection />
      <HowItWorks ref={howRef} />
      <FacultySection />
      <TestimonialSection />
      <BlogSection />
      <CtaSection />
    </div>
  );
};

export default LandingPage;
