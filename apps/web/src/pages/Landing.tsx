import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  ZapIcon,
  LockIcon,
  BarChartIcon,
  GlobeIcon,
  SparklesIcon,
  TagIcon,
  CalendarIcon,
} from '../components/Icons';
import { useEffectVisibility } from '../lib/useEffectVisibility';
const ProblemShaderCards = lazy(() => import('../components/ProblemShaderCards'));
const HowItWorksBooksShowcase = lazy(() => import('../components/HowItWorksBooksShowcase'));
const BrutalistBentoCharts = lazy(() => import('../components/BrutalistCharts'));
import { HeroCarousel } from '@/components/ui/hero-carousel';
import { LOOKS } from '@/components/ui/demo';
const TurbulentFlow = lazy(() => import('@/components/ui/turbulent-flow'));
import { GetStartedButton } from '../components/GetStartedButton';

function DeferredSection({ children, height, id }: { children: React.ReactNode; height: number; id: string }) {
  const { ref, visited } = useEffectVisibility<HTMLDivElement>('300px');
  return <div ref={ref} id={id} style={{ minHeight: visited ? undefined : height }}>
    {visited && <Suspense fallback={<div style={{ minHeight: height }} />}>{children}</Suspense>}
  </div>;
}



import ShaderShowcase from '@/components/ui/hero';

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = React.memo(({ onCTA }: { onCTA: () => void }) => {
  return (
    <section
      className="relative isolate flex flex-col items-center justify-start overflow-hidden"
      style={{ animation: 'fadeIn 0.6s ease-out' }}
    >
      <div className="w-full">
        <ShaderShowcase onCTA={onCTA} showNav={false} />
      </div>

      {/* Editorial Category Filmstrip Showcase */}
      <div className="relative z-10 w-full max-w-6xl min-w-0 px-4 pb-8 sm:px-6 sm:pb-16 pt-8">
        <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-500 sm:px-2">
          <span><span className="text-amber-400">01</span> / Browse the signal</span>
          <span className="hidden sm:inline">Drag · scroll · compare</span>
        </div>
        <div className="relative h-[390px] w-full overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 shadow-[0_30px_100px_rgba(0,0,0,0.72),0_0_70px_rgba(245,158,11,0.08)] ring-1 ring-black/40 sm:h-[470px] sm:rounded-3xl lg:h-[560px]">
          <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] ring-1 ring-inset ring-white/10" aria-hidden="true" />
          <HeroCarousel
            items={LOOKS}
            defaultIndex={0}
            brand="HUSTLERADAR · LIVE ARBITRAGE AUDIT"
            autoplay={true}
            autoplayDelay={4500}
            className="w-full h-full"
          />
        </div>
        <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-mono uppercase tracking-[0.14em] text-neutral-600 sm:px-2">
          <span>Each card is a category, every price is a claim.</span>
          <span className="hidden text-neutral-500 sm:inline">HustleRadar / Live audit</span>
        </div>
      </div>
    </section>
  );
});
Hero.displayName = 'Hero';

// ─── MockupCard — a real rendered preview of the verdict UI ───────────────────
function MockupCard() {
  const sellers = [
    { name: 'BOAT', price: 999, link: '#' },
    { name: 'AMAZON', price: 999, link: '#' },
    { name: 'GADGETS', price: 1099, link: '#' },
    { name: 'SWAPNA I', price: 1230, link: '#' },
    { name: 'ADDMECAR', price: 1249, link: '#' },
    { name: 'NALANDA', price: 1399, link: '#' },
  ];

  return (
    <div
      className="w-full rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black"
      style={{
        boxShadow: '0 0 80px rgba(245,158,11,0.12), 0 40px 100px rgba(0,0,0,0.8)',
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800" style={{ background: '#0b0b12' }}>
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <span className="w-3 h-3 rounded-full bg-green-400/80" />
        <div
          className="ml-4 flex-1 text-xs text-center py-1 px-3 rounded-md"
          style={{
            background: '#1a1a24',
            color: '#71717a',
            maxWidth: 240,
            margin: '0 auto',
          }}
        >
           hustleradar.local/app
        </div>
      </div>

      <div className="p-2 sm:p-4 md:p-5">
        <BrutalistBentoCharts
          sellers={sellers}
          claimedPrice={999}
          claimedOriginalPrice={2850}
          medianPrice={1185}
          verdict="genuine_deal"
          confidence="high"
          realDiscountPercent={16}
          mode="demo"
        />
      </div>
    </div>
  );
}




// ─── Live Deal Audit Verdict Preview ───────────────────────────────────────────
function LiveVerdictPreviewSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative z-10 px-4 py-14 sm:px-6 sm:py-20" id="showcase">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest mb-3 font-semibold text-amber-500">
            Live Deal & Arbitrage Audit
          </div>
          <h2
            className="mb-4 text-[clamp(1.875rem,6vw,3rem)] font-medium leading-tight"
            style={{
              background: 'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.65))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.04em',
            }}
          >
            What your margin looks like.
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base md:text-lg">
            Every scan returns cross-store pricing, resale margin after fees, and a Gemma 2 AI verdict — so you know if the deal is worth flipping.
          </p>
        </div>

        {/* Mockup / dashboard preview with warm ambient glow */}
        <div className="w-full relative pb-4">
          <div
            className="absolute left-1/2 w-[90%] pointer-events-none z-0"
            style={{ top: '-18%', transform: 'translateX(-50%)' }}
            aria-hidden="true"
          >
            <div
              style={{
                width: '100%',
                paddingBottom: '30%',
                background:
                  'radial-gradient(ellipse at center, rgba(245,158,11,0.18) 0%, rgba(217,119,6,0.06) 50%, transparent 80%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
              }}
            />
          </div>

          <div className="relative z-10">
            <MockupCard />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────
function FooterCTA({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="px-4 py-16 text-center sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <h2
          className="mb-5 text-[clamp(2rem,7vw,3rem)] font-medium leading-tight"
          style={{
            background: 'linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.05em',
          }}
        >
          One scan. Know if it's worth the flip.
        </h2>
        <p className="text-sm md:text-base mb-10" style={{ color: '#9ca3af' }}>
          See buy cost, resale margin, and marketplace fees before you commit inventory.
        </p>
        <div className="flex flex-col items-center justify-center">
          <GetStartedButton
            id="footer-cta-btn"
            label="SCAN A FLIP"
            size="lg"
            onClick={onCTA}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="trust" className="border-t border-gray-800/50 px-4 py-8 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm font-semibold text-white">
          Hustle<span style={{ color: '#f59e0b' }}>Radar</span>
        </div>
        <div className="text-xs" style={{ color: '#6b7280' }}>
          © 2026 HustleRadar
        </div>
      </div>
    </footer>
  );
}

import BottomNavBar, { BottomNavItem } from '@/components/ui/bottom-nav-bar';
import { Home, LineChart, CreditCard, MessageCircle, Trophy, User } from 'lucide-react';

// ─── Landing page ─────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const goToApp = () => navigate('/app');
  const [activeNavIndex, setActiveNavIndex] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 280;
      const sections = ['why-section', 'how-section', 'showcase-section', 'trust'];

      if (window.scrollY < 260) {
        setActiveNavIndex(0);
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveNavIndex(i + 1);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: BottomNavItem[] = React.useMemo(() => [
    { label: "Home", icon: Home, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: "Traps", icon: LineChart, onClick: () => document.getElementById("why-section")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Workflow", icon: CreditCard, onClick: () => document.getElementById("how-section")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Showcase", icon: Trophy, onClick: () => document.getElementById("showcase-section")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Data", icon: MessageCircle, onClick: () => document.getElementById("trust")?.scrollIntoView({ behavior: "smooth" }) },
  ], []);

  return (
    <main className="min-h-screen bg-black text-white relative" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
       {/* Fonts are loaded once in index.html. */}
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Floating Top Pill Navbar (replaces old top navbar) */}
      <BottomNavBar
        stickyTop={true}
        items={navItems}
        activeIndex={activeNavIndex}
        onSelect={(idx) => setActiveNavIndex(idx)}
        onFindFlip={goToApp}
      />

      <Hero onCTA={goToApp} />
      <DeferredSection height={600} id="why-section"><ProblemShaderCards onCTA={goToApp} /></DeferredSection>
      <DeferredSection height={1200} id="how-section"><HowItWorksBooksShowcase onCTA={goToApp} /></DeferredSection>
      <DeferredSection height={1100} id="showcase-section"><LiveVerdictPreviewSection onCTA={goToApp} /></DeferredSection>
      <FooterCTA onCTA={goToApp} />
      <Footer />
    </main>
  );
}
