import { getContent } from "../lib/content";
import Motion from "../components/Motion";
import SiteHeader from "../components/sections/SiteHeader";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import CapabilitiesSection from "../components/sections/CapabilitiesSection";
import SkillsSection from "../components/sections/SkillsSection";
import GrowthSection from "../components/sections/GrowthSection";
import ContactSection from "../components/sections/ContactSection";
import SiteFooter from "../components/sections/SiteFooter";
export const dynamic = "force-dynamic";
export default async function Home() {
  const content = await getContent();
  return (
    <>
      <Motion />
      <a className="skip" href="#main">
        К содержимому
      </a>
      <SiteHeader />
      <main id="main">
        <HeroSection content={content} />
        <AboutSection content={content} />
        <ProjectsSection content={content} />
        <CapabilitiesSection />
        <SkillsSection content={content} />
        <GrowthSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
