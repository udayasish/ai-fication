import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ToolsWeCover from "@/components/landing/ToolsWeCover";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── How it works ── */}
      <HowItWorks />

      {/* ── Tools we cover ── */}
      <ToolsWeCover />

      {/* ── CTA ── */}
      <CTASection />
    </div>
  );
}
