import { useEffect, useRef, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ImpactGoals } from './components/ImpactGoals';
import { JoinModal } from './components/JoinModal';
import { JoinPanel } from './components/JoinPanel';
import { LagosEastPresence } from './components/LagosEastPresence';
import { LeadershipSection } from './components/LeadershipSection';
import { NewsSection } from './components/NewsSection';
import { ProgramsStrip } from './components/ProgramsStrip';
import { SectorCards } from './components/SectorCards';
import type { MembershipCategory } from './data/content';
import { currentHash, parseHash, type RouteState } from './lib/routing';
import { scrollToIdWhenReady } from './lib/scroll';
import { applyDocumentMeta } from './lib/seo';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { StructurePage } from './pages/StructurePage';

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => parseHash(currentHash()));
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinPreset, setJoinPreset] = useState<MembershipCategory | undefined>();
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sync = () => setRoute(parseHash(currentHash()));
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    applyDocumentMeta(route);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';

    if (route.view === 'programs' && route.section && route.section !== 'programs') {
      return scrollToIdWhenReady(route.section, behavior);
    }

    if (route.view !== 'home') {
      window.scrollTo(0, 0);
      return;
    }

    if (!route.section || route.section === 'home') {
      window.scrollTo(0, 0);
      return;
    }

    return scrollToIdWhenReady(route.section, behavior);
  }, [route]);

  useEffect(() => {
    if (joinOpen) return;
    const node = lastFocus.current;
    if (!node) return;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (node.isConnected) node.focus();
        else document.querySelector<HTMLElement>('[data-join-trigger]')?.focus();
        lastFocus.current = null;
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [joinOpen]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#/')) return;
      event.preventDefault();
      if (window.location.hash === href) {
        const id = href.slice(1).split('/')[0];
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        scrollToIdWhenReady(id, reduce ? 'auto' : 'smooth');
        return;
      }
      window.location.hash = href;
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const openJoin = (category?: MembershipCategory) => {
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setJoinPreset(category);
    setJoinOpen(true);
  };

  return (
    <div className="app">
      <a className="skipLink" href="#main">
        Skip to content
      </a>
      <Header route={route} onJoin={() => openJoin()} />
      <div id="main">
        {route.view === 'home' && (
          <main>
            <Hero onJoin={() => openJoin()} />
            <SectorCards />
            <ImpactGoals />
            <LagosEastPresence />
            <section id="home-lower" className="lowerGrid" aria-label="Leadership, news and membership">
              <LeadershipSection />
              <NewsSection />
              <JoinPanel onJoin={openJoin} />
            </section>
            <ProgramsStrip />
          </main>
        )}
        {route.view === 'about' && <AboutPage />}
        {route.view === 'programs' && <ProgramsPage />}
        {route.view === 'resources' && <ResourcesPage />}
        {route.view === 'structure' && <StructurePage />}
        {route.view === 'contact' && <ContactPage />}
        {route.view === 'legal' && route.legal && <LegalPage slug={route.legal} />}
        {route.view === 'notfound' && <NotFoundPage />}
      </div>
      <Footer />
      <JoinModal open={joinOpen} preset={joinPreset} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
